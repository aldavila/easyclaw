import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { instances, users, provisionLogs } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { deleteServer } from "@/lib/digitalocean";

async function getAuthUser() {
  const session = await auth();
  if (!session?.user?.email) return null;
  const [user] = await db.select().from(users).where(eq(users.email, session.user.email));
  return user || null;
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  const [instance] = await db.select().from(instances).where(and(eq(instances.id, id), eq(instances.userId, user.id)));
  if (!instance) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const logs = await db.select().from(provisionLogs).where(eq(provisionLogs.instanceId, id));
  return NextResponse.json({ instance: { ...instance, apiKeyEncrypted: undefined }, logs });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  const [instance] = await db.select().from(instances).where(and(eq(instances.id, id), eq(instances.userId, user.id)));
  if (!instance) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();
  const updates: Record<string, unknown> = { updatedAt: new Date() };
  for (const f of ["name", "model", "soulMd", "agentsMd", "channels"]) {
    if (body[f] !== undefined) updates[f] = body[f];
  }
  if (body.apiKey) updates.apiKeyEncrypted = body.apiKey;

  const [updated] = await db.update(instances).set(updates).where(eq(instances.id, id)).returning();
  return NextResponse.json({ instance: { ...updated, apiKeyEncrypted: undefined } });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  const [instance] = await db.select().from(instances).where(and(eq(instances.id, id), eq(instances.userId, user.id)));
  if (!instance) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (instance.hetznerServerId) {
    try { await deleteServer(instance.hetznerServerId); } catch (e) { console.error("DigitalOcean delete failed:", e); }
  }
  await db.delete(provisionLogs).where(eq(provisionLogs.instanceId, id));
  await db.delete(instances).where(eq(instances.id, id));

  return NextResponse.json({ deleted: true });
}
