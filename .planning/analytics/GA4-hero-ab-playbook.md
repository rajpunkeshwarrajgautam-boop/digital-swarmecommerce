# GA4 / GTM: Homepage hero A/B (`homepage_hero`)

The app sends events via **`gtag`** and **`dataLayer`** from `src/lib/web-analytics.ts` (`AdTracking.tsx` loads `gtag/js?id=<GA4_MEASUREMENT_ID>`). There is **no GTM container ID** in the repo today; use **GA4 Admin** steps first. Add **GTM** only if you introduce a `GTM-XXXX` snippet.

## Events (already in code)

| Event name | When | Key parameters |
|------------|------|------------------|
| `homepage_hero_impression` | After hero variant is assigned | `ab_test`, `ab_variant`, plus `experiments`, attribution |
| `homepage_hero_cta_click` | Primary or secondary hero CTA | `ab_test`, `ab_variant`, `cta_kind` (`primary_catalog` \| `secondary_concierge`), `cta_label` |

## GA4 (required for breakdowns)

1. Open **Admin** (gear) → **Data display** → **Custom definitions** → **Create custom dimension**.
2. Create **event-scoped** dimensions (one row each):

| Dimension name | Scope | Event parameter |
|----------------|-------|-----------------|
| AB variant | Event | `ab_variant` |
| AB test key | Event | `ab_test` |
| Hero CTA kind | Event | `cta_kind` |
| Hero CTA label | Event | `cta_label` |

3. **Save.** New definitions apply **from creation forward** (not retroactive).

### Exploration: A vs B (hero)

1. **Explore** → **Blank** (or **Free form**).
2. **Dimensions**: add **Event name**, your custom dimensions (**AB variant**, **Hero CTA kind**, etc.).
3. **Metrics**: **Event count**; add **Total users** if useful.
4. **Rows**: `Event name` → filter **exactly matches** `homepage_hero_impression` OR `homepage_hero_cta_click`.
5. **Breakdown**: **AB variant** (A vs B). Compare counts after a few days of traffic.

### Exploration: Funnel (impression → primary CTA)

1. **Explore** → **Funnel exploration**.
2. **Steps** (each step: filter by **Event name**):
   - Step 1: `homepage_hero_impression`
   - Step 2: `homepage_hero_cta_click` where parameter `cta_kind` = `primary_catalog`
3. **Breakdown dimension**: **AB variant** (custom definition above).
4. Set **time window** and **audience** as needed.

### DebugView (verify live)

1. **Admin** → **DebugView** (or install GA Debugger extension).
2. Load `https://digitalswarm.in/`; confirm `homepage_hero_impression` with `ab_variant` A/B.

---

## GTM (optional — if you add a container later)

1. Add the **GTM container snippet** high in `<head>` and the **noscript** body tag per Google’s install doc.
2. **Order**: GTM snippet **before** or **after** `gtag` depending on whether you want GTM to own GA4; simplest is **keep current gtag** and use GTM only for **non-GA** tags, **or** migrate GA to a **GA4 Configuration** tag inside GTM (then remove duplicate hardcoded `gtag('config')` to avoid double hits).
3. **Variables** (Data Layer Version 2): `ab_variant`, `ab_test`, `cta_kind`, `cta_label`, `experiments`.
4. **Triggers** → **Custom Event**: event name `homepage_hero_impression` (and another for `homepage_hero_cta_click`).
5. **Tags** → **GA4 Event** (or **Google Analytics: GA4 Event**): send the same event name; map Event Parameters from the Data Layer variables.

---

## Vercel env check

Production must define **`NEXT_PUBLIC_GA_MEASUREMENT_ID`** (GA4 property ID, e.g. `G-XXXXXXXX`) so `AdTracking` loads `gtag`. Without it, no GA hits fire.
