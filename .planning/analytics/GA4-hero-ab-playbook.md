# GA4 / GTM: Homepage hero A/B (`homepage_hero`)

The app sends events via **`gtag`** and **`dataLayer`** from `src/lib/web-analytics.ts`. **`AdTracking.tsx`** loads `https://www.googletagmanager.com/gtag/js?id=<NEXT_PUBLIC_GA_MEASUREMENT_ID>` (Global Site Tag for GA4). There is **no GTM web container ID** in the repo; use **GA4 Admin** first. Add **GTM** only if you later install a `GTM-XXXX` snippet (optional section below).

**Related:** [Operator URLs](../DASHBOARDS.md) · [Project STATE](../STATE.md)

---

## Events (already in code)

| Event name | When | Key parameters |
|------------|------|----------------|
| `homepage_hero_impression` | After hero variant is assigned (`useLayoutEffect` in `ForgeHero`) | `ab_test`, `ab_variant`, plus `experiments`, attribution from `trackEcommerceEvent` |
| `homepage_hero_cta_click` | Primary or secondary hero CTA | `ab_test`, `ab_variant`, `cta_kind` (`primary_catalog` \| `secondary_concierge`), `cta_label` |

Source: `trackHomepageHeroImpression`, `trackHomepageHeroCta` in `src/lib/web-analytics.ts`.

---

## GA4: Event-scoped custom dimensions (required for A/B & funnel breakdowns)

Register these so **Explorations** and **Funnels** can break down by variant and CTA type. Use **Admin** (gear) → **Data display** → **Custom definitions** → **Create custom dimension** → scope **Event**.

| Dimension name (suggested) | Scope | Event parameter |
|----------------------------|-------|-----------------|
| AB variant | Event | `ab_variant` |
| AB test key | Event | `ab_test` |
| Hero CTA kind | Event | `cta_kind` |
| Hero CTA label | Event | `cta_label` |

1. Create one row per line in the table (parameter names must match **exactly**).  
2. **Save.** Data is **not retroactive** for new definitions—allow time after publishing.

**Optional:** If you need `experiments` in reports, GA4 works best with **scalar** event parameters; today `experiments` may be sent as an object. Prefer breakdowns on `ab_variant` / `ab_test` above for the hero test.

---

## Exploration: A vs B (hero engagement)

1. **Explore** → **Blank** or **Free form**.  
2. **Dimensions:** **Event name**, plus the custom dimensions (**AB variant**, **Hero CTA kind**, **AB test key**, etc.).  
3. **Metrics:** **Event count**; add **Active users** or **Total users** if useful.  
4. **Filter** (dimension or segment): **Event name** equals `homepage_hero_impression` **OR** `homepage_hero_cta_click`.  
5. **Breakdown** (or secondary dimension): **AB variant** — compare **A** vs **B** after sufficient traffic.

---

## Exploration: Funnel (impression → primary catalog CTA)

Goal: users who saw the hero vs those who clicked **Shop/Browse** (`cta_kind` = `primary_catalog`), split by **AB variant**.

1. **Explore** → **Funnel exploration**.  
2. **Step 1:** Event name **exactly matches** `homepage_hero_impression`.  
3. **Step 2:** Event name **exactly matches** `homepage_hero_cta_click` **and** event parameter **`cta_kind`** **equals** `primary_catalog`.  
   - If the UI asks for a registered field, use the **Hero CTA kind** custom dimension once it has collected data.  
4. **Breakdown dimension:** **AB variant** (event-scoped custom dimension).  
5. Adjust **date range**, **comparison**, and **segments** (e.g. mobile vs desktop) as needed.

---

## DebugView (verify events live)

1. **Admin** → **DebugView** (enable debug device: GA Debugger extension, or `debug_mode` in dev if you add it later).  
2. Open **https://digitalswarm.in/** in that browser session.  
3. Confirm **`homepage_hero_impression`** with **`ab_variant`** `A` or `B`; click hero CTAs and confirm **`homepage_hero_cta_click`** with **`cta_kind`**.

---

## GTM (optional — if you add a web container later)

1. Install the **GTM container snippet** (`GTM-XXXX`) per Google’s **Web** install instructions (`<head>` + `<noscript>`).  
2. **Avoid double counting GA4:** either keep **only** `gtag` in the app for GA4, **or** move GA4 fully into GTM (**GA4 Configuration** + **GA4 Event** tags) and remove duplicate `gtag('config')` from `AdTracking.tsx`.  
3. **Data Layer variables** (type *Data Layer Variable*, Version 2): `ab_variant`, `ab_test`, `cta_kind`, `cta_label` (and optionally `experiments` if you stringify it).  
4. **Triggers** → **Custom Event**, Event name `homepage_hero_impression` (duplicate trigger for `homepage_hero_cta_click`).  
5. **Tags** → **Google Analytics: GA4 Event** — Event name matches the custom event; map **Event Parameters** from the variables above.

---

## Vercel / production check

- **Vercel** → Project → **Settings** → **Environment Variables** → Production must include **`NEXT_PUBLIC_GA_MEASUREMENT_ID`** (e.g. `G-XXXXXXXX`).  
- Without it, `AdTracking` does not load `gtag` and **no hero events** reach GA4.
