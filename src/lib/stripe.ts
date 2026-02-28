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

export const PLANS = {
  starter: {
    name: "Starter",
    priceId: process.env.STRIPE_STARTER_PRICE_ID || "price_starter",
    price: 8,
    channels: 1, // Telegram only
    instances: 1,
    cronJobs: 3,
    skills: 0,
  },
  pro: {
    name: "Pro",
    priceId: process.env.STRIPE_PRO_PRICE_ID || "price_pro",
    price: 18,
    channels: 2, // Telegram + Discord
    instances: 1,
    cronJobs: 10,
    skills: 5,
  },
  business: {
    name: "Business",
    priceId: process.env.STRIPE_BUSINESS_PRICE_ID || "price_business",
    price: 38,
    channels: 3, // Telegram + Discord + WhatsApp
    instances: 3,
    cronJobs: -1,
    skills: -1,
  },
} as const;

export type PlanKey = keyof typeof PLANS;
