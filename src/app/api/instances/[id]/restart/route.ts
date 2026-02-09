import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { instances, users } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  const [user] = await db.select().from(users).where(eq(users.email, session.user.email));
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const [instance] = await db.select().from(instances).where(and(eq(instances.id, id), eq(instances.userId, user.id)));
  if (!instance) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (!instance.serverIp) return NextResponse.json({ error: "No server" }, { status: 400 });

  // TODO: SSH into server and run: systemctl restart openclaw
  await db.update(instances).set({ status: "running", healthStatus: "unknown", updatedAt: new Date() }).where(eq(instances.id, id));
  return NextResponse.json({ restarted: true });
}
