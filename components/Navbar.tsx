'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import ThemeToggle from './ThemeToggle'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return ('use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import ThemeToggle from './ThemeToggle'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1024px)');

    const handleBreakpoint = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setIsOpen(false); 
      }
    };

    mediaQuery.addEventListener('change', handleBreakpoint);
    return () => mediaQuery.removeEventListener('change', handleBreakpoint);
  }, []);

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
              style={{ textDecoration: 'none'}}
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
        <Link href="/#checkout" className="mobile-dropdown-link" onClick={() => setIsOpen(false)}>
          Pre-Order
        </Link>
        <Link href="/engineering" className="mobile-dropdown-link" onClick={() => setIsOpen(false)}>Engineering</Link>
        <Link href="/process"     className="mobile-dropdown-link" onClick={() => setIsOpen(false)}>The Process</Link>
        <Link href="/support"     className="mobile-dropdown-link" onClick={() => setIsOpen(false)}>Support</Link>
      </div>
    </>
  )
}

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
              style={{ textDecoration: 'none'}}
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
        <Link href="/#checkout" className="mobile-dropdown-link" onClick={() => setIsOpen(false)}>
          Pre-Order
        </Link>
        <Link href="/engineering" className="mobile-dropdown-link" onClick={() => setIsOpen(false)}>Engineering</Link>
        <Link href="/process"     className="mobile-dropdown-link" onClick={() => setIsOpen(false)}>The Process</Link>
        <Link href="/support"     className="mobile-dropdown-link" onClick={() => setIsOpen(false)}>Support</Link>
      </div>
    </>
  )
}
