"use client";

import { useEffect, useRef } from "react";

/**
 * AffiliateTracker — fires once per session when an affiliate cookie is present.
 * Reads the `affiliate_id` cookie set by middleware (from ?ref= param) and calls
 * /api/affiliate/click to increment the affiliate's click counter in Supabase.
 * Deduplicates via sessionStorage so it only fires once per browser session.
 */
export function AffiliateTracker() {
  const hasFired = useRef(false);

  useEffect(() => {
    if (hasFired.current) return;
    if (sessionStorage.getItem("af_click_tracked")) return;

    // Read affiliate_id cookie set by middleware
    const afCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("affiliate_id="))
      ?.split("=")[1];

    if (!afCookie) return;

    hasFired.current = true;
    sessionStorage.setItem("af_click_tracked", "1");

    // Non-blocking fire-and-forget click tracking
    fetch("/api/affiliate/click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refCode: afCookie }),
      keepalive: true,
    }).catch(() => {
      // Silently fail — tracking is non-critical
    });
  }, []);

  return null;
}
