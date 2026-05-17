import Stripe from 'stripe';

// Next.js 15 — searchParams is a Promise. Must be awaited via props.
// This is the official pattern from the Next.js 15 upgrade guide.
export default async function OrderConfirmationPage(props: {
  searchParams: Promise<{ session_id?: string }>
}) {
  // Step 1 — await searchParams directly from props (Next.js 15 requirement)
  const searchParams = await props.searchParams
  const sessionId    = searchParams.session_id

  // Step 2 — guard: no session_id in the URL
  if (!sessionId) {
    return (
      <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
        <p>No session found. <a href="/">Go home</a></p>
      </main>
    )
  }

  // Step 3 — call Stripe directly from this Server Component.
  // No internal fetch needed. STRIPE_SECRET_KEY is already in your env vars.
  // This works on Vercel exactly the same as locally.
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2023-10-16' as any,
  })

  let session
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId)
  } catch {
    return (
      <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
        <p>Could not retrieve your session. <a href="/">Go home</a></p>
      </main>
    )
  }

  // Step 4 — verify the payment actually succeeded
  // Protects against someone manually typing a session_id for an unpaid session
  if (session.payment_status !== 'paid') {
    return (
      <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
        <p>Payment not completed. <a href="/checkout">Try again</a></p>
      </main>
    )
  }

  // Step 5 — render confirmation
  const email  = session.customer_email ?? 'your email'
  const amount = ((session.amount_total ?? 0) / 100).toFixed(2)

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Order confirmed ✓</h1>
      <p>Receipt sent to: <strong>{email}</strong></p>
      <p>Total charged: <strong>${amount}</strong></p>
      <br />
      <a href="/">Back to home</a>
    </main>
  )
}
