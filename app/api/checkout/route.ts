import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2023-10-16' as any,
});

//short order reference
function generateOrderRef(): string {
  return `KIN-${Date.now().toString(36).toUpperCase()}`
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, finish } = body;

    // The Backend Hard Stop
    if (!email) {
      return new Response(JSON.stringify({ error: "Email is strictly required" }), { 
        status: 400 
      });
    }

    const orderRef = generateOrderRef()
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: email,
      metadata: {
        order_ref: orderRef,
        finish:    finish ?? 'Matte Black',
      },
      
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `KINETIC Espresso Maker — ${finish ?? 'Matte Black'}`,
              description: 'Zero electronics. Total control.',
              images: ['https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?q=80&w=800&auto=format&fit=crop'],
            },
            unit_amount: 49900,
          },
          quantity: 1,
        },
      ],
      
      shipping_address_collection: {
        allowed_countries: [
          'US', 'CA', 'GB', 'NG', 'GH', 'ZA', 'AE', 'AU', 'DE', 'FR',
        ],
      },
      
      success_url: `${req.headers.get('origin')}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/checkout`,
    });

    // 3. Send the secure Stripe URL back to the React frontend
    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
