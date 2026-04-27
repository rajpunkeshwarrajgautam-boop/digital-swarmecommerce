# GSD Project State: Digital Swarm

## Current milestone

**Milestone 10 — Reputation Economy** (Dynamic Fees ✅)





Phase summaries in `.planning/phases/` mark **M4.1–M4.3**, **M5**, and **M7 schema/merchant** work as complete. This file tracks **what to do next**, not historical phase labels.

## Operator dashboards

All console URLs, the SQL Editor shortcut, and analytics doc entry points live in **[`.planning/DASHBOARDS.md`](DASHBOARDS.md)**.

**Cursor IDE browser (GA4):** For **rajpunkeshwarrajgautam@gmail.com**, Analytics opened the **new property wizard** (no existing GA4 account on that identity before this session). The agent filled **Account** `Digital Swarm`, **Property** `digitalswarm.in`, **India** timezone, **Computers & Electronics**, **Small** business size. **Step 4 — Choose your business objectives** must be finished in the browser (pick one or two cards, e.g. **Understand web and/or app traffic** and/or **Generate leads**), then **Step 5 — Data collection** (add **Web** stream for `https://digitalswarm.in`), copy the **Measurement ID** (`G-…`) into **Vercel → Production → `NEXT_PUBLIC_GA_MEASUREMENT_ID`**, redeploy if needed. Then **Admin → Data display → Custom definitions** per **[`.planning/analytics/GA4-hero-ab-playbook.md`](analytics/GA4-hero-ab-playbook.md)**. If you already use another GA4 property under a different Google login, **cancel this wizard** (use step tabs → Back) and open that property instead.

## Four-step delivery (status)

| Step | Status | Docs and dashboards |
|------|--------|----------------------|
| **1. Ship** | Done | **[GitHub `main`](https://github.com/rajpunkeshwarrajgautam-boop/digital-swarmecommerce)** · **[Vercel](https://vercel.com/rajpunkeshwarrajgautam-boops-projects/antigravity-ecommerce)** · **[Production](https://digitalswarm.in)**. Hub: [`.planning/DASHBOARDS.md`](DASHBOARDS.md). |
| **2. `webhook_logs` in Supabase** | Done | Migration SQL executed in **Supabase SQL Editor** (Success); `public.webhook_logs` verified with `select … from pg_tables`. Source file: [`supabase/migrations/20260417120000_webhook_logs.sql`](../supabase/migrations/20260417120000_webhook_logs.sql). **[Supabase project](https://supabase.com/dashboard/project/uhswcljouelyprsinchj)** · [`.planning/DASHBOARDS.md`](DASHBOARDS.md). |
| **3. GA4 / GTM + reports** | Wizard to finish in IDE browser, then Admin + playbook | In the **Analytics** tab: complete **objectives** → **web stream** → **Vercel `NEXT_PUBLIC_GA_MEASUREMENT_ID`**. Then custom dimensions / explorations: **[`.planning/analytics/GA4-hero-ab-playbook.md`](analytics/GA4-hero-ab-playbook.md)**. **[GA4](https://analytics.google.com/)** · **[GTM](https://tagmanager.google.com/)** · [`.planning/DASHBOARDS.md`](DASHBOARDS.md). |
| **4. M7 Gaps** | Done | **[`phases/07-multi-vendor/07-VERIFICATION.md`](phases/07-multi-vendor/07-VERIFICATION.md)** — Dashboard connected to live stats, Add Product flow implemented. |

### Planning doc index (this milestone)

| Doc | Purpose |
|-----|---------|
| [`.planning/DASHBOARDS.md`](DASHBOARDS.md) | GitHub, Vercel, Supabase, SQL Editor, prod URL, GA4, GTM |
| [`.planning/analytics/GA4-hero-ab-playbook.md`](analytics/GA4-hero-ab-playbook.md) | GA4 + optional GTM for homepage hero A/B |

## Status snapshot

- **M4.1 Multi-currency**: Complete (see `04.1-SUMMARY.md`)
- **M4.2 Webhook resiliency**: App complete; **`webhook_logs`** present in Supabase (`20260417120000_webhook_logs.sql`)
- **M4.3 Performance**: Complete (see `04.3-SUMMARY.md`)
- **M5 Hardening / tests**: Complete (see `v5.0-ROADMAP.md` archive)
- **Homepage hero A/B**: Live on production; events `homepage_hero_impression`, `homepage_hero_cta_click` (+ shared `experiments` / attribution on `trackEcommerceEvent`)
- **Cursor coordinator rule**: `.cursor/rules/command-coordinator.mdc`

## Key specs

- **PROJECT.md**, **REQUIREMENTS.md**, **ROADMAP.md**: active at repo root

## Next actions (short)

1. In the **Cursor Analytics** tab, on **Choose your business objectives**, click **one or two** objective cards, then **Create** / continue to **Data collection**, add the **digitalswarm.in** web stream, copy **`G-…`** to **Vercel Production** `NEXT_PUBLIC_GA_MEASUREMENT_ID`, redeploy if needed.
2. In **GA4 Admin**, create the four **event-scoped** custom dimensions and explorations per **[`.planning/analytics/GA4-hero-ab-playbook.md`](analytics/GA4-hero-ab-playbook.md)**.
3. M7 Gap Closure complete.
4. Execute next scaling phase when ready.

## Completed reminders

- [x] Ship + GitHub `main` + Vercel prod + digitalswarm.in
- [x] Homepage hero experiment + measurement hooks in app code
- [x] GA4/GTM documentation and report recipes (playbook)
- [x] **`webhook_logs`** applied / verified in Supabase (SQL Editor)
