'use client'

// Client Component because it uses onClick and window.print(), browser-only APIs that cannot run in a Server Component.
export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      style={{
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
      }}
    >
      PRINT RECEIPT
    </button>
  )
}
