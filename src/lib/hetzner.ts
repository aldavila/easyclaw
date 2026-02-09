const HETZNER_API = "https://api.hetzner.cloud/v1";

interface HetznerServer {
  id: number;
  name: string;
  status: string;
  public_net: {
    ipv4: { ip: string };
    ipv6: { ip: string };
  };
  server_type: { name: string };
  datacenter: { name: string };
}

interface CreateServerResponse {
  server: HetznerServer;
  root_password: string;
}

async function hetznerFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`${HETZNER_API}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${process.env.HETZNER_API_TOKEN}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Hetzner API error ${res.status}: ${error}`);
  }
  return res.json();
}

export async function createServer(instanceId: string): Promise<CreateServerResponse> {
  const data = await hetznerFetch("/servers", {
    method: "POST",
    body: JSON.stringify({
      name: `ec-${instanceId.slice(0, 8)}`,
      server_type: "cax11",
      image: "ubuntu-24.04",
      location: "fsn1",
      ssh_keys: process.env.HETZNER_SSH_KEY_ID ? [process.env.HETZNER_SSH_KEY_ID] : [],
      labels: { app: "easyclaw", instance_id: instanceId },
      start_after_create: true,
    }),
  });
  return data;
}

export async function deleteServer(serverId: number): Promise<void> {
  await hetznerFetch(`/servers/${serverId}`, { method: "DELETE" });
}

export async function getServer(serverId: number): Promise<HetznerServer> {
  const data = await hetznerFetch(`/servers/${serverId}`);
  return data.server;
}

export async function listServers(): Promise<HetznerServer[]> {
  const data = await hetznerFetch("/servers?label_selector=app=easyclaw");
  return data.servers;
}
