# DIGITAL SWARM — Production State
**Last Updated:** 2026-04-26 | **Status:** 🔵 GENESIS MAINNET ACTIVE

---

## 🌐 Live URLs
- **Production:** https://digitalswarm.in
- **Blog:** https://digitalswarm.in/blog
- **Blog Posts:** https://digitalswarm.in/blog/[slug] ✅ All 20 posts working
- **Products:** https://digitalswarm.in/products
- **Checkout:** https://digitalswarm.in/checkout

---

## 🏗️ Tech Stack
| Layer | Technology |
|---|---|
| **Framework** | Next.js 16.1.6 (App Router) + React 19 |
| **Database** | Supabase (PostgreSQL) |
| **Payments** | Cashfree PG |
| **Email** | Resend |
| **Auth** | Clerk |
| **Deployment** | Vercel (Production + Preview) |
| **Repo** | github.com/rajpunkeshwarrajgautam-boop/digital-swarmecommerce |

---

## ⚠️ Critical Architecture Notes

### Next.js 15/16 Breaking Change — params are Promises
**ALL** dynamic route pages must `await` params before accessing properties:
```ts
// ✅ CORRECT — Next.js 15+
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
}

// ❌ WRONG — causes undefined slug, query returns null, triggers notFound()
export default async function Page({ params }: { params: { slug: string } }) {
  const slug = params.slug; // undefined in Next.js 15+!
}
```
This was the root cause of the /blog/[slug] 404 bug that persisted across multiple sessions.

### Supabase Client Initialization
`src/lib/supabase.ts` reads credentials DIRECTLY from `process.env` — bypasses `env.ts` Zod validation.
- Public URL and Anon Key are hardcoded as fallbacks (they are public values, safe to do so)
- `supabase` (public client) is always non-null
- `supabaseAdmin` (service role) is non-null when `SUPABASE_SERVICE_ROLE_KEY` is set in Vercel

### Blog Post Pages
- `export const dynamic = "force-dynamic"` — no ISR caching
- Uses `.maybeSingle()` not `.single()` to prevent error on empty result
- Falls back from `supabaseAdmin` → `supabase` public client

---

## 📦 Database Schema (Supabase)
### `blog_posts` table
| Column | Type | Notes |
|---|---|---|
| id | uuid | PK |
| slug | text | URL slug, unique |
| title | text | Article title |
| excerpt | text | Short description |
| content | text | Full markdown content |
| image_url | text | Hero image URL |
| tags | text[] | Category tags |
| author | text | Author name |
| reading_time_minutes | int | Est. reading time |
| published_at | timestamptz | Publication date |
| status | text | 'published' (added via migration) |

RLS: Public read enabled. Admin client (service role) bypasses all RLS.

### `orders` table
Has `affiliate_ref` and `total_amount` columns (added in Phase 7).

### `affiliates` table
Has `commission_balance` column (added in Phase 7).

---

## 🔑 Vercel Environment Variables (Production)
| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anon key (client-side) |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin key (server-side only) |
| `CASHFREE_APP_ID` | Cashfree payment gateway |
| `CASHFREE_SECRET_KEY` | Cashfree secret |
| `RESEND_API_KEY` | Email delivery |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk auth |
| `CLERK_SECRET_KEY` | Clerk server auth |
| `NEXT_PUBLIC_FB_PIXEL_ID` | Facebook Pixel |

---

## ✅ Features Confirmed Working
- [x] Blog list `/blog` — fetches all 20 posts from Supabase
- [x] Blog posts `/blog/[slug]` — all 20 posts render with full content
- [x] Cashfree checkout + webhook (affiliate commission crediting)
- [x] Affiliate attribution via cookie (`affiliate_id`) + `ref_code` validation
- [x] FB Pixel ViewContent + InitiateCheckout events
- [x] Exit Intent A/B modal router in root layout
- [x] Upsell section on `/success` page
- [x] AffiliateTracker component in root layout
- [x] Supabase public + admin clients both connected

---

## 🔧 Key Files Modified (Phase 7-8)
```
src/lib/supabase.ts              — Direct process.env reads, hardcoded public fallbacks
src/app/blog/[slug]/page.tsx     — await params fix, force-dynamic, maybeSingle
src/app/api/cashfree/webhook/route.ts   — 10% affiliate commission on PAYMENT_SUCCESS
src/app/api/cashfree/create-order/route.ts  — affiliate ref_code validation
src/app/layout.tsx               — ExitIntentABRouter + AffiliateTracker
src/app/success/page.tsx         — UpsellSection injected
src/lib/types.ts                 — Added slug? to Product type
```
