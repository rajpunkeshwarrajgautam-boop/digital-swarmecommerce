type EventParams = Record<string, unknown>;

function pushDataLayer(event: string, params: EventParams = {}) {
  if (typeof window === "undefined") return;
  const w = window as Window & { dataLayer?: Array<Record<string, unknown>> };
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ event, ...params });
}

export function trackEcommerceEvent(event: string, params: EventParams = {}) {
  if (typeof window === "undefined") return;
  pushDataLayer(event, params);
  const w = window as Window & { gtag?: (...args: unknown[]) => void };
  if (typeof w.gtag === "function") {
    w.gtag("event", event, params);
  }
}

export function trackViewItem(item: { id: string; name: string; price: number; category?: string }) {
  trackEcommerceEvent("view_item", {
    currency: "INR",
    value: item.price,
    items: [{ item_id: item.id, item_name: item.name, price: item.price, item_category: item.category }],
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
