import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-10-29.clover',
    })
  : null;

export async function POST(request: NextRequest) {
  if (!stripe) {
    return NextResponse.json(
      { error: 'Stripe is not configured' },
      { status: 500 }
    );
  }
  try {
    const { packageName } = await request.json();

    // For testing, create a generic checkout session
    // You can replace this with actual product/price IDs from Stripe Dashboard later
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: packageName || 'Test Package',
              description: 'This is a test checkout. Replace with real products from Stripe Dashboard.',
            },
            unit_amount: 1000, // $10.00 in cents (for testing)
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${request.headers.get('origin')}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.headers.get('origin')}/checkout/cancel`,
      metadata: {
        packageName: packageName || 'Test Package',
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: unknown) {
    console.error('Stripe checkout error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: 'Failed to create checkout session', details: errorMessage },
      { status: 500 }
    );
  }
}
