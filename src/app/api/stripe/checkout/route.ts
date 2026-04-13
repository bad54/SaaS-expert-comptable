import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

// POST /api/stripe/checkout - Create a Stripe Checkout session
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { priceId, customerEmail, successUrl, cancelUrl } = body;

  if (!priceId) {
    return NextResponse.json({ error: "priceId requis" }, { status: 400 });
  }

  try {
    const session = await getStripe().checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      ...(customerEmail && { customer_email: customerEmail }),
      success_url: successUrl || `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?checkout=success`,
      cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erreur Stripe" },
      { status: 500 }
    );
  }
}
