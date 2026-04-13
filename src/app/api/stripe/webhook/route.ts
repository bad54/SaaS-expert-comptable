import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

// POST /api/stripe/webhook - Handle Stripe webhooks
export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event;

  try {
    event = getStripe().webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET ?? ""
    );
  } catch (err) {
    return NextResponse.json(
      { error: `Webhook error: ${err instanceof Error ? err.message : "unknown"}` },
      { status: 400 }
    );
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      // TODO: update user's plan in database
      console.log("Checkout completed:", session.id);
      break;
    }
    case "customer.subscription.updated": {
      const subscription = event.data.object;
      // TODO: update subscription status in database
      console.log("Subscription updated:", subscription.id);
      break;
    }
    case "customer.subscription.deleted": {
      const subscription = event.data.object;
      // TODO: downgrade user to free plan
      console.log("Subscription cancelled:", subscription.id);
      break;
    }
    case "invoice.payment_failed": {
      const invoice = event.data.object;
      // TODO: notify user of payment failure
      console.log("Payment failed:", invoice.id);
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
