import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe() {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { typescript: true });
  }
  return _stripe;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const stripe = new Proxy({} as any, {
  get(_target: unknown, prop: string | symbol) {
    return getStripe()[prop as keyof Stripe];
  },
}) as Stripe;

export const PLAN = {
  name: "EasyClaw",
  priceId: process.env.STRIPE_PRICE_ID || "price_1T60F6GAvY8PdD9WDaMco97b",
  price: 24,
  channels: 1, // Telegram
  instances: 1,
  cronJobs: 10,
  skills: 5,
} as const;

// Keep PLANS export for backward compat with checkout route
export const PLANS = {
  easyclaw: PLAN,
} as const;

export type PlanKey = keyof typeof PLANS;
