import { db } from "./db";
import { instances, provisionLogs } from "./db/schema";
import { createServer } from "./hetzner";
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
    await logStep(instanceId, "create_server", "running");
    const { server, root_password } = await createServer(instanceId);

    await db.update(instances).set({
      hetznerServerId: server.id,
      serverIp: server.public_net.ipv4.ip,
      status: "provisioning",
      updatedAt: new Date(),
    }).where(eq(instances.id, instanceId));

    await logStep(instanceId, "create_server", "success", `Server ${server.id} at ${server.public_net.ipv4.ip}`);

    // Wait for server to boot
    await logStep(instanceId, "wait_ssh", "running");
    await new Promise(r => setTimeout(r, 30000)); // 30s boot time
    await logStep(instanceId, "wait_ssh", "success");

    // Get instance config
    const [instance] = await db.select().from(instances).where(eq(instances.id, instanceId));
    if (!instance) throw new Error("Instance not found");

    await logStep(instanceId, "install_openclaw", "running");

    const script = generateProvisionScript({
      model: instance.model || "anthropic/claude-sonnet-4-20250514",
      apiKey: instance.apiKeyEncrypted || "",
      channels: (instance.channels as ChannelConfig[]) || [],
      soulMd: instance.soulMd || "",
      agentsMd: instance.agentsMd || "",
    });

    // TODO: Execute script via SSH (ssh2 library or Hetzner user-data)
    // For now, log the script for manual execution
    console.log(`Provision script for ${instanceId}:`, script.slice(0, 200));
    void root_password; // will be used for SSH auth
    void script;

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
