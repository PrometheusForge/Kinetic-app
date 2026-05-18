'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function Footer() {
  const [email, setEmail]     = useState('')
  const [status, setStatus]   = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit() {
    if (!email) return
    setStatus('loading')

    const res = await fetch('/api/dispatch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })

    const data = await res.json()

    if (res.ok) {
      setStatus('done')
      setMessage(data.message)
      setEmail('')
    } else {
      setStatus('error')
      setMessage(data.error ?? 'Something went wrong.')
    }
  }

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-brand">KINETIC</div>
            <p className="footer-desc">
              Zero electronics. Total control. The analog revolution of home espresso.
            </p>
          </div>

          <div>
            <h4 className="footer-col-title">The Machine</h4>
            <ul className="footer-links">
              <li><Link href="/#checkout" className="footer-link">Pre-Order Batch 04</Link></li>
              <li><Link href="/engineering" className="footer-link">Engineering & Specs</Link></li>
              <li><Link href="/ritual" className="footer-link">The Workflow Ritual</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-col-title">Owner Support</h4>
            <ul className="footer-links">
              <li><Link href="/support" className="footer-link">Lifetime Warranty</Link></li>
              <li><Link href="/support" className="footer-link">Replacement Parts</Link></li>
              <li><Link href="/support" className="footer-link">Shipping & Returns</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-col-title">Dispatch</h4>
            <p className="footer-desc" style={{ marginBottom: '1rem' }}>
              Join the list for batch drops.
            </p>

            {/* Dispatch form — state lives here, calls /api/dispatch */}
            {status === 'done' ? (
              <p className="footer-desc">{message}</p>
            ) : (
              <>
                <div className="footer-form">
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                    placeholder="Email..."
                    className="footer-input"
                    disabled={status === 'loading'}
                  />
                  <button
                    onClick={handleSubmit}
                    className="footer-btn"
                    disabled={status === 'loading'}
                  >
                    {status === 'loading' ? '...' : '→'}
                  </button>
                </div>
                {status === 'error' && (
                  <p className="footer-desc" style={{ marginTop: '0.5rem', color: '#FF4500' }}>
                    {message}
                  </p>
                )}
              </>
            )}
          </div>
        </div>

        <div className="footer-copyright">
          © 2026 Kinetic Design Labs. Engineered in Berlin.
        </div>
      </div>
    </footer>
  )
}
