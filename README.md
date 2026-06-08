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

## Project structure

```
app/
├── page.tsx                        # Homepage — hero, features, testimonials, checkout
├── engineering/page.tsx            # Engineering specs
├── process/page.tsx                # The ritual workflow
├── support/page.tsx                # Support and warranty
├── order-confirmation/
│   ├── page.tsx                    # Server Component — Stripe session retrieval and verification
│   └── PrintButton.tsx             # Client Component — window.print()
├── api/
│   ├── checkout/route.ts           # Creates Stripe Checkout Session
│   ├── webhooks/stripe/route.ts    # Handles payment confirmation, writes order record
│   └── dispatch/route.ts           # Email capture for footer dispatch form
├── layout.tsx                      # Root layout — flash-prevention script
└── globals.css                     # Design token system + dark mode overrides

components/
├── Navbar.tsx                      # Nav with ThemeToggle, mobile dropdown
├── Footer.tsx                      # Footer with live dispatch form
└── ThemeToggle.tsx                 # Dark mode toggle with Framer Motion
```

---

## Environment variables

Create a `.env.local` file at the project root with the following:

```env
# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# App
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

All keys prefixed `NEXT_PUBLIC_` are safe to expose to the browser. `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, and `SUPABASE_SERVICE_ROLE_KEY` are server-only — they must never appear in the client bundle.

---

## Database schema

Run the following in the Supabase SQL Editor to set up the required tables:

```sql
-- Products table
CREATE TABLE products (
  id                text PRIMARY KEY,
  name              text NOT NULL,
  price             integer NOT NULL,
  inventory_count   integer NOT NULL DEFAULT 48
);

INSERT INTO products (id, name, price, inventory_count)
VALUES ('kinetic-base-unit', 'KINETIC Espresso Maker', 499, 48);

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE products;

-- RLS on products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON products FOR SELECT USING (true);

-- Orders table
CREATE TABLE orders (
  id                  uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  stripe_session_id   text UNIQUE,
  stripe_payment_id   text,
  customer_email      text,
  customer_name       text,
  order_ref           text,
  finish              text,
  amount_total        integer,
  currency            text,
  status              text DEFAULT 'processing',
  fulfillment_status  text DEFAULT 'pending',
  shipping_name       text,
  shipping_line1      text,
  shipping_line2      text,
  shipping_city       text,
  shipping_state      text,
  shipping_postal     text,
  shipping_country    text,
  created_at          timestamp with time zone DEFAULT timezone('utc', now())
);

-- RLS on orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "No public read"   ON orders FOR SELECT USING (false);
CREATE POLICY "No public insert" ON orders FOR INSERT WITH CHECK (false);

-- Email captures table
CREATE TABLE email_captures (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email       text NOT NULL UNIQUE,
  source      text DEFAULT 'dispatch_footer',
  created_at  timestamp with time zone DEFAULT timezone('utc', now())
);

ALTER TABLE email_captures ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert" ON email_captures FOR INSERT WITH CHECK (true);
CREATE POLICY "No public read"    ON email_captures FOR SELECT USING (false);

-- Inventory decrement function
CREATE OR REPLACE FUNCTION decrement_inventory(product_id text, amount integer)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE products
  SET inventory_count = inventory_count - amount
  WHERE id = product_id AND inventory_count >= amount;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Insufficient inventory for product: %', product_id;
  END IF;
END;
$$;
```

---

## Local development

```bash
# Install dependencies
npm install

# Start the development server
npm run dev

# In a separate terminal — forward Stripe webhooks to localhost
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Use Stripe test card `4242 4242 4242 4242` with any future expiry and any CVC to run a test payment end to end.

---

## Deployment

The project deploys to Vercel via GitHub. Push to the `main` branch to trigger a production deployment.

After deploying, update the Stripe webhook endpoint URL in the Stripe Dashboard to point at the live Vercel domain. Reveal the new signing secret and update `STRIPE_WEBHOOK_SECRET` in Vercel's environment variables. Redeploy once to pick up the updated secret.

Update `NEXT_PUBLIC_BASE_URL` in Vercel environment variables to the live domain.

---

## Build philosophy

The project was built in two deliberate phases. A 7-day HTML and CSS prototype validated the design direction — every fake function in that prototype was a written spec for the production backend. The 23-day production build converted those specs into a working system.

The decisions that do not appear in tutorials: the raw buffer requirement for Stripe webhook signature verification, the idempotency guard against Stripe retries, the full session retrieval inside the webhook handler, the useReducer for concurrent state sources, the client boundary for `window.print()`, and the blocking script for dark mode flash prevention.

---

## Licence

MIT
