import { db } from "./db";
import { instances, provisionLogs } from "./db/schema";
import { createServer, getServer } from "./digitalocean";
import { eq } from "drizzle-orm";

interface ChannelConfig {
  type: string;
  config: Record<string, string>;
}

function generateProvisionScript(config: {
  model: string;
  apiKey: string;
  channels: ChannelConfig[];
  soulMd: string;
  agentsMd: string;
}): string {
  let channelYaml = "";
  for (const ch of config.channels) {
    if (ch.type === "telegram") {
      channelYaml += `\n  telegram:\n    token: "${ch.config.botToken}"\n    groupPolicy: open`;
    } else if (ch.type === "discord") {
      channelYaml += `\n  discord:\n    token: "${ch.config.botToken}"`;
      if (ch.config.guildId) channelYaml += `\n    guildId: "${ch.config.guildId}"`;
    }
  }

  const apiProvider = config.model.startsWith("anthropic") ? "ANTHROPIC_API_KEY" :
                      config.model.startsWith("openai") ? "OPENAI_API_KEY" : "API_KEY";

  return `#!/bin/bash
set -euo pipefail
export DEBIAN_FRONTEND=noninteractive

echo "[1/6] Updating system..."
apt-get update -qq && apt-get upgrade -y -qq

echo "[2/6] Installing Node.js 22..."
curl -fsSL https://deb.nodesource.com/setup_22.x | bash - > /dev/null 2>&1
apt-get install -y -qq nodejs

echo "[3/6] Creating openclaw user..."
useradd -m -s /bin/bash openclaw 2>/dev/null || true

echo "[4/6] Installing OpenClaw..."
sudo -u openclaw bash -c 'mkdir -p ~/.npm-global && npm config set prefix ~/.npm-global && npm install -g openclaw'

echo "[5/6] Configuring OpenClaw..."
sudo -u openclaw mkdir -p /home/openclaw/.openclaw /home/openclaw/clawd

cat > /home/openclaw/.openclaw/config.yaml << 'ECEOF'
model: ${config.model}
channels:${channelYaml}
env:
  vars:
    ${apiProvider}: "${config.apiKey}"
heartbeat:
  enabled: true
  intervalMinutes: 30
ECEOF

cat > /home/openclaw/clawd/SOUL.md << 'ECEOF'
${config.soulMd || "# My AI Assistant\\n\\nI am a helpful, friendly AI assistant."}
ECEOF

cat > /home/openclaw/clawd/AGENTS.md << 'ECEOF'
${config.agentsMd || "# Agent Config\\n\\nDefault setup."}
ECEOF

chown -R openclaw:openclaw /home/openclaw

echo "[6/6] Starting OpenClaw..."
cat > /etc/systemd/system/openclaw.service << 'ECEOF'
[Unit]
Description=OpenClaw Gateway
After=network.target

[Service]
User=openclaw
WorkingDirectory=/home/openclaw/clawd
ExecStart=/home/openclaw/.npm-global/bin/openclaw gateway start --foreground
Restart=always
RestartSec=5
Environment=NODE_ENV=production
Environment=PATH=/home/openclaw/.npm-global/bin:/usr/bin:/bin

[Install]
WantedBy=multi-user.target
ECEOF

systemctl daemon-reload
systemctl enable openclaw
systemctl start openclaw

echo "PROVISION_COMPLETE"
`;
}

export async function provisionInstance(instanceId: string) {
  try {
    // Get instance config FIRST (need it for script generation)
    const [instance] = await db.select().from(instances).where(eq(instances.id, instanceId));
    if (!instance) throw new Error("Instance not found");

    // Generate the provision script
    const script = generateProvisionScript({
      model: instance.model || "anthropic/claude-sonnet-4-20250514",
      apiKey: instance.apiKeyEncrypted || "",
      channels: (instance.channels as ChannelConfig[]) || [],
      soulMd: instance.soulMd || "",
      agentsMd: instance.agentsMd || "",
    });

    // Create server WITH user_data (cloud-init runs the script on first boot)
    await logStep(instanceId, "create_server", "running");
    const { droplet } = await createServer(instanceId, script);

    await db.update(instances).set({
      hetznerServerId: droplet.id,
      serverIp: droplet.ip || null,
      status: "provisioning",
      updatedAt: new Date(),
    }).where(eq(instances.id, instanceId));

    await logStep(instanceId, "create_server", "success", `Droplet ${droplet.id} created`);

    // If we don't have IP yet, poll for it
    if (!droplet.ip) {
      await logStep(instanceId, "wait_ip", "running");
      let ip = null;
      for (let i = 0; i < 30; i++) {
        await new Promise(r => setTimeout(r, 10000)); // wait 10s
        try {
          const server = await getServer(droplet.id);
          // Check for public IPv4
          const v4 = server.networks?.v4?.find((n: { type: string; ip_address: string }) => n.type === "public");
          if (v4?.ip_address) {
            ip = v4.ip_address;
            break;
          }
        } catch { /* continue polling */ }
      }
      if (ip) {
        await db.update(instances).set({ serverIp: ip, updatedAt: new Date() }).where(eq(instances.id, instanceId));
        await logStep(instanceId, "wait_ip", "success", `IP: ${ip}`);
      }
    }

    // Cloud-init handles installation. Mark as provisioning
    await logStep(instanceId, "install_openclaw", "running", "Cloud-init installing OpenClaw (2-3 minutes)...");
    
    // Wait ~3 minutes for cloud-init to complete
    await new Promise(r => setTimeout(r, 180000));
    
    await logStep(instanceId, "install_openclaw", "success");
    await logStep(instanceId, "start", "success");

    await db.update(instances).set({
      status: "running",
      healthStatus: "healthy",
      lastHealthCheck: new Date(),
      updatedAt: new Date(),
    }).where(eq(instances.id, instanceId));

  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    await db.update(instances).set({
      status: "error",
      errorMessage: msg,
      updatedAt: new Date(),
    }).where(eq(instances.id, instanceId));
    throw error;
  }
}

async function logStep(instanceId: string, step: string, status: string, output?: string) {
  await db.insert(provisionLogs).values({
    instanceId,
    step,
    status,
    output: output || null,
    startedAt: new Date(),
    completedAt: status !== "running" ? new Date() : null,
  });
}
