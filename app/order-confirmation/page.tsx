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

  // All data comes from the Stripe session — no database query needed here.
  const email    = session.customer_email                   ?? '—'
  const amount   = ((session.amount_total ?? 0) / 100).toFixed(2)
  const finish   = session.metadata?.finish                 ?? 'Matte Black'
  const orderRef = session.metadata?.order_ref              ?? '—'
  const shipping = session.shipping_details

  // Format the shipping address into a single readable string
  const addr = shipping ? [
    shipping.name,
    shipping.address?.line1,
    shipping.address?.line2,
    [shipping.address?.city, shipping.address?.state, shipping.address?.postal_code]
      .filter(Boolean).join(', '),
    shipping.address?.country,
  ].filter(Boolean).join('\n') : null

  return (
    <main style={styles.page}>
      {/* Nav — matches site header */}
      <nav style={styles.nav}>
        <a href="/" style={styles.navLogo}>KINETIC</a>
        {/* Print button — triggers browser print dialog.
            The @media print styles below hide everything except the receipt card. */}
        <button onClick={() => window.print()} style={styles.printBtn} id="print-btn">
          PRINT RECEIPT
        </button>
      </nav>

      <div style={styles.wrapper}>
        <div style={styles.card} id="receipt">

          {/* Status badge */}
          <div style={styles.badge}>ORDER CONFIRMED</div>

          {/* Headline */}
          <h1 style={styles.headline}>Your order<br />is secured.</h1>

          <div style={styles.rule} />

          {/* Order reference — the human-readable ID */}
          <div style={styles.refBlock}>
            <span style={styles.refLabel}>ORDER REFERENCE</span>
            <span style={styles.refValue}>{orderRef}</span>
          </div>

          <div style={styles.rule} />

          {/* Order details */}
          <Row label="PRODUCT"        value={`KINETIC Base Unit — ${finish}`} />
          <Row label="TOTAL CHARGED"  value={`$${amount}`} />
          <Row label="RECEIPT SENT TO" value={email} />

          {/* Shipping address — only shown when Stripe collected it */}
          {addr && (
            <>
              <div style={styles.rule} />
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>SHIP TO</span>
                <span style={{ ...styles.detailValue, whiteSpace: 'pre-line' }}>
                  {addr}
                </span>
              </div>
            </>
          )}

          <div style={styles.rule} />

          <p style={styles.subCopy}>
            Your KINETIC unit is being prepared. A shipping confirmation
            will be sent to <strong>{email}</strong> within 2 business days.
          </p>

          <a href="/" style={styles.button}>← BACK TO HOME</a>
        </div>

        {/* Session ref — small, for support use */}
        <p style={styles.sessionRef}>Support ref: {sessionId.slice(0, 32)}...</p>
      </div>

      {/* Print styles — injected via a style tag.
          When the browser prints, only #receipt is visible.
          Nav, print button, and session ref are hidden. */}
      <style>{`
        @media print {
          body { background: white; }
          nav, #print-btn, .no-print { display: none !important; }
          #receipt {
            box-shadow: none !important;
            border: 1px solid #111 !important;
            margin: 0 !important;
            max-width: 100% !important;
          }
        }
      `}</style>
    </main>
  )
}

// ── Shared row component ──────────────────────────────────────────────────────
function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={styles.detailRow}>
      <span style={styles.detailLabel}>{label}</span>
      <span style={styles.detailValue}>{value}</span>
    </div>
  )
}

// ── Inline styles — mirrors KINETIC design tokens ─────────────────────────────
const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#F4F4F0',
    color: '#111111',
    fontFamily: "'Inter', sans-serif",
    overflowX: 'hidden',
  },
  nav: {
    position: 'fixed',
    top: 0, left: 0, right: 0,
    height: '64px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  printBtn: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 700,
    fontSize: '0.65rem',
    letterSpacing: '0.1em',
    color: '#111111',
    backgroundColor: 'transparent',
    border: '1.5px solid #111111',
    padding: '7px 14px',
    cursor: 'pointer',
    boxShadow: '3px 3px 0px 0px #111111',
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
    boxShadow: '8px 8px 0px 0px #111111',
    backgroundColor: '#F4F4F0',
    padding: '2.5rem',
  },
  badge: {
    display: 'inline-block',
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 700,
    fontSize: '0.65rem',
    letterSpacing: '0.14em',
    backgroundColor: '#FF4500',
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
    margin: '1.25rem 0',
  },
  refBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  refLabel: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 700,
    fontSize: '0.6rem',
    letterSpacing: '0.14em',
    color: '#888888',
  },
  refValue: {
    fontFamily: 'monospace',
    fontWeight: 700,
    fontSize: '1.2rem',
    letterSpacing: '0.08em',
    color: '#111111',
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '1rem',
    marginBottom: '0.75rem',
  },
  detailLabel: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 700,
    fontSize: '0.6rem',
    letterSpacing: '0.12em',
    color: '#888888',
    flexShrink: 0,
    paddingTop: '2px',
  },
  detailValue: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '0.875rem',
    color: '#111111',
    textAlign: 'right',
  },
  subCopy: {
    fontSize: '0.8rem',
    lineHeight: 1.65,
    color: '#555555',
    marginBottom: '2rem',
  },
  button: {
    display: 'inline-block',
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 700,
    fontSize: '0.7rem',
    letterSpacing: '0.1em',
    color: '#F4F4F0',
    backgroundColor: '#111111',
    padding: '14px 28px',
    border: '1.5px solid #111111',
    boxShadow: '4px 4px 0px 0px #111111',
    textDecoration: 'none',
  },
  link: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 700,
    fontSize: '0.8rem',
    color: '#111111',
    textDecoration: 'underline',
  },
  errorText: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: '1rem',
    marginBottom: '1rem',
  },
  sessionRef: {
    marginTop: '1.25rem',
    fontSize: '0.65rem',
    color: '#aaaaaa',
    letterSpacing: '0.04em',
    fontFamily: 'monospace',
  },
}
