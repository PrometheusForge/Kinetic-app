"use client";
import React, { useState } from 'react';
import Link from 'next/link'; // <-- This is the Next.js routing superpower

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav className="site-nav" id="navbar">
        <div className="container nav-inner">
          {/* Clicking the brand name takes them to the root homepage */}
          <Link href="/" className="nav-brand">KINETIC</Link>
          
          <div className="nav-controls">
            <div className="nav-links">
              {/* Note the absolute paths with NO .html extension */}
              <Link href="/engineering" className="nav-link">Engineering</Link>
              <Link href="/ritual" className="nav-link">The Ritual</Link>
              <Link href="/support" className="nav-link">Support</Link>
            </div>
            
            {/* Routes back to the homepage and scrolls to the checkout ID */}
            <Link href="/#checkout" className="btn-primary-sm" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
              Pre-Order
            </Link>

            <button onClick={() => setIsOpen(!isOpen)} className="mobile-toggle">
              {isOpen ? '[ CLOSE ]' : '[ MENU ]'}
            </button>
          </div>
        </div>
      </nav>
      
      <div className={`mobile-dropdown ${isOpen ? 'is-active' : ''}`}>
        <Link href="/engineering" className="mobile-dropdown-link" onClick={() => setIsOpen(false)}>Engineering</Link>
        <Link href="/ritual" className="mobile-dropdown-link" onClick={() => setIsOpen(false)}>The Ritual</Link>
        <Link href="/support" className="mobile-dropdown-link" onClick={() => setIsOpen(false)}>Support</Link>
      </div>
    </>
  );
}