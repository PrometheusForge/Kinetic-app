'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Reads and writes to localStorage under this key.
// Applies data-theme="dark" to <html> — all CSS variables switch automatically.
const STORAGE_KEY = 'kinetic-theme'

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)

  // On mount: read the stored preference and sync with whatever the
  // blocking script in layout.tsx already applied to <html>.
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    setIsDark(stored === 'dark')
  }, [])

  function toggle() {
    const next = !isDark
    setIsDark(next)
    const html = document.documentElement
    if (next) {
      html.setAttribute('data-theme', 'dark')
      localStorage.setItem(STORAGE_KEY, 'dark')
    } else {
      html.removeAttribute('data-theme')
      localStorage.setItem(STORAGE_KEY, 'light')
    }
  }

  return (
    <motion.button
      onClick={toggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="theme-toggle-btn"
      // Tactile press feedback — matches the brutalist button hover pattern
      whileTap={{ scale: 0.88 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          // Sun icon — shown when dark mode is active
          <motion.span
            key="sun"
            initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
            animate={{ rotate: 0,   opacity: 1, scale: 1   }}
            exit={{    rotate:  90, opacity: 0, scale: 0.6 }}
            transition={{ type: 'spring', stiffness: 300, damping: 18, duration: 0.25 }}
            style={{ display: 'flex', alignItems: 'center' }}
          >
            {/* Sun SVG — inline so no external dependency */}
            <svg
              width="18" height="18" viewBox="0 0 24 24"
              fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="1"  x2="12" y2="3"/>
              <line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22"   x2="5.64" y2="5.64"/>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1"  y1="12" x2="3"  y2="12"/>
              <line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
          </motion.span>
        ) : (
          // Moon icon — shown when light mode is active
          <motion.span
            key="moon"
            initial={{ rotate:  90, opacity: 0, scale: 0.6 }}
            animate={{ rotate: 0,   opacity: 1, scale: 1   }}
            exit={{    rotate: -90, opacity: 0, scale: 0.6 }}
            transition={{ type: 'spring', stiffness: 300, damping: 18, duration: 0.25 }}
            style={{ display: 'flex', alignItems: 'center' }}
          >
            {/* Moon SVG */}
            <svg
              width="18" height="18" viewBox="0 0 24 24"
              fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  )
}
