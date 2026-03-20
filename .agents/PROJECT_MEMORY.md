# 🧠 Digital Swarm — Persistent Project Memory
> **IMPORTANT**: This file is the single source of truth for all AI agents working on this project.
> Read this FIRST before making any changes. Update this file at the END of every session.
> Last Updated: 2026-03-20

---

## 🏗️ Project Identity

| Key | Value |
|---|---|
| **Project Name** | Digital Swarm |
| **Live URL** | https://digitalswarm.in |
| **Vercel Project** | `antigravity-ecommerce` |
| **GitHub Repo** | `rajpunkeshwarrajgautam-boop/digital-swarmecommerce` |
| **Supabase Project** | `digitalswarm` |
| **Framework** | Next.js 15 (App Router) |
| **Styling** | Tailwind CSS + Custom CSS (globals.css) |
| **Auth** | Clerk |
| **Database** | Supabase (PostgreSQL) |
| **Payments** | Cashfree |
| **Email** | Resend |
| **Deploy** | Vercel (auto-deploy on push to `main`) |

---

## 🎨 Design System (DO NOT CHANGE WITHOUT REASON)

### Core Aesthetic: "Planet ONO / Brutalist Industrial"
- **Style**: Dark, high-contrast, sharp edges, NO rounded corners on major elements
- **Typography**: Black weight, italic, uppercase, tracking-tighter
- **Font**: System sans + Inter
- **Animations**: Framer Motion, GPU-accelerated, 200-400ms cubic-bezier

### Color Palette (from globals.css)
```css
--primary:    hsl(45, 100%, 50%)   /* Deep Industrial Gold */
--background: hsl(0, 0%, 2%)      /* Dystopian Void Black */
--surface:    hsl(0, 0%, 5%)      /* Deep Gunmetal Grey */
--border:     hsl(0, 0%, 15%)     /* Subdued Iron Border */
--accent:     hsl(180, 100%, 50%) /* Neo-Cyan */
--foreground: hsl(0, 0%, 98%)     /* Pure White */
```

### UI Rules
- Border style: `border-4 border-white` on feature panels
- Shadows: `shadow-[25px_25px_0px_rgba(0,0,0,0.8)]` (brutalist offset)
- No `rounded-*` on major containers (use `rounded-none`)
- Labels: `text-[10px] uppercase tracking-[0.5em] italic`

---

## 🗺️ Project Structure

```
src/
├── app/
│   ├── page.tsx              # Homepage (ParallaxHero + sections)
│   ├── freebies/page.tsx     # Freebies page (5 items with downloads)
│   ├── products/page.tsx     # Product catalog
│   ├── checkout/             # Cashfree checkout flow
│   ├── portal/               # Customer license portal (JWT)
│   ├── affiliate/            # Affiliate application + dashboard
│   ├── blog/                 # Blog section
│   ├── contact/              # Contact page
│   ├── globals.css           # Global styles + CSS variables
│   └── layout.tsx            # Root layout (Clerk, SmoothScroll, Header, Footer)
│
├── components/
│   ├── layout/
│   │   ├── Header.tsx        # Nav with mobile menu + cart count
│   │   ├── Footer.tsx        # Site footer
│   │   ├── MainWrapper.tsx   # Conditional top padding by route
│   │   ├── VisualQuality.tsx # CRT scanlines + grain effect
│   │   └── SmoothScroll.tsx  # Lenis smooth scroll
│   ├── home/
│   │   ├── ParallaxHero.tsx  # Above-fold hero section
│   │   ├── FeaturedSection.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── SocialProof.tsx
│   │   ├── Testimonials.tsx
│   │   ├── ProblemSolution.tsx
│   │   ├── LeadMagnet.tsx    # Free audit capture (URL + email)
│   │   ├── EmailCapture.tsx
│   │   └── HomeFAQ.tsx
│   ├── cart/
│   │   └── CartDrawer.tsx    # Shopping cart sidebar (dark theme, NO yellow)
│   ├── ui/
│   │   ├── CustomCursor.tsx  # Mouse cursor (disabled on touch)
│   │   └── Button.tsx        # Shared button component
│   └── chat/
│       └── AiChat.tsx        # Floating AI chat widget
│
├── lib/
│   ├── data.ts               # LOCAL product catalog (source of truth)
│   ├── store.ts              # Zustand cart store
│   ├── supabase.ts           # Supabase client (anon + admin)
│   ├── email-service.ts      # Resend email integration
│   └── types.ts              # TypeScript interfaces
│
├── db/
│   ├── schema.sql            # Full DB schema (run in Supabase SQL editor)
│   └── migration_cashfree.sql
│
└── setup/
    └── migrate.ts            # DB migration helper
```

---

## 🛍️ Product Catalog (data.ts — Source of Truth)

| ID | Name | Price | Category | Download File |
|---|---|---|---|---|
| `sentinel-research` | Sentinel Research Infiltrator (Universal Dashboard) | ₹3499 | AI Agents | `sentinel-research-optimized.zip` |
| `swarm-sales` | Swarm Sales Infiltrator (Dashboard Edition) | ₹1999 | AI Agents | `swarm-sales-optimized.zip` |
| `swarm-finance` | Swarm Finance Oracle (Dashboard Edition) | ₹2499 | AI Agents | `swarm-finance-optimized.zip` |
| `swarm-legal` | Swarm Legal Architect (Dashboard Edition) | ₹2499 | AI Agents | `swarm-legal-optimized.zip` |
| `swarm-talent` | Swarm Recruitment Command (Dashboard Edition) | ₹1799 | AI Agents | `swarm-talent-optimized.zip` |
| `swarm-property` | Swarm Property Infiltrator (Dashboard Edition) | ₹1999 | AI Agents | `swarm-property-optimized.zip` |
| `swarm-capital` | Swarm Capital Trend Oracle (Dashboard Edition) | ₹3499 | Finance & Investment | `swarm-capital-optimized.zip` |
| `sentinel-seo` | Sentinel SEO Infiltrator (Organic Hive) | ₹1599 | Marketing AI | `sentinel-seo-optimized.zip` |
| `1000-web-apps` | 1000 Manually Tested Web Applications | ₹200 | Web Development | `1000-web-apps.pdf` |
| `ultimate-web-dev-bundle` | Ultimate Web Development Bundle | ₹300 | Bundles | `ultimate-web-dev-bundle.pdf` |
| `ultimate-mega-bundle` | Ultimate Mega Bundle (Design & Code) | ₹400 | Bundles | `ultimate-mega-bundle.pdf` |
| `agency-seo-framework` | Scale-SEO Framework (Monthly Managed) | ₹4999 | Agency Services | `service_contract.pdf` |
| `agency-ppc-lab` | Elite-PPC Performance Lab (Ad Spend Management) | ₹2999 | Agency Services | `service_contract.pdf` |

---

## 🎁 Freebies (digitalswarm.in/freebies)

| ID | Name | Type | Download File |
|---|---|---|---|
| `saas-checklist` | Ultimate SaaS Launch Checklist | Guide | `saas-launch-checklist.txt` |
| `ai-prompt-library` | AI Agent Prompt Library | Asset | `ai-prompt-library.txt` |
| `mini-ui-kit` | Cyberpunk Mini UI Kit | Code | `cyberpunk-mini-ui-kit.tsx` |
| `tech-stack-audit` | SaaS Tech Stack Audit 2025 | Guide | `saas-tech-stack-audit.txt` |
| `design-system-tokens` | Digital Swarm Design System | Asset | `design-system-tokens.css` |

---

## 🗄️ Supabase Database Schema

### Tables
| Table | Purpose | RLS |
|---|---|---|
| `products` | Product catalog (synced from data.ts via schema.sql) | Public read |
| `orders` | Payment orders from Cashfree | Service role only |
| `order_items` | Line items per order | Service role only |
| `contact_messages` | Contact form submissions | Service role only |
| `reviews` | Product reviews | Public read |
| `customer_licenses` | License keys post-purchase | Service role only |
| `affiliates` | Affiliate applications + stats | Public insert only |

### Key ENV Variables (in Vercel)
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...
CASHFREE_APP_ID=...
CASHFREE_SECRET_KEY=...
RESEND_API_KEY=...
```

---

## ✅ Completed Features (Do NOT re-implement)

- [x] Homepage with Parallax Hero, all sections
- [x] Product listing page + individual product pages
- [x] Zustand cart + CartDrawer (dark theme, NO yellow blocks)
- [x] Cashfree payment integration (create-order + verify routes)
- [x] Clerk authentication + user portal
- [x] Customer License Portal (JWT-secured download links)
- [x] Affiliate application form + dashboard
- [x] Blog section
- [x] Contact page with Supabase integration
- [x] Freebies page (5 items, all with real downloadable files)
- [x] Custom cursor (disabled on touch devices)
- [x] Lenis smooth scrolling
- [x] CRT Scanlines + Grain (VisualQuality.tsx)
- [x] Floating AI Chat widget
- [x] Email capture + lead magnet (Resend integration)
- [x] Google Analytics + Meta Pixel tracking
- [x] Dark theme cart drawer (fixed yellow block bug)
- [x] Content-visibility + will-change CSS performance optimizations
- [x] Mobile-responsive header + all pages

---

## 🚧 Known Issues & Technical Debt

| Issue | Status | File |
|---|---|---|
| `llama3.2` in llama3.2 is a weak model for Aider | Open | N/A |
| Freebie files are .txt/.tsx/.css (not PDFs) | Acceptable for now | `/public/downloads/` |
| `rounded-[2rem]` could be `rounded-4xl` | Minor lint | `freebies/page.tsx:126` |
| Supabase product table not auto-synced with data.ts | Managed manually | `data.ts` + `schema.sql` |

---

## 📐 Architecture Decisions (WHY things are done this way)

1. **Local data.ts over Supabase for products**: Products rarely change; local data avoids DB latency on product listing pages. Supabase is used for orders, licenses, and user-generated data.
2. **Cashfree over Stripe**: Indian UPI + Netbanking support, better for Indian market.
3. **No rounded corners on major cards**: Intentional brutalist/industrial aesthetic. Only small interactive elements (badges, pills) use rounded corners.
4. **CSS `content-visibility: auto`**: Applied to sections below the fold for faster initial paint on mobile.
5. **Zustand over Context API for cart**: More performant, avoids React re-render cascade on cart updates.
6. **Clerk over NextAuth**: Better DX, pre-built UI, multi-session, and JWT support for license portal.

---

## 📋 Session Log (What Was Done & When)

### 2026-03-20 (Latest Session)
- ✅ Cleared 1.1GB Antigravity IDE cache (click_feedback + webp recordings)
- ✅ Fixed CartDrawer yellow block bug → dark theme
- ✅ Implemented 5 functional freebie downloads (Guide/Asset/Code categories)
- ✅ Applied CSS performance optimizations (`content-visibility`, `will-change`)
- ✅ Updated all AI agent download URLs to `-optimized.zip` versions
- ✅ Set up this persistent memory system

### Previous Sessions
- ✅ Implemented affiliate portal + commission dashboard
- ✅ Built customer license portal with JWT verification
- ✅ Integrated Cashfree payment gateway
- ✅ Set up Google Analytics + Meta Pixel
- ✅ Built floating AI chat widget

---

## 🎯 Next Steps / Backlog

- [ ] Add PDF versions of freebie guides (currently .txt files)
- [ ] Set up Aider with Gemini API key for better local development
- [ ] Add product image optimization (next/image with proper sizes)
- [ ] Implement affiliate click tracking (increment `affiliates.clicks` via API)
- [ ] Add review submission form on product pages
- [ ] Set up email automation for post-purchase license delivery
- [ ] Add sitemap.xml and robots.txt for SEO
- [ ] Mobile performance audit (Lighthouse score target: >90)
