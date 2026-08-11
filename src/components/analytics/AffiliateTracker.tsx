"use client";

import { useEffect, useRef } from "react";

/**
 * Tracks a referral visit once per browser session. The attribution cookie used
 * for checkout is HttpOnly; this component reads the visible `ref` query value
 * (or the short-lived intent_ref mirror) only to report the click counter.
 */
export function AffiliateTracker() {
  const hasFired = useRef(false);

  useEffect(() => {
    if (hasFired.current || sessionStorage.getItem("af_click_tracked")) return;

    const queryRef = new URLSearchParams(window.location.search).get("ref")?.trim();
    const intentRef = document.cookie
      .split("; ")
      .find((row) => row.startsWith("intent_ref="))
      ?.slice("intent_ref=".length);
    const refCode = queryRef || (intentRef ? decodeURIComponent(intentRef) : "");
    if (!refCode) return;

    hasFired.current = true;
    sessionStorage.setItem("af_click_tracked", "1");

    fetch("/api/affiliate/click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refCode }),
      keepalive: true,
    }).catch(() => {
      // Referral attribution still lives in the HttpOnly cookie even if metrics fail.
    });
  }, []);

  return null;
}
