# One-click dashboards (Digital Swarm)

**Local:** from repo root run `npm run open:dashboards` — opens these URLs in **Playwright Chromium** (five tabs). This is not Cursor’s Simple Browser; it uses the Playwright-installed browser.

Use these when operating the stack (replace nothing unless your fork uses different orgs).

| Surface | URL |
|---------|-----|
| **GitHub** (this repo) | https://github.com/rajpunkeshwarrajgautam-boop/digital-swarmecommerce |
| **Vercel** (linked project) | https://vercel.com/rajpunkeshwarrajgautam-boops-projects/antigravity-ecommerce |
| **Supabase** (project `uhswcljouelyprsinchj`) | https://supabase.com/dashboard/project/uhswcljouelyprsinchj |
| **Production site** | https://digitalswarm.in |
| **GA4** (pick your property) | https://analytics.google.com/ |
| **GTM** (if you use a web container) | https://tagmanager.google.com/ |

**SQL Editor (webhook_logs migration):** Supabase dashboard → **SQL Editor** → paste `supabase/migrations/20260417120000_webhook_logs.sql` → **Run** (once per project if the table is missing).
