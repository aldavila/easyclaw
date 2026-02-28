const DO_API = "https://api.digitalocean.com/v2";

interface Droplet {
  id: number;
  name: string;
  status: string;
  networks: {
    v4: Array<{ ip_address: string; type: string }>;
    v6: Array<{ ip_address: string; type: string }>;
  };
  size_slug: string;
  region: { slug: string };
}

interface CreateDropletResponse {
  droplet: {
    id: number;
    ip: string;
  };
  rootPassword?: string;
}

async function doFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`${DO_API}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${process.env.DO_API_TOKEN}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  if (!res.ok) {
    const error = await res.text();
    throw new Error(`DigitalOcean API error ${res.status}: ${error}`);
  }
  // DELETE returns 204 No Content
  if (res.status === 204) return null;
  return res.json();
}

async function waitForIp(dropletId: number, maxAttempts = 30): Promise<string> {
  for (let i = 0; i < maxAttempts; i++) {
    const data = await doFetch(`/droplets/${dropletId}`);
    const droplet = data.droplet as Droplet;
    const publicIp = droplet.networks.v4.find((n) => n.type === "public");
    if (publicIp?.ip_address) {
      return publicIp.ip_address;
    }
    // Wait 2 seconds before retry
    await new Promise((r) => setTimeout(r, 2000));
  }
  throw new Error(`Droplet ${dropletId} did not receive public IP after ${maxAttempts * 2} seconds`);
}

export async function createServer(instanceId: string): Promise<CreateDropletResponse> {
  const sshKeys: string[] = [];
  if (process.env.DO_SSH_KEY_ID) {
    sshKeys.push(process.env.DO_SSH_KEY_ID);
  }

  const data = await doFetch("/droplets", {
    method: "POST",
    body: JSON.stringify({
      name: `ec-${instanceId.slice(0, 8)}`,
      region: "nyc1",
      size: "s-1vcpu-1gb",
      image: "ubuntu-24-04-x64",
      ssh_keys: sshKeys,
      tags: ["easyclaw"],
      // user_data can be added for cloud-init script
    }),
  });

  const dropletId = data.droplet.id;
  
  // Poll for public IP (DigitalOcean doesn't return it immediately)
  const ip = await waitForIp(dropletId);

  return {
    droplet: {
      id: dropletId,
      ip,
    },
    // DigitalOcean doesn't return root password by default (uses SSH keys)
    // If needed, can be set via user_data cloud-init
  };
}

export async function deleteServer(serverId: number): Promise<void> {
  await doFetch(`/droplets/${serverId}`, { method: "DELETE" });
}

export async function getServer(serverId: number): Promise<Droplet> {
  const data = await doFetch(`/droplets/${serverId}`);
  return data.droplet;
}

export async function listServers(): Promise<Droplet[]> {
  const data = await doFetch("/droplets?tag_name=easyclaw");
  return data.droplets;
}
