import { getTrackedABExperiments, type ABVariant } from "@/lib/abTest";
import { getAttributionContext } from "@/lib/attribution";

type EventParams = Record<string, unknown>;

function pushDataLayer(event: string, params: EventParams = {}) {
  if (typeof window === "undefined") return;
  const w = window as Window & { dataLayer?: Array<Record<string, unknown>> };
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ event, ...params });
}

export function trackEcommerceEvent(event: string, params: EventParams = {}) {
  if (typeof window === "undefined") return;
  const enrichedParams = {
    ...getAttributionContext(),
    experiments: getTrackedABExperiments(),
    ...params,
  };

  pushDataLayer(event, enrichedParams);
  const w = window as Window & { gtag?: (...args: unknown[]) => void };
  if (typeof w.gtag === "function") {
    w.gtag("event", event, enrichedParams);
  }
}

export function trackViewItem(item: { id: string; name: string; price: number; category?: string }) {
  trackEcommerceEvent("view_item", {
    currency: "INR",
    value: item.price,
    items: [{ item_id: item.id, item_name: item.name, price: item.price, item_category: item.category }],
  });
}

export function trackViewItemList(
  listName: string,
  items: Array<{ id: string; name: string; price: number; category?: string }>
) {
  trackEcommerceEvent("view_item_list", {
    item_list_name: listName,
    items: items.map((item, index) => ({
      item_id: item.id,
      item_name: item.name,
      price: item.price,
      item_category: item.category,
      index,
    })),
  });
}

export function trackSelectItem(
  listName: string,
  item: { id: string; name: string; price: number; category?: string }
) {
  trackEcommerceEvent("select_item", {
    item_list_name: listName,
    items: [
      {
        item_id: item.id,
        item_name: item.name,
        price: item.price,
        item_category: item.category,
      },
    ],
  });
}

export function trackAddToCart(item: { id: string; name: string; price: number; quantity?: number; category?: string }) {
  trackEcommerceEvent("add_to_cart", {
    currency: "INR",
    value: item.price * (item.quantity ?? 1),
    items: [
      {
        item_id: item.id,
        item_name: item.name,
        price: item.price,
        quantity: item.quantity ?? 1,
        item_category: item.category,
      },
    ],
  });
}

export function trackBeginCheckout(total: number, items: Array<{ id: string; name: string; price: number; quantity: number }>) {
  trackEcommerceEvent("begin_checkout", {
    currency: "INR",
    value: total,
    items: items.map((item) => ({
      item_id: item.id,
      item_name: item.name,
      price: item.price,
      quantity: item.quantity,
    })),
  });
}

export function trackPurchaseEvent(total: number, transactionId: string, items: Array<{ id: string; name: string; price: number; quantity: number }>) {
  trackEcommerceEvent("purchase", {
    currency: "INR",
    value: total,
    transaction_id: transactionId,
    items: items.map((item) => ({
      item_id: item.id,
      item_name: item.name,
      price: item.price,
      quantity: item.quantity,
    })),
  });
}

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
  kind: "primary_catalog" | "secondary_concierge" | "tertiary_freebies",
  ctaLabel: string
) {
  trackEcommerceEvent("homepage_hero_cta_click", {
    ab_test: abTestKey,
    ab_variant: variant,
    cta_kind: kind,
    cta_label: ctaLabel,
  });
}

/** Stable slug for GA4 custom dimension `contact_type` (register in Admin → Custom definitions). */
const CONTACT_OPERATION_SLUG: Record<string, string> = {
  "Enterprise Build": "enterprise_build",
  "Custom AI Integration": "custom_ai_integration",
  "Support Tier Query": "support_tier_query",
  "Partnership Protocol": "partnership_protocol",
};

/**
 * Fires after `/api/contact` succeeds. Use in Explore funnels with `contact_type` / `operation_type`.
 */
export function trackContactSubmit(operationTypeLabel: string) {
  const fromMap = CONTACT_OPERATION_SLUG[operationTypeLabel];
  const slug =
    fromMap ??
    operationTypeLabel.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
  const contact_type = slug.length > 0 ? slug : "unknown";
  trackEcommerceEvent("contact_submit", {
    contact_type,
    operation_type: operationTypeLabel,
  });
}
