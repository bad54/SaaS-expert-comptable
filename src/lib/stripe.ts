import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error("STRIPE_SECRET_KEY is not set. Configure your .env.local file.");
    }
    _stripe = new Stripe(key, {
      apiVersion: "2026-03-25.dahlia",
      typescript: true,
    });
  }
  return _stripe;
}

export const PLANS = {
  free: {
    name: "Gratuit",
    price: 0,
    priceId: null,
    features: [
      "Jusqu'a 5 clients",
      "50 Mo de stockage",
      "Echeancier fiscal de base",
      "1 utilisateur",
    ],
    limits: { clients: 5, storageMb: 50, users: 1 },
  },
  pro: {
    name: "Pro",
    price: 29,
    priceId: process.env.STRIPE_PRO_PRICE_ID ?? null,
    features: [
      "Jusqu'a 50 clients",
      "5 Go de stockage",
      "OCR automatique",
      "Export FEC",
      "Portail client",
      "3 utilisateurs",
      "Support par email",
    ],
    limits: { clients: 50, storageMb: 5120, users: 3 },
  },
  cabinet: {
    name: "Cabinet",
    price: 79,
    priceId: process.env.STRIPE_CABINET_PRICE_ID ?? null,
    features: [
      "Clients illimites",
      "20 Go de stockage",
      "OCR automatique avance",
      "Export FEC",
      "Portail client personnalise",
      "Utilisateurs illimites",
      "Support prioritaire",
      "API access",
    ],
    limits: { clients: Infinity, storageMb: 20480, users: Infinity },
  },
} as const;

export type PlanKey = keyof typeof PLANS;
