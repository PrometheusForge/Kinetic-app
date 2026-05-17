interface PageProps {
  searchParams: { session_id?: string }
}

export default async function OrderConfirmationPage({ searchParams }: PageProps) {

  const sessionId = searchParams.session_id

  // If no session_id in the URL, someone navigated here manually
  if (!sessionId) {
    return <p>No session found. <a href="/">Go home</a></p>
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/verify-session?session_id=${sessionId}`,
    { cache: 'no-store' }   // never cache — every request must be fresh
  )

  if (!res.ok) {
    return <p>Could not verify your order. Contact support.</p>
  }

  const { customerEmail, amountTotal } = await res.json()

  return (
    <main>
      <h1>Order confirmed</h1>
      <p>Receipt sent to {customerEmail}</p>
      <p>Total charged: ${(amountTotal / 100).toFixed(2)}</p>
      <a href="/">Back to home</a>
    </main>
  )
}
