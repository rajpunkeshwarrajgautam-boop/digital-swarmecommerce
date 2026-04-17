# Operator dashboards (Digital Swarm)

Single reference for **GitHub**, **Vercel**, **Supabase** (project + **SQL Editor**), **live site**, **GA4**, **GTM**, and the **`webhook_logs`** migration hint.

**Related planning:** [`.planning/STATE.md`](STATE.md) (four-step delivery status) · [`.planning/analytics/GA4-hero-ab-playbook.md`](analytics/GA4-hero-ab-playbook.md) (GA4 dimensions, explorations, funnel, DebugView, optional GTM)

---

## Console URLs

| Surface | URL |
|---------|-----|
| **GitHub** (this repo) | https://github.com/rajpunkeshwarrajgautam-boop/digital-swarmecommerce |
| **Vercel** (linked project) | https://vercel.com/rajpunkeshwarrajgautam-boops-projects/antigravity-ecommerce |
| **Supabase** (project home) | https://supabase.com/dashboard/project/uhswcljouelyprsinchj |
| **Supabase SQL Editor** (new query) | https://supabase.com/dashboard/project/uhswcljouelyprsinchj/sql/new |
| **Production site** | https://digitalswarm.in |
| **Google Analytics (GA4)** | https://analytics.google.com/ |
| **Google Tag Manager** | https://tagmanager.google.com/ |

After you sign in to Google, open your **GA4 property** from the Analytics home picker (property URL is account-specific; it is not stored in this repo). Use **Admin → Data display → Custom definitions** for the hero A/B dimensions described in the playbook.

**Cursor IDE browser:** If you see the **new property wizard** instead of Admin, finish **business objectives** → **web stream** → paste **`G-…`** into **Vercel** `NEXT_PUBLIC_GA_MEASUREMENT_ID` (see [`.planning/STATE.md`](STATE.md) for the exact account/property names used in-session). GTM is optional unless you add a `GTM-XXXX` container.

---

## SQL Editor (Supabase)

Use this when applying migrations or ad hoc checks:

1. Open **Supabase SQL Editor (new query):** https://supabase.com/dashboard/project/uhswcljouelyprsinchj/sql/new  
2. Paste SQL from the repo path shown in **`webhook_logs`** below, then **Run**.

**Status:** `public.webhook_logs` has been applied and verified in this project (idempotent re-run is safe).

---

## `webhook_logs` migration (once per Supabase project)

1. Open the **SQL Editor** link in the table above.  
2. Paste the contents of **`supabase/migrations/20260417120000_webhook_logs.sql`** from this repo.  
3. **Run** if the `webhook_logs` table is not already present (already done for **digital-swarm** / project `uhswcljouelyprsinchj`).

---

## Analytics (hero A/B)

- **GA4 Admin, custom dimensions, explorations, funnel, DebugView, optional GTM:** [`.planning/analytics/GA4-hero-ab-playbook.md`](analytics/GA4-hero-ab-playbook.md)
