# GSD Project State: Digital Swarm

## Current milestone

**Milestone 7 — Multi-vendor & growth** (core infra shipped; iterate on adoption and measurement)

Phase summaries in `.planning/phases/` mark **M4.1–M4.3**, **M5**, and **M7 schema/merchant** work as complete. This file tracks **what to do next**, not historical phase labels.

## Status snapshot

- **M4.1 Multi-currency**: Complete (see `04.1-SUMMARY.md`)
- **M4.2 Webhook resiliency**: Complete in app; **`webhook_logs` table** — apply SQL from `supabase/migrations/20260417120000_webhook_logs.sql` in Supabase (Dashboard → SQL Editor or `supabase db push` if the project is linked)
- **M4.3 Performance**: Complete (see `04.3-SUMMARY.md`)
- **M5 Hardening / tests**: Complete (see `v5.0-ROADMAP.md` archive)
- **Homepage hero A/B**: Live in codebase (`homepage_hero`); GA4/dataLayer events `homepage_hero_impression`, `homepage_hero_cta_click` (+ `experiments` on all `trackEcommerceEvent` calls)
- **Cursor coordinator rule**: `.cursor/rules/command-coordinator.mdc` (always-on agent behavior for this repo)

## Key specs

- **PROJECT.md**, **REQUIREMENTS.md**, **ROADMAP.md**: active at repo root

## Next actions (priority)

1. **Ship**: `main` should include merged hero A/B + analytics + migration; production deploy (e.g. Vercel) so visitors get the experiment.
2. **Database**: Confirm `webhook_logs` exists in production Supabase (run migration SQL once if missing).
3. **Analytics**: In GTM/GA4, register custom events `homepage_hero_impression` and `homepage_hero_cta_click`; build a report comparing `ab_variant` A vs B (and optional BigQuery export if used).
4. **M7 follow-through**: Run `/merchant` and admin queue UAT from `07-UAT.md`; file issues for gaps.

## Completed reminders

- [x] Deployment/metadata/sitemap audit cycles (see prior URGENT_REMINDER block in git history)
- [x] Homepage hero experiment + measurement hooks in app code
