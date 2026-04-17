'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

/**

 * Fires fbq('track', 'PageView') on every client-side route change.
 * The base fbq('init', ...) and initial PageView are handled in `app/layout.tsx`.
 * This component handles SPA navigation tracking.
 */
export function FBPixelPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
      window.fbq('track', 'PageView');
    }
  }, [pathname, searchParams]);

  return null;
}

/**
 * Fire a custom FB Pixel event from anywhere in the app.
 * Usage: trackFBEvent('Lead', { content_name: 'Omega Protocol PDF' });
 */
export function trackFBEvent(eventName: string, params?: Record<string, unknown>) {
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    window.fbq('track', eventName, params as object);
  }
}

/**
 * Fire a FB Pixel Lead event (exit intent capture, newsletter signup).
 */
export function trackLead(source: string) {
  trackFBEvent('Lead', { content_name: source });
}

/**
 * Fire a FB Pixel InitiateCheckout event.
 */
export function trackInitiateCheckout(value: number, currency = 'INR') {
  trackFBEvent('InitiateCheckout', { value, currency, num_items: 1 });
}

/**
 * Fire a FB Pixel Purchase event.
 */
export function trackPurchase(value: number, orderId: string, currency = 'INR') {
  trackFBEvent('Purchase', { value, currency, content_type: 'product', content_ids: [orderId] });
}

/**
 * Fire a FB Pixel ViewContent event for product pages.
 */
export function trackViewContent(productName: string, value: number, currency = 'INR') {
  trackFBEvent('ViewContent', { content_name: productName, content_type: 'product', value, currency });
}
