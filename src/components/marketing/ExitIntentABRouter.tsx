"use client";

import { useState, useEffect } from "react";
import { ExitIntentModal } from "./ExitIntentModal";
import { ExitIntentModalB } from "./ExitIntentModalB";
import { getABVariant, trackABImpression, type ABVariant } from "@/lib/abTest";

/**
 * Routes exit intent to variant A or B from localStorage.
 * Variant is applied in useEffect so SSR and the first client frame match (no hydration mismatch).
 */
export function ExitIntentABRouter() {
  const [variant, setVariant] = useState<ABVariant | null>(null);

  useEffect(() => {
    const v = getABVariant("exit_intent_modal");
    setVariant(v);
    trackABImpression("exit_intent_modal", v);
  }, []);

  if (!variant) return null;
  return variant === "B" ? <ExitIntentModalB /> : <ExitIntentModal />;
}
