# 🧠 Digital Swarm — Persistent Project Memory

> **IMPORTANT**: This file is the single source of truth for all AI agents working on this project.
> Read this FIRST before making any changes. Update this file at the END of every session.
> Last Updated: 2026-04-27

---

## 🏗️ Project Identity

| Key | Value |
| :--- | :--- |
| **Project Name** | Digital Swarm |
| **Live URL** | <https://digitalswarm.in> |
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

```bash
src/
├── app/
│   ├── actions/              # Server Actions (payouts, tasks, audit, etc.)
│   ├── admin/                # Admin Control Panel
│   ├── affiliate/            # Affiliate Ecosystem
│   ├── blog/                 # Content Engine
│   ├── checkout/             # Cashfree Flow
│   ├── health/               # Protocol Health Check
│   ├── merchant/             # Merchant Node Dashboard
│   ├── products/             # Product Catalog
│   ├── pulse/                # System Telemetry
│   ├── search/               # Neural Discovery
│   ├── vault/                # Financial Ledger
│   ├── globals.css           # Global Styles
│   ├── layout.tsx            # Root Layout
│   └── page.tsx              # Protocol Nexus (Home)
│
├── components/
│   ├── layout/
│   │   ├── Header.tsx        # Nav + Identity
│   │   ├── NavbarMenu.tsx    # Desktop Navigation
│   │   ├── CommandMenu.tsx   # System Interface (⌘K)
│   │   ├── Footer.tsx        # Terminal Footer
│   │   ├── VisualQuality.tsx # CRT Effects
│   │   └── SmoothScroll.tsx  # Lenis Integration
│   ├── home/                 # Homepage Components
│   ├── cart/                 # Cart Ecosystem
│   ├── ui/                   # Atomic UI Components
│   └── chat/                 # AI Chat Widget
│
├── lib/
│   ├── data.ts               # Product Source of Truth
│   ├── store.ts              # Zustand State
│   ├── supabase.ts           # DB Integration
│   ├── commissions.ts        # Financial Split Logic
│   └── types.ts              # Global Types
│
└── db/
    ├── schema.sql            # Master Schema
    └── migrations/           # Financial Migrations
```

---

## 🛍️ Product Catalog (data.ts — Source of Truth)

| ID | Name | Price | Category | Download File |
| :--- | :--- | :--- | :--- | :--- |
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
| :--- | :--- | :--- | :--- |
| `saas-checklist` | Ultimate SaaS Launch Checklist | Guide | `saas-launch-checklist.txt` |
| `ai-prompt-library` | AI Agent Prompt Library | Asset | `ai-prompt-library.txt` |
| `mini-ui-kit` | Cyberpunk Mini UI Kit | Code | `cyberpunk-mini-ui-kit.tsx` |
| `tech-stack-audit` | SaaS Tech Stack Audit 2025 | Guide | `saas-tech-stack-audit.txt` |
| `design-system-tokens` | Digital Swarm Design System | Asset | `design-system-tokens.css` |

---

## 🗄️ Supabase Database Schema

### Tables

| Table | Purpose | RLS |
| :--- | :--- | :--- |
| `products` | Product catalog (synced from data.ts via schema.sql) | Public read |
| `orders` | Payment orders from Cashfree | Service role only |
| `order_items` | Line items per order | Service role only |
| `contact_messages` | Contact form submissions | Service role only |
| `reviews` | Product reviews | Public read |
| `customer_licenses` | License keys post-purchase | Service role only |
| `affiliates` | Affiliate applications + stats | Public insert only |
| `commissions` | Financial splits (Merchant/Affiliate) | RLS: Own ID only |


### Key ENV Variables (in Vercel)

```text
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
- [x] Merchant Node Dashboard with live Supabase telemetry
- [x] Protocol Genesis (Add Product) flow for merchants
- [x] Automated Commission Engine (70/10/20 split on payment)
- [x] The Vault (Merchant Payout Ledger)
- [x] Command Menu (⌘K) Interface
- [x] Autonomous Agent Task System (agent_tasks)
- [x] Referral Pulse (Affiliate Earnings Dashboard)
- [x] Mobile-responsive header + all pages
- [x] System Health Monitoring (/health)


---

## 🚧 Known Issues & Technical Debt

| Issue | Status | File |
| :--- | :--- | :--- |
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

### 2026-04-01 (Milestone 6.3 Finalized)

- ✅ **Milestone 6.3 (Trust Ecosystem) Finalized**:
  - **Media-Native Reviews**: Implemented Supabase Storage integration with `review-media` bucket.
  - **Review Form Enhanced**: Added multi-image upload with real-time previews and removal.
  - **Brutalist Gallery**: Digital product reviews now display "Visual Proof" in a high-density, industrial grid.
- ✅ **AI Evolution (Gemini 1.5 Flash)**:
  - Migrated the "Zero" AI Sales Architect from Groq to Google Gemini 1.5 Flash.
  - Implemented industrial-grade rate limiting (10 requests/min/IP) to protect API costs.
  - Fixed history mapping to align with Google AI SDK strict user/model alternating roles.
- ✅ **Code Polish**: Refactored `ReviewSystem.tsx` to follow strict "Planet ONO" brutalist rules (sharper edges, no `rounded-3xl`).
- ✅ **SEO Phase 2 (Canonical Tags)**:
  - **Global Authority**: Implemented root canonical tags to prevent duplicate content penalties from subdomains or alternate URLs.
  - **Dynamic Catalog SEO**: Engineered a server-side layout for the product detail route (`/product/[slug]`) to dynamically generate SEO metadata, canonical links, and high-fidelity OpenGraph/Twitter cards.
  - **List Page Integrity**: Hardened the `/products` list page metadata with explicit canonical references.
- ✅ **China E-Commerce Hardening (Phase 1)**:
  - **Listing Hardening**: Injected technical metadata (`aura`, `matchDensity`, `swarmScore`) into `data.ts`.
  - **Global Broadcaster**: Deployed brutalist `PromoBanner` globally in `layout.tsx` with "Industrial Liquidation" campaign.
  - **PDP Diagnostics**: Integrated "System Intelligence" panel into the product detail route for technical validation.
  - **Review System Refactor**: Hardened `ReviewSystem.tsx` to eliminate soft corners and adopt "Protocol Report" terminology.
- ✅ **Ad Creative Strategy & Deployment**:
  - **RSA Architecture**: Created 15-headline set with Headline 1 Pin and Dynamic Keyword Insertion (DKI).
  - **Meta A/B Test**: Deployed Angle A (Technical Diagnostic) vs. Angle B (Industrial Liquidation) ad sets.
  - **Visual Assets**: Generated high-fidelity brutalist industrial ad mockups for Angle A and B.
- 🚧 **Next Steps**: Monitor ad performance (ROAS target > 4.5x) and implement automated performance reporting.

### 2026-04-27 (Milestone 8: Global Scaling)

- ✅ **Automated Commission Logic**:
  - Engineered `src/lib/commissions.ts` for financial distributions (70% Merchant | 10% Affiliate | 20% Platform).
  - Integrated split recording into the purchase webhook.
  - Implemented `20260427110000_commissions.sql` with RLS policies for financial privacy.
- ✅ **Autonomous Evolution (Milestone 12) Hardening**:
  - Implemented `src/app/actions/tasks.ts` for dynamic agent goal assignment and tracking via Supabase `agent_tasks`.
  - Added global `CommandMenu.tsx` (⌘K) for high-velocity navigation and system directives.
  - **NEW**: Deployed `AgentTaskTracker.tsx` for real-time monitoring of merchant agent activities.
- ✅ **Merchant Financial Node & Health**:
  - Engineered `src/app/actions/payouts.ts` to provide live commission ledgers and settlement request hooks.
  - Created `/health` page for automated system status heartbeats.
  - **NEW**: Integrated real financial data and settlement logic into the **Swarm Ledger** (The Vault) with elite-dev-omega UX.
- ✅ **Production Harvest (Milestone 13) [FINAL]**:
  - **Audit Node**: Recursive cryptographic verification at `/admin/audit`.
  - **Genesis Certification**: HMAC-signed proof of protocol integrity.
  - **Mainnet Readiness**: Edge performance and security hardening complete.
- ✅ **Autonomous Evolution (Milestone 12) [Legacy]**:
  - **Swarm Pulse**: Global observability.
  - **HMAC Bridging**: Secure inter-node comms.
  - **Neural Search**: High-velocity discovery engine at `/search`.
  - **Dynamic Fees**: Platform cuts now scale based on Trust Score.
  - **Visual Ranks**: Tiered hierarchy (Initiate -> Legend).
  - **Swarm Brain**: Goal decomposition using Gemini 1.5 Pro logic.





---

## 🎯 Next Steps / Backlog

- [x] Finalize Milestone 6.3 (Trust Ecosystem)
- [x] SEO & Performance Hardening (Sitemap/Robots/LCP)
- [x] Automated Inventory Sync from `data.ts` to Supabase
- [x] SEO Phase 2: Canonical Tags & Metadata Optimization
- [ ] Mobile performance audit (Lighthouse score target: >90)
- [ ] Implement global SEO audit tracking component
