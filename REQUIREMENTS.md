# Functional Requirements: Digital Swarm

**Stack (actual):** Next.js 16 (App Router), React 19, Supabase, Clerk, Cashfree, Vercel.  
**Last reviewed:** April 2026 (aligned with codebase).

## R1: Product display
- [x] Grid view of products (`/products`, product cards)
- [x] Detail view per product (`/product/[slug]`, API `/api/products/[id]`)
- [x] Categories / verticals / solutions marketing pages
- [ ] Industrial-style sorting/filtering (partial — search / marketplace API exists)

## R2: Cart & checkout
- [x] Cart add / remove / quantity (Zustand `useCartStore`)
- [x] Checkout flow with validated fields (`/checkout`)
- [x] Payment: **Cashfree** (create order, verify, webhook) — not Stripe
- [x] Guest + signed-in paths (Clerk on dashboard; checkout collects email)

## R3: Blog & content
- [x] Blog list and post pages (`/blog`, `/blog/[slug]`, Supabase `blog_posts`)

## R4: Affiliates & growth
- [x] Affiliate attribution, dashboard, APIs
- [x] Marketing modals, upsells, email capture patterns

## R5: Partner / merchant
- [x] Merchant apply form → `/api/merchant/apply` → `merchant_applications` (requires DB migration)
- [x] Merchant dashboard filtered by Clerk `user.id` vs `merchant_id` on products

## R6: Contact & leads
- [x] Contact page POST → `/api/contact` → `contact_messages` (requires table + service role on Vercel)

## R7: Admin & ops
- [x] Admin products / orders surfaces and APIs
- [x] Setup check: `GET /api/setup/check`
- [x] Health: `GET /api/health` (products + optional admin table probes)

## Non-functional
- **Performance:** Next.js image optimization, App Router; LCP targets as per marketing pages
- **Accessibility:** Ongoing — semantic landmarks, form labels on contact
- **Aesthetics:** Cyberpunk / brutalist design system (Forge UI)

## Ops checklist (production)
1. Supabase: run `src/db/merchant_applications.sql` and ensure `contact_messages` exists (see `src/db/schema.sql`).
2. Vercel: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, Cashfree, Clerk, Resend as needed.
3. Optional local DB apply: `DATABASE_URL` in `.env.local` → `npm run db:apply-merchant-applications`.
4. E2E: `npm run test:e2e` (local). Production: set `PLAYWRIGHT_PRODUCTION_URL` → `npm run test:e2e:production`.
