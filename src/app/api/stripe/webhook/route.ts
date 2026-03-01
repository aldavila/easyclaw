import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import Stripe from "stripe";
import { sendPaymentConfirmation } from "@/lib/emails";
import { notifyPayment } from "@/lib/notify";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const { userId, plan } = session.metadata || {};
      if (userId && plan) {
        await db.update(users).set({ plan, planStatus: "active", stripeSubscriptionId: session.subscription as string, updatedAt: new Date() }).where(eq(users.id, userId));
        // Notify on successful payment
        const email = session.customer_email || session.customer_details?.email;
        if (email) {
          sendPaymentConfirmation(email).catch(() => {});
          notifyPayment(email, plan).catch(() => {});
        }
      }
      break;
    }
    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription;
      const [user] = await db.select().from(users).where(eq(users.stripeCustomerId, sub.customer as string));
      if (user) {
        const status = sub.status === "active" ? "active" : sub.status === "past_due" ? "past_due" : "canceled";
        await db.update(users).set({ planStatus: status, updatedAt: new Date() }).where(eq(users.id, user.id));
      }
      break;
    }
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      const [user] = await db.select().from(users).where(eq(users.stripeCustomerId, sub.customer as string));
      if (user) await db.update(users).set({ planStatus: "canceled", updatedAt: new Date() }).where(eq(users.id, user.id));
      break;
    }
  }

  return NextResponse.json({ received: true });
}
