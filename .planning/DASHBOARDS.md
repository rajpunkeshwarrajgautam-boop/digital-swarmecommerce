# Operator dashboards (Digital Swarm)

Single reference for **GitHub**, **Vercel**, **Supabase** (project + **SQL Editor**), **live site**, **GA4**, **GTM**, and the **webhook_logs** migration hint.

| Surface | URL |
|---------|-----|
| **GitHub** (this repo) | https://github.com/rajpunkeshwarrajgautam-boop/digital-swarmecommerce |
| **Vercel** (linked project) | https://vercel.com/rajpunkeshwarrajgautam-boops-projects/antigravity-ecommerce |
| **Supabase** (project home) | https://supabase.com/dashboard/project/uhswcljouelyprsinchj |
| **Supabase SQL Editor** (new query) | https://supabase.com/dashboard/project/uhswcljouelyprsinchj/sql/new |
| **Production site** | https://digitalswarm.in |
| **Google Analytics (GA4)** | https://analytics.google.com/ |
| **Google Tag Manager** | https://tagmanager.google.com/ |

## `webhook_logs` migration (once per Supabase project)

1. Open **Supabase SQL Editor**: https://supabase.com/dashboard/project/uhswcljouelyprsinchj/sql/new  
2. Paste the contents of **`supabase/migrations/20260417120000_webhook_logs.sql`** from this repo.  
3. **Run** if the `webhook_logs` table is not already present.

## Analytics playbook (hero A/B)

- **GA4 / GTM setup, dimensions, explorations, DebugView:** [`.planning/analytics/GA4-hero-ab-playbook.md`](analytics/GA4-hero-ab-playbook.md)  
- **Project state & four-step table:** [`.planning/STATE.md`](STATE.md)
