import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, { 
  apiVersion: '2023-10-16' as any 
});

// We must use the SERVICE ROLE KEY here to bypass RLS and edit the inventory securely
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const payload = await req.text();
  const signature = req.headers.get('stripe-signature') as string;

  let event;

  try {
    // 1. Verify HMAC-SHA256 signature (Crucial security step)
    event = stripe.webhooks.constructEvent(payload, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // 2. Handle successful payment
  if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as any;

    // Fetch the current inventory
    const { data: currentProduct } = await supabase
        .from('products')
        .select('inventory_count')
        .eq('id', 'kinetic_base')
        .single();

    // Decrement inventory securely
    if (currentProduct) {
        await supabase
          .from('products')
          .update({ inventory_count: currentProduct.inventory_count - 1 })
          .eq('id', 'kinetic_base');
    }

    // Record the order in the database
    await supabase.from('orders').insert({
      stripe_payment_id: paymentIntent.id,
      customer_email: paymentIntent.receipt_email || 'unknown@email.com',
      status: 'paid'
    });
  }

  return NextResponse.json({ received: true });
}