import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
 
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2023-10-16' as any,
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
 
export async function POST(req: NextRequest) {
  const rawBody = await req.arrayBuffer()
  const sig     = req.headers.get('stripe-signature')!
 
  let event: Stripe.Event
 
  try {
    event = stripe.webhooks.constructEvent(
      Buffer.from(rawBody),
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch {
    // Forged or malformed request
    return new NextResponse('Webhook signature verification failed', { status: 400 })
  }

  if (event.type !== 'checkout.session.completed') {
    return NextResponse.json({ received: true })
  }
 
  const session = event.data.object as Stripe.Checkout.Session

  if (session.payment_status !== 'paid') {
    return NextResponse.json({ received: true })
  }
 
  const { data: existing } = await supabase
    .from('orders')
    .select('id')
    .eq('stripe_session_id', session.id)
    .single()
 
  if (existing) {
    return NextResponse.json({ received: true, duplicate: true })
  }
 
  const shipping = (session as any).shipping_details
  const meta     = session.metadata ?? {}
 
  const deliveryRecord = {
    order_ref:          meta.order_ref   ?? null,
    stripe_session_id:  session.id,
    stripe_payment_id:  session.payment_intent as string,
 
    customer_email:     session.customer_email ?? null,
    customer_name:      shipping?.name         ?? null,
 
    finish:             meta.finish ?? 'Matte Black',
    amount_total:       session.amount_total ?? 0,   // in cents
    currency:           session.currency     ?? 'usd',
 
    shipping_name:      shipping?.name                  ?? null,
    shipping_line1:     shipping?.address?.line1        ?? null,
    shipping_line2:     shipping?.address?.line2        ?? null,
    shipping_city:      shipping?.address?.city         ?? null,
    shipping_state:     shipping?.address?.state        ?? null,
    shipping_postal:    shipping?.address?.postal_code  ?? null,
    shipping_country:   shipping?.address?.country      ?? null,
 
    fulfillment_status: 'pending',   // pending → packed → shipped → delivered
 
    created_at: new Date().toISOString(),
  }
 
  const { error: insertError } = await supabase
    .from('orders')
    .insert(deliveryRecord)
 
  if (insertError) {
    console.error('Supabase insert failed:', insertError)
    return new NextResponse('Database write failed', { status: 500 })
  }
 
  const { error: inventoryError } = await supabase
    .rpc('decrement_inventory', { product_id: 'kinetic-base-unit', amount: 1 })
 
  if (inventoryError) {
    console.error('Inventory decrement failed:', inventoryError)
  }
 
  return NextResponse.json({ received: true, order_ref: meta.order_ref })
}