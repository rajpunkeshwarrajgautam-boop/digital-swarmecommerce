# GSD Project State: Digital Swarm

## Current milestone

**Milestone 7 — Multi-vendor & growth** (core infra shipped; iterate on adoption and measurement)

Phase summaries in `.planning/phases/` mark **M4.1–M4.3**, **M5**, and **M7 schema/merchant** work as complete. This file tracks **what to do next**, not historical phase labels.

## Operator dashboards

All console URLs and the SQL hint live in one file: **[`.planning/DASHBOARDS.md`](DASHBOARDS.md)**.

## Four-step delivery (status)

| Step | Status | Docs & links |
|------|--------|----------------|
| **1. Ship** | Done | Code on **[GitHub `main`](https://github.com/rajpunkeshwarrajgautam-boop/digital-swarmecommerce)**; prod on **[digitalswarm.in](https://digitalswarm.in)**. **[Vercel project](https://vercel.com/rajpunkeshwarrajgautam-boops-projects/antigravity-ecommerce)** for env & deployments. Details: [DASHBOARDS.md](DASHBOARDS.md). |
| **2. `webhook_logs` in Supabase** | Operator once | Run SQL from [`supabase/migrations/20260417120000_webhook_logs.sql`](../supabase/migrations/20260417120000_webhook_logs.sql) in Supabase **SQL Editor** (direct tab: [DASHBOARDS.md](DASHBOARDS.md)). **[Supabase dashboard](https://supabase.com/dashboard/project/uhswcljouelyprsinchj)**. |
| **3. GA4 / GTM + reports** | Playbook ready | Full setup: **[`.planning/analytics/GA4-hero-ab-playbook.md`](analytics/GA4-hero-ab-playbook.md)** — event-scoped dimensions (`ab_variant`, `ab_test`, `cta_kind`, `cta_label`), A vs B exploration, funnel (impression → `primary_catalog` CTA) with `ab_variant` breakdown, DebugView, optional GTM. **[GA4](https://analytics.google.com/)** · **[GTM](https://tagmanager.google.com/)** · [DASHBOARDS.md](DASHBOARDS.md). |
| **4. M7 UAT** | Pending | **[`phases/07-multi-vendor/07-UAT.md`](phases/07-multi-vendor/07-UAT.md)** — `/merchant`, admin queue, filing gaps. |

## Status snapshot

- **M4.1 Multi-currency**: Complete (see `04.1-SUMMARY.md`)
- **M4.2 Webhook resiliency**: App complete; DB table via migration file above
- **M4.3 Performance**: Complete (see `04.3-SUMMARY.md`)
- **M5 Hardening / tests**: Complete (see `v5.0-ROADMAP.md` archive)
- **Homepage hero A/B**: Live on production; events `homepage_hero_impression`, `homepage_hero_cta_click` (+ shared `experiments` / attribution on `trackEcommerceEvent`)
- **Cursor coordinator rule**: `.cursor/rules/command-coordinator.mdc`

## Key specs

- **PROJECT.md**, **REQUIREMENTS.md**, **ROADMAP.md**: active at repo root

## Next actions (short)

1. Complete **GA4 Admin** steps in the playbook (custom dimensions + one Exploration) — requires your Google login.
2. Apply **`webhook_logs`** SQL in Supabase if not already applied.
3. Execute **M7 UAT** when ready.

## Completed reminders

- [x] Ship + GitHub `main` + Vercel prod + digitalswarm.in
- [x] Homepage hero experiment + measurement hooks in app code
- [x] GA4/GTM documentation and report recipes (playbook)
