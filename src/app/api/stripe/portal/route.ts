import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

// POST /api/stripe/portal - Create a Stripe Customer Portal session
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { customerId } = body;

  if (!customerId) {
    return NextResponse.json({ error: "customerId requis" }, { status: 400 });
  }

  try {
    const session = await getStripe().billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erreur Stripe" },
      { status: 500 }
    );
  }
}
