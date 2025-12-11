import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/auth/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-10-29.clover",
});

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get or create Stripe customer
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('stripe_customer_id, email')
      .eq('id', user.id)
      .single();

    let customerId = profile?.stripe_customer_id;

    if (!customerId) {
      // Create new Stripe customer
      const customer = await stripe.customers.create({
        email: profile?.email || user.email,
        metadata: {
          supabase_user_id: user.id,
        },
      });

      customerId = customer.id;

      // Save customer ID to profile
      await supabase
        .from('user_profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', user.id);
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Scope AI - Unlimited Estimate Saves",
              description: "Save unlimited project estimates and access them anytime",
            },
            unit_amount: 700, // $7.00
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/my-estimates?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/estimate`,
      metadata: {
        user_id: user.id,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
