import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-brand">KINETIC</div>
            <p className="footer-desc">Zero electronics. Total control. The analog revolution of home espresso.</p>
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
            <p className="footer-desc" style={{ marginBottom: '1rem' }}>Join the list for batch drops.</p>
            <form className="footer-form" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Email..." className="footer-input" />
              <button type="submit" className="footer-btn">→</button>
            </form>
          </div>
        </div>
        <div className="footer-copyright">
          © 2026 Kinetic Design Labs. Engineered in Berlin.
        </div>
      </div>
    </footer>
  );
}