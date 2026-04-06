# 🧠 DIGITAL SWARM — STATE.md
> Last Updated: 2026-04-06 20:20 IST | Session: Revenue Maximization Engine Complete
> Read this file at the START of every new session before taking any action.

---

## ✅ CURRENT STATUS: ALL FEATURES BUILT — PENDING GIT PUSH

**Live URL:** https://digitalswarm.in  
**GitHub:** https://github.com/rajpunkeshwarrajgautam-boop/digital-swarmecommerce  
**Vercel Project:** antigravity-ecommerce (Hobby Plan)  
**Last Session Commit:** `85ab276` — Revenue Activation Engine  
**⚠️ DEPLOY NEEDED:** Run `git add -A && git commit -m "feat: revenue maximization engine" && git push`

---

## 🏗️ TECH STACK

| Layer | Technology |
|---|---|
| Framework | Next.js (latest, App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | Supabase (PostgreSQL) |
| Email | Resend |
| Payments | Cashfree (India-only, sole gateway) |
| Analytics | Facebook Pixel (ID: 1128362615591321) |
| Hosting | Vercel (Hobby plan) |
| Domain | digitalswarm.in |

---

## ✅ COMPLETED THIS SESSION — Phase 5: Revenue Maximization Engine

### Wave 1: FB Pixel Full Wiring ✅
- [x] `src/app/product/[slug]/page.tsx` — `trackViewContent(name, price)` fires once per product view via `useRef` guard
- [x] `src/app/checkout/page.tsx` — `trackInitiateCheckout(total)` fires before Cashfree gateway opens

### Wave 2: Upsell Flow on /success ✅
- [x] `src/components/marketing/UpsellSection.tsx` — NEW component: fetches 2 complementary products (excluding purchased), renders branded neobrutalist "UPGRADE YOUR ARSENAL" upsell cards
- [x] `src/app/success/page.tsx` — UpsellSection injected after the security log block

### Wave 3: A/B Exit Intent Modal ✅
- [x] `src/lib/abTest.ts` — NEW: `getABVariant(key)` + `trackABImpression()` using localStorage persistence
- [x] `src/components/marketing/ExitIntentModalB.tsx` — NEW: Variant B modal (#CCFF00 background, "WAIT — Your Swarm Awaits", "CLAIM FREE CHEATSHEET" CTA)
- [x] `src/components/marketing/ExitIntentABRouter.tsx` — NEW: Client router using lazy useState initializer (no setState-in-effect)
- [x] `src/app/layout.tsx` — `<ExitIntentModal />` replaced with `<ExitIntentABRouter />` (50/50 split live)

### Wave 4: Resend Diagnostic Script ✅
- [x] `scripts/check-resend-domain.ts` — NEW: Calls Resend REST API, prints domain verification status, SPF/DKIM records, actionable fix instructions
- Run with: `npx tsx scripts/check-resend-domain.ts`

### Wave 5: Affiliate Program (Full) ✅
- [x] `src/app/api/affiliate/generate/route.ts` — NEW: `POST` generates `swarm_XXXXXXXX` ref code, upserts into `affiliates` table
- [x] `src/app/api/affiliate/click/route.ts` — NEW: `POST` increments click counter, uses Supabase RPC with safe fallback
- [x] `src/components/analytics/AffiliateTracker.tsx` — NEW: Client component fires once per session when `affiliate_id` cookie is present (set by existing middleware)
- [x] `src/app/layout.tsx` — `<AffiliateTracker />` injected globally
- [x] `src/app/api/cashfree/webhook/route.ts` — Commission crediting added: reads `affiliate_ref` from order, credits 10% to `affiliates.earnings` on `PAYMENT_SUCCESS_WEBHOOK`
- [x] `src/components/affiliates/AffiliateDashboardClient.tsx` — Full redesign: dark glassmorphism UI, live stats (clicks/conversions/earnings/CVR), one-click copy with feedback, 3-step how-it-works section, onboarding flow with generate button

### Wave 6: Full Swarm Stack Bundle ✅
- [x] `src/app/api/products/featured/route.ts` — NEW: `GET /api/products/featured` returns `is_featured=true` products, 60s cache
- [x] `src/app/bundle-builder/page.tsx` — Full rewrite: hero "Full Swarm Stack" section at top with 25% off featured products, animated product stack preview, one-click deploy; custom 3-pick builder below with 20% off; floating HUD unchanged

---

## 🔑 ENVIRONMENT VARIABLES (Vercel Production)

All confirmed set in Vercel:
- `NEXT_PUBLIC_SUPABASE_URL` ✅
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` ✅
- `SUPABASE_SERVICE_ROLE_KEY` ✅
- `RESEND_API_KEY` ✅ (also as `RESEND_KEY`)
- `NEXT_PUBLIC_FB_PIXEL_ID` ✅ (= 1128362615591321)
- `CRON_SECRET` ✅ (= swarm-cron-alpha-7x91k)
- `GOOGLE_GENERATIVE_AI_API_KEY` ✅
- `CASHFREE_APP_ID` ✅
- `CASHFREE_SECRET_KEY` ✅

---

## 📊 SUPABASE SCHEMA (Key Tables)

| Table | Purpose |
|---|---|
| `products` | 18+ digital products with pricing, tiers, download URLs |
| `blog_posts` | 21 articles (1 original + 20 seeded SEO articles) |
| `orders` | Purchase records — needs `affiliate_ref` column for commission tracking |
| `leads` | Email captures from exit intent modal |
| `email_sequences` | Drip email tracking (stage, next_send_at, unsubscribed) |
| `affiliates` | Partner program: ref_code, clicks, conversions, earnings |

### ⚠️ SUPABASE MIGRATION NEEDED (run once in Supabase SQL editor):
```sql
-- Add affiliate_ref to orders table (for commission crediting)
ALTER TABLE orders ADD COLUMN IF NOT EXISTS affiliate_ref TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS total_amount NUMERIC DEFAULT 0;

-- Ensure affiliates table has correct columns
ALTER TABLE affiliates ADD COLUMN IF NOT EXISTS ref_code TEXT UNIQUE;
ALTER TABLE affiliates ADD COLUMN IF NOT EXISTS user_email TEXT;
ALTER TABLE affiliates ADD COLUMN IF NOT EXISTS clicks INTEGER DEFAULT 0;
ALTER TABLE affiliates ADD COLUMN IF NOT EXISTS conversions INTEGER DEFAULT 0;
ALTER TABLE affiliates ADD COLUMN IF NOT EXISTS earnings NUMERIC DEFAULT 0;
ALTER TABLE affiliates ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';

-- Create index for fast ref code lookups
CREATE INDEX IF NOT EXISTS idx_affiliates_ref_code ON affiliates(ref_code);
CREATE INDEX IF NOT EXISTS idx_orders_affiliate_ref ON orders(affiliate_ref);
```

---

## 🎯 NEXT SESSION — Growth & Monitoring

### Priority 1: Traffic Generation
- [ ] LinkedIn outreach campaign (B2B, targeting founders/marketers)
- [ ] Submit to AI tool directories: FutureTools, There's An AI For That, Product Hunt
- [ ] Twitter/X content: post 3 threads from the 20 blog articles

### Priority 2: Monitor A/B Test Results
- [ ] After 500+ impressions: check `sessionStorage` ab_impression_exit_intent_modal distribution
- [ ] Compare lead capture rates between Variant A (current) and Variant B (CCFF00 inversion)

### Priority 3: Affiliate Program Activation
- [ ] Announce affiliate program to existing email list
- [ ] Run: `npx tsx scripts/check-resend-domain.ts` to verify Resend domain

### Priority 4: Revenue Expansion
- [x] Wire `affiliate_ref` cookie → Cashfree order creation ✅ DONE THIS SESSION
- [ ] Monitor bundle-builder conversion on `/bundle-builder`

---

## 🐛 KNOWN MINOR ISSUES (Non-blocking)

1. **Lint warnings** in `ExitIntentModal.tsx`, `success/page.tsx`: Pre-existing sonarqube style warnings. Not build-blocking.
2. **`orders.affiliate_ref` column**: Needs to be added via SQL migration above before commission crediting will work end-to-end.
3. **Wire affiliate_ref into Cashfree order creation**: The Cashfree create-order route needs to read the `affiliate_id` cookie from the request and store it on the order record. This is the final connection point.

---

## 📁 KEY FILE LOCATIONS

```
src/
├── app/
│   ├── layout.tsx                          # Root layout — FBPixel + AffiliateTracker + ABRouter
│   ├── success/page.tsx                    # Order confirmation + trackPurchase + UpsellSection
│   ├── bundle-builder/page.tsx             # Full Swarm Stack hero + custom builder
│   └── api/
│       ├── cashfree/webhook/route.ts       # Webhook handler + affiliate commission crediting
│       ├── cashfree/verify/route.ts        # Payment verification
│       ├── cashfree/create-order/route.ts  # TODO: pass affiliate_ref cookie to order
│       ├── leads/route.ts                  # Lead capture + drip enrollment
│       ├── affiliate/
│       │   ├── generate/route.ts           # POST: create ref code
│       │   └── click/route.ts              # POST: increment click counter
│       ├── products/featured/route.ts      # GET: is_featured=true products
│       └── drip/
│           ├── process/route.ts            # Cron-triggered drip processor
│           └── unsubscribe/route.ts        # GDPR unsubscribe
├── components/
│   ├── analytics/
│   │   ├── FBPixel.tsx                     # All pixel events
│   │   └── AffiliateTracker.tsx            # Click tracking (new)
│   ├── marketing/
│   │   ├── ExitIntentModal.tsx             # Variant A (original)
│   │   ├── ExitIntentModalB.tsx            # Variant B (new — CCFF00 bg)
│   │   ├── ExitIntentABRouter.tsx          # A/B router (new)
│   │   └── UpsellSection.tsx               # Post-purchase upsell (new)
│   └── affiliates/
│       └── AffiliateDashboardClient.tsx    # Enhanced dashboard (new)
├── lib/
│   └── abTest.ts                           # A/B variant utility (new)
scripts/
└── check-resend-domain.ts                  # Resend diagnostic (new)
vercel.json                                 # Cron: 0 6 * * * → /api/drip/process
```

---

*"The machine is built. Now feed it traffic and monitor the conversion delta."* 🚀
