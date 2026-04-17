# GA4 / GTM: Homepage hero A/B (`homepage_hero`)

Full playbook for **Google Analytics 4** reporting on the homepage hero experiment: **event-scoped custom dimensions**, an **A vs B** exploration, a **funnel** from impression to **primary catalog** CTA with **`ab_variant` breakdown**, **DebugView**, and an **optional Google Tag Manager** section if you introduce a web container later.

**Related:** [Operator URLs](../DASHBOARDS.md) · [Project STATE](../STATE.md)

---

## How the app sends data (read this first)

- **`src/lib/web-analytics.ts`** — `trackEcommerceEvent` pushes to **`dataLayer`** and calls **`gtag('event', …)`** with the same parameters. Hero helpers: `trackHomepageHeroImpression`, `trackHomepageHeroCta`.
- **`src/components/layout/AdTracking.tsx`** — loads `https://www.googletagmanager.com/gtag/js?id=<NEXT_PUBLIC_GA_MEASUREMENT_ID>` (gtag.js is hosted on the `googletagmanager.com` domain; this is the standard **Global Site Tag / gtag.js** path for GA4, not necessarily a GTM container).
- **There is no `GTM-XXXX` web container ID** in the repo. Configure dimensions and reports in **GA4 Admin** first. Add **GTM** only if you later install a container snippet and intentionally route events through tags (see optional section at the end).

**Production:** Vercel → Project → **Settings** → **Environment Variables** → Production must include **`NEXT_PUBLIC_GA_MEASUREMENT_ID`** (format `G-XXXXXXXX`). Without it, `AdTracking` does not load gtag and **hero events never reach GA4**.

---

## Events (contract)

| Event name | When | Parameters (for GA4 / GTM) |
|------------|------|----------------------------|
| `homepage_hero_impression` | Once per hero mount in production (`ForgeHero`) | `ab_test` (string), `ab_variant` (`A` \| `B`), plus `experiments` and attribution merged from `trackEcommerceEvent` |
| `homepage_hero_cta_click` | Primary or secondary hero CTA | `ab_test`, `ab_variant`, `cta_kind` (`primary_catalog` \| `secondary_concierge`), `cta_label` (human-readable label) |

**Funnel focus:** Step 2 in your funnel should filter **`cta_kind` = `primary_catalog`** so you measure users who chose the main catalog path (e.g. shop/browse), not concierge.

**Note on `experiments`:** It may be sent as a **non-scalar** structure. Prefer breakdowns on **`ab_variant`** and **`ab_test`** for the hero test; register those as custom dimensions below.

---

## GA4 checklist (Admin)

1. [ ] Property selected → **Admin** (gear).
2. [ ] **Data display** → **Custom definitions** → **Create custom dimension** (scope **Event**) for each parameter in the table below.
3. [ ] **Explore** → build **A vs B** free-form (or segment comparison).
4. [ ] **Explore** → **Funnel exploration** — impression → CTA click with `primary_catalog` + breakdown **AB variant**.
5. [ ] **Admin** → **DebugView** — verify events with parameters in real time (while testing).

Allow **24–48 hours** after first traffic for standard reports; **Explorations** can show newer custom-dimension data sooner once the dimension exists, but dimensions are **not retroactive** for periods before they were created.

---

## GA4: Event-scoped custom dimensions (required)

**Path:** Admin → **Data display** → **Custom definitions** → **Create custom dimension** → **Event** scope.

| Suggested dimension name | Scope | Event parameter (must match exactly) |
|--------------------------|-------|--------------------------------------|
| AB variant | Event | `ab_variant` |
| AB test key | Event | `ab_test` |
| Hero CTA kind | Event | `cta_kind` |
| Hero CTA label | Event | `cta_label` |

1. Create **one row per line**; parameter names are case-sensitive and must match what `gtag('event', …)` sends (see `trackHomepageHeroImpression` / `trackHomepageHeroCta` in `src/lib/web-analytics.ts`).
2. **Save** each definition. New dimensions apply to **new** hits going forward.

**Official reference:** [GA4 custom dimensions and metrics](https://support.google.com/analytics/answer/10075209) (Google Help).

---

## Exploration: A vs B (hero engagement)

**Goal:** Compare traffic that saw or engaged with the hero, split by **`ab_variant`**.

1. **Explore** → **Blank** (or **Free form**).
2. Add **Dimensions:** **Event name**, plus your custom dimensions **AB variant**, **AB test key**, **Hero CTA kind**, **Hero CTA label** (as needed).
3. Add **Metrics:** **Event count**; optionally **Active users** or **Total users**.
4. Add a **filter** (or use **Tab settings** → **Filters**): **Event name** **exactly matches** `homepage_hero_impression` **OR** **Event name** **exactly matches** `homepage_hero_cta_click`.
5. Use **Rows** or **Breakdown** with **AB variant** to compare **A** vs **B**.
6. Optionally duplicate the exploration with a **segment** or filter for **mobile vs desktop** (device category) if layout differs.

---

## Exploration: Funnel (impression → primary catalog CTA)

**Goal:** Of users who fired **`homepage_hero_impression`**, how many completed **`homepage_hero_cta_click`** with **`cta_kind` = `primary_catalog`**, split by **`ab_variant`**.

1. **Explore** → **Funnel exploration**.
2. **Step 1:** **Event name** **exactly matches** `homepage_hero_impression`.
3. **Step 2:** **Event name** **exactly matches** `homepage_hero_cta_click` **and** parameter **`cta_kind`** **equals** `primary_catalog`.
   - If the UI only lists registered fields for step conditions, use the **Hero CTA kind** custom dimension once it has collected data, equivalent to `cta_kind`.
4. **Breakdown dimension:** **AB variant** (your event-scoped custom dimension).
5. Set **open vs closed funnel** and **time window** per your analytics policy (closed funnel is stricter; open counts out-of-order completions within the window).
6. Adjust **date range** and add **comparisons** (e.g. week-over-week) when you have enough volume.

---

## DebugView (verify live)

**Path:** Admin → **DebugView**.

**Ways to send debug hits:**

- Install the **[Google Analytics Debugger](https://chromewebstore.google.com/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna)** Chrome extension and browse **https://digitalswarm.in/** with the extension enabled; your device appears under DebugView.
- Alternatively, developers can add **`debug_mode: true`** on select `gtag` calls or use **Tag Assistant** / **Measurement Protocol** for server-side tests (not required for this playbook).

**What to confirm:**

1. **`homepage_hero_impression`** with **`ab_variant`** `A` or `B` and **`ab_test`** matching your hero experiment key.
2. After clicking hero buttons: **`homepage_hero_cta_click`** with **`cta_kind`** `primary_catalog` or `secondary_concierge` and **`cta_label`** populated.

---

## GTM (optional — add a web container later)

Use this section **only** if you install a **`GTM-XXXX`** snippet (head + noscript) and want GTM to own or augment GA4.

1. **Install** the GTM **Web** container per [Google’s container install docs](https://support.google.com/tagmanager/answer/6103696).
2. **Avoid double counting GA4:** either  
   - keep **only** the app’s `gtag` path (`AdTracking` + `NEXT_PUBLIC_GA_MEASUREMENT_ID`), **or**  
   - move **GA4 Configuration** + **GA4 Event** tags fully into GTM and **remove** duplicate `gtag('config', …)` from `AdTracking.tsx` so one pipeline owns page view and event batching.
3. **Variables** (type **Data Layer Variable**, Version 2): `ab_variant`, `ab_test`, `cta_kind`, `cta_label` (match keys pushed in `pushDataLayer` from `web-analytics.ts`).
4. **Triggers** → **Custom Event**:  
   - one trigger for event name **`homepage_hero_impression`**  
   - one for **`homepage_hero_cta_click`**
5. **Tags** → **Google Analytics: GA4 Event** — set **Event Name** to the custom event name; map **Event Parameters** from the variables above. Fire on the matching trigger.
6. **Preview** mode in GTM, then confirm events in GA4 **DebugView**.

---

## Troubleshooting

| Symptom | Likely cause |
|---------|----------------|
| No hero events in GA4 | Missing or wrong **`NEXT_PUBLIC_GA_MEASUREMENT_ID`** in Vercel Production; or ad blockers on your test browser |
| Events exist but dimensions are “(not set)” | Custom dimensions not created, wrong scope (**User** instead of **Event**), or parameter name typo vs code |
| Funnel step 2 empty | No clicks with **`cta_kind`** = `primary_catalog`**; confirm labels in UI map to `trackHomepageHeroCta` |
| Duplicate events | Both **gtag** and **GTM GA4 Event** firing for the same action without removing one path |

---

## Code reference (hero tracking)

```112:132:src/lib/web-analytics.ts
/** Homepage hero A/B: fires once per mount (prod); map in GTM/GA4 as custom event. */
export function trackHomepageHeroImpression(abTestKey: string, variant: ABVariant) {
  trackEcommerceEvent("homepage_hero_impression", {
    ab_test: abTestKey,
    ab_variant: variant,
  });
}

/** Homepage hero primary/secondary CTA; includes variant for funnel analysis. */
export function trackHomepageHeroCta(
  abTestKey: string,
  variant: ABVariant,
  kind: "primary_catalog" | "secondary_concierge",
  ctaLabel: string
) {
  trackEcommerceEvent("homepage_hero_cta_click", {
    ab_test: abTestKey,
    ab_variant: variant,
    cta_kind: kind,
    cta_label: ctaLabel,
  });
}
```
