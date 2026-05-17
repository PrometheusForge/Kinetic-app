import Stripe from 'stripe';

export default async function OrderConfirmationPage(props: {
  searchParams: Promise<{ session_id?: string }>
}) {
  const searchParams = await props.searchParams
  const sessionId    = searchParams.session_id

  if (!sessionId) {
    return (
      <main style={styles.page}>
        <div style={styles.card}>
          <p style={styles.errorText}>No session found.</p>
          <a href="/" style={styles.link}>← Go home</a>
        </div>
      </main>
    )
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2023-10-16' as any,
  })

  let session
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId)
  } catch {
    return (
      <main style={styles.page}>
        <div style={styles.card}>
          <p style={styles.errorText}>Could not retrieve your session.</p>
          <a href="/" style={styles.link}>← Go home</a>
        </div>
      </main>
    )
  }

  if (session.payment_status !== 'paid') {
    return (
      <main style={styles.page}>
        <div style={styles.card}>
          <p style={styles.errorText}>Payment not completed.</p>
          <a href="/checkout" style={styles.link}>← Try again</a>
        </div>
      </main>
    )
  }

  const email  = session.customer_email ?? '—'
  const amount = ((session.amount_total ?? 0) / 100).toFixed(2)

  return (
    <main style={styles.page}>
      {/* Nav bar — matches site header */}
      <nav style={styles.nav}>
        <a href="/" style={styles.navLogo}>KINETIC</a>
      </nav>

      <div style={styles.wrapper}>
        {/* Confirmation card */}
        <div style={styles.card}>

          {/* Status badge */}
          <div style={styles.badge}>PAYMENT CONFIRMED</div>

          {/* Headline */}
          <h1 style={styles.headline}>Your order<br />is secured.</h1>

          {/* Divider */}
          <div style={styles.rule} />

          {/* Order detail rows */}
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>PRODUCT</span>
            <span style={styles.detailValue}>KINETIC Base Unit</span>
          </div>
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>TOTAL CHARGED</span>
            <span style={styles.detailValue}>${amount}</span>
          </div>
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>RECEIPT SENT TO</span>
            <span style={styles.detailValue}>{email}</span>
          </div>

          {/* Divider */}
          <div style={styles.rule} />

          {/* Sub-copy */}
          <p style={styles.subCopy}>
            Your KINETIC unit is being prepared. You will receive a shipping
            confirmation within 2 business days.
          </p>

          {/* CTA */}
          <a href="/" style={styles.button}>← BACK TO HOME</a>
        </div>

        {/* Session ID — small, for support reference */}
        <p style={styles.sessionRef}>
          Reference: {sessionId.slice(0, 28)}...
        </p>
      </div>
    </main>
  )
}

// ─── Inline styles matching KINETIC design tokens ────────────────────────────
// Mirrors --base, --ink, --accent, --font-display, --shadow-brutal from index.html

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#F4F4F0',   // --base
    color: '#111111',              // --ink
    fontFamily: "'Inter', sans-serif",
    overflowX: 'hidden',
  },
  nav: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: '64px',
    display: 'flex',
    alignItems: 'center',
    padding: '0 1.5rem',
    borderBottom: '1.5px solid #111111',
    backgroundColor: '#F4F4F0',
    zIndex: 100,
  },
  navLogo: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 700,
    fontSize: '1.1rem',
    letterSpacing: '0.12em',
    color: '#111111',
    textDecoration: 'none',
  },
  wrapper: {
    paddingTop: '120px',
    paddingBottom: '4rem',
    maxWidth: '560px',
    margin: '0 auto',
    padding: '120px 1.5rem 4rem',
  },
  card: {
    border: '1.5px solid #111111',
    boxShadow: '8px 8px 0px 0px #111111',  // --shadow-brutal
    backgroundColor: '#F4F4F0',
    padding: '2.5rem',
  },
  badge: {
    display: 'inline-block',
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 700,
    fontSize: '0.65rem',
    letterSpacing: '0.14em',
    backgroundColor: '#FF4500',   // --accent
    color: '#ffffff',
    padding: '4px 10px',
    marginBottom: '1.5rem',
  },
  headline: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 700,
    fontSize: 'clamp(2rem, 5vw, 3rem)',
    lineHeight: 1.1,
    letterSpacing: '-0.02em',
    marginBottom: '1.5rem',
    color: '#111111',
  },
  rule: {
    height: '1.5px',
    backgroundColor: '#111111',
    margin: '1.5rem 0',
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '1rem',
    marginBottom: '0.9rem',
  },
  detailLabel: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 700,
    fontSize: '0.65rem',
    letterSpacing: '0.12em',
    color: '#111111',
    flexShrink: 0,
  },
  detailValue: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '0.9rem',
    color: '#111111',
    textAlign: 'right',
  },
  subCopy: {
    fontSize: '0.85rem',
    lineHeight: 1.65,
    color: '#555555',
    marginBottom: '2rem',
  },
  button: {
    display: 'inline-block',
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 700,
    fontSize: '0.75rem',
    letterSpacing: '0.1em',
    color: '#F4F4F0',
    backgroundColor: '#111111',
    padding: '14px 28px',
    border: '1.5px solid #111111',
    boxShadow: '4px 4px 0px 0px #111111',
    textDecoration: 'none',
    transition: 'box-shadow 0.15s, transform 0.15s',
  },
  link: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 700,
    fontSize: '0.8rem',
    letterSpacing: '0.08em',
    color: '#111111',
    textDecoration: 'underline',
  },
  errorText: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: '1rem',
    marginBottom: '1rem',
    color: '#111111',
  },
  sessionRef: {
    marginTop: '1.25rem',
    fontSize: '0.7rem',
    color: '#999999',
    letterSpacing: '0.04em',
    fontFamily: 'monospace',
  },
}
