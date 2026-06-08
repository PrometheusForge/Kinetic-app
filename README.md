# KINETIC Espresso Maker — Product Launch Web App

A production-grade DTC e-commerce web application built for a $499 manual espresso machine. Engineered in two phases: a 7-day HTML/CSS visual prototype for design validation, followed by a 23-day conversion into a full-stack Next.js application with real payments, live inventory, and secure order management.

**Live:** [kinetic-app-theta.vercel.app](https://kinetic-app-theta.vercel.app)

---

## What this is

KINETIC is a transactional microsite — a single-product marketing site with a fully functional e-commerce layer built inside one Next.js application. It processes real Stripe payments, tracks live inventory via Supabase WebSockets, stores complete delivery records, and renders a branded order confirmation with a printable receipt.

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Frontend | React, Framer Motion |
| Payments | Stripe Checkout + Webhooks |
| Database | Supabase (PostgreSQL + Realtime) |
| Auth / Security | HMAC-SHA256, Row Level Security |
| Email | Resend |
| Deployment | Vercel |
| Language | TypeScript |

---

## Features

### Payments
- PCI-compliant Stripe Checkout Sessions created server-side
- Card data never touches application code — handled entirely by Stripe's hosted page
- Human-readable order references generated at session creation (`KIN-XXXXXXXX`) stored in Stripe session metadata

### Webhook security
- HMAC-SHA256 signature verification on every incoming webhook
- Raw request buffer preserved — Next.js default body parser disabled on the webhook route
- Idempotency guard checks for existing order by session ID before any write operation
- Full session retrieved from Stripe API inside the webhook handler — event payload summary is not relied upon for shipping details or metadata

### Database
- Complete delivery record written on confirmed payment: customer name, email, product finish, full shipping address, order reference, amount, and `fulfillment_status` starting at `'pending'`
- Atomic inventory decrement via Postgres RPC function — prevents race conditions on concurrent purchases
- Row Level Security enforces default-deny: public visitors read `inventory_count` only, all order writes require the service role key

### Real-time inventory
- Supabase Realtime WebSocket subscription updates the inventory counter for every active browser session within 200ms of a confirmed purchase
- Counter initialises from a live database read — not a hardcoded value

### Order confirmation
- Session ID appended to `success_url` by Stripe as `{CHECKOUT_SESSION_ID}`
- Confirmation page retrieves and verifies full session server-side via Next.js Server Component
- Displays order reference, product finish, amount charged, shipping address, and a print receipt button
- `PrintButton.tsx` isolated as a `'use client'` component — keeps `window.print()` off the server
- `@media print` stylesheet forces white background regardless of active theme

### Email capture
- Footer dispatch form writes to a separate `email_captures` table via `/api/dispatch`
- Unique constraint on email column — duplicate submissions return a 200 with "Already on the list." rather than an error
- RLS blocks all public reads on the captures table

### Dark mode
- Theme toggle in the nav bar — moon/sun icon with Framer Motion spring animation
- Preference persisted in `localStorage` under `kinetic-theme`
- Blocking inline script in `layout.tsx` sets `data-theme` on `<html>` before React hydrates — eliminates theme flash on every page load
- All design tokens switch via `[data-theme="dark"]` CSS overrides — no component-level changes required
- Brutal box shadows invert from black offset to accent orange in dark mode

### Scroll animations
- Intersection Observer with `boundingClientRect.top > 0` guard — prevents animations firing during Next.js route-change scroll-to-top
- Observer attachment delayed 150ms after mount to allow scroll position to settle before elements are watched

---

## Build philosophy

The project was built in two deliberate phases. A 7-day HTML and CSS prototype validated the design direction — every fake function in that prototype was a written spec for the production backend. The 23-day production build converted those specs into a working system.

The decisions that do not appear in tutorials: the raw buffer requirement for Stripe webhook signature verification, the idempotency guard against Stripe retries, the full session retrieval inside the webhook handler, the useReducer for concurrent state sources, the client boundary for `window.print()`, and the blocking script for dark mode flash prevention.
