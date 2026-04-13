# Final State Checklist

This project is considered release-ready when all items below are green.

## Platform and Data
- [x] Supabase storage migration completed on digital-swarm project (`uhswcljouelyprsinchj`).
- [x] Product download URLs synced for all active catalog rows.
- [x] Storage safety guardrails added to prevent legacy-host sync mistakes.

## SEO and Discoverability
- [x] Canonical URLs set for key routes (`/`, `/products`, `/contact`, `/faq`, PDPs).
- [x] Structured data added (Organization, WebSite, Product, FAQPage, ItemList).
- [x] Robots and sitemap endpoints verified live.

## Conversion and Trust
- [x] PDP trust/policy links visible near conversion CTAs.
- [x] Product listing includes comparison module for faster buyer decisions.
- [x] Newsletter lifecycle capture is wired and tracked.

## Analytics Funnel
- [x] `view_item` tracked on PDP load.
- [x] `add_to_cart` tracked from PDP + catalog cards.
- [x] `begin_checkout` tracked on payment initiation.
- [x] `purchase` tracked on success verification.

## Quality Gates and Tests
- [x] Production smoke tests pass against `https://digitalswarm.in`.
- [x] Commerce quality tests added for canonical + schema guardrails.
- [x] CI workflow added for build + Chromium/WebKit E2E + Lighthouse CI.

## Operational Notes
- CI requires these repository secrets: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `NEXT_PUBLIC_FB_PIXEL_ID`.
- Local `npm run lint` currently includes pre-existing repo issues outside this release scope; targeted files in this sprint are lint-clean.
