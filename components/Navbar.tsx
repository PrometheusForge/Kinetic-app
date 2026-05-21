'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import ThemeToggle from './ThemeToggle'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <nav className="site-nav" id="navbar">
        <div className="container nav-inner">
          <Link href="/" className="nav-brand">KINETIC</Link>

          <div className="nav-controls">
            <div className="nav-links">
              <Link href="/engineering" className="nav-link">Engineering</Link>
              <Link href="/process"     className="nav-link">The Process</Link>
              <Link href="/support"     className="nav-link">Support</Link>
            </div>

            <Link
              href="/#checkout"
              className="btn-primary-sm"
              style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}
            >
              Pre-Order
            </Link>

            <ThemeToggle />

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="mobile-toggle"
            >
              {isOpen ? '[ CLOSE ]' : '[ MENU ]'}
            </button>
          </div>
        </div>
      </nav>

      <div className={`mobile-dropdown ${isOpen ? 'is-active' : ''}`}>
        <Link href="/engineering" className="mobile-dropdown-link" onClick={() => setIsOpen(false)}>Engineering</Link>
        <Link href="/process"     className="mobile-dropdown-link" onClick={() => setIsOpen(false)}>The Process</Link>
        <Link href="/support"     className="mobile-dropdown-link" onClick={() => setIsOpen(false)}>Support</Link>
      </div>
    </>
  )
}
