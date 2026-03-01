import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { instances, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { provisionInstance } from "@/lib/provision";

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [user] = await db.select().from(users).where(eq(users.email, session.user.email));
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const list = await db.select().from(instances).where(eq(instances.userId, user.id));
  return NextResponse.json({ instances: list.map(({ apiKeyEncrypted: _key, ...rest }) => { void _key; return rest; }) });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [user] = await db.select().from(users).where(eq(users.email, session.user.email));
  if (!user || user.planStatus !== "active") return NextResponse.json({ error: "Active subscription required" }, { status: 403 });

  const existing = await db.select().from(instances).where(eq(instances.userId, user.id));
  const maxInstances = 1;
  if (existing.length >= maxInstances) return NextResponse.json({ error: `Limit reached (${maxInstances})` }, { status: 403 });

  const { model, apiKey, channels, name, soulMd, agentsMd } = await req.json();
  if (!apiKey) return NextResponse.json({ error: "API key required" }, { status: 400 });
  if (!channels?.length) return NextResponse.json({ error: "At least one channel required" }, { status: 400 });

  const [instance] = await db.insert(instances).values({
    userId: user.id, name: name || "My Agent", model: model || "anthropic/claude-sonnet-4-20250514",
    apiKeyEncrypted: apiKey, channels, soulMd: soulMd || "", agentsMd: agentsMd || "", status: "provisioning",
  }).returning();

  provisionInstance(instance.id).catch(err => console.error(`Provision failed for ${instance.id}:`, err));
  return NextResponse.json({ instance: { ...instance, apiKeyEncrypted: undefined } }, { status: 201 });
}
