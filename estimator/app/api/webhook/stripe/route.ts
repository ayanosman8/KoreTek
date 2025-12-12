import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/auth/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-10-29.clover",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "No signature" },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Handle checkout.session.completed event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.user_id;

      if (userId && session.mode === "subscription") {
        // Get subscription ID from the session
        const subscriptionId = session.subscription as string;

        // Update user profile with subscription info
        const { error } = await supabase
          .from('profiles')
          .update({
            has_paid: true,
            stripe_subscription_id: subscriptionId,
            subscription_status: 'active'
          })
          .eq('id', userId);

        if (error) {
          console.error("Error updating user profile:", error);
          return NextResponse.json(
            { error: "Failed to update user" },
            { status: 500 }
          );
        }

        console.log(`User ${userId} subscription activated`);
      }
    }

    // Handle subscription updates
    if (event.type === "customer.subscription.updated") {
      const subscription = event.data.object as Stripe.Subscription;
      const userId = subscription.metadata?.user_id;

      if (userId) {
        const { error } = await supabase
          .from('profiles')
          .update({
            subscription_status: subscription.status,
          })
          .eq('stripe_subscription_id', subscription.id);

        if (error) {
          console.error("Error updating subscription status:", error);
        } else {
          console.log(`Subscription ${subscription.id} updated to ${subscription.status}`);
        }
      }
    }

    // Handle subscription deletion
    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object as Stripe.Subscription;

      const { error } = await supabase
        .from('profiles')
        .update({
          has_paid: false,
          subscription_status: 'canceled',
        })
        .eq('stripe_subscription_id', subscription.id);

      if (error) {
        console.error("Error canceling subscription:", error);
      } else {
        console.log(`Subscription ${subscription.id} canceled`);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
