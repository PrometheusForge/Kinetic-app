import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2023-10-16' as any,
});

export async function POST(req: Request) {
  try {
    // 1. Create a Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'KINETIC Base Unit',
              description: 'Zero electronics. Total control.',
              // Optional: Add the image URL from your prototype
              images: ['https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?q=80&w=800&auto=format&fit=crop'], 
            },
            unit_amount: 49900, // Stripe reads prices in cents ($499.00 = 49900)
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      // 2. Tell Stripe where to send the user after they pay (or cancel)
      // We use the origin URL so it works locally and in production
      success_url: `${req.headers.get('origin')}/?success=true`,
      cancel_url: `${req.headers.get('origin')}/?canceled=true`,
    });

    // 3. Send the secure Stripe URL back to the React frontend
    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}