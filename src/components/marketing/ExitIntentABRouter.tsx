"use client";

import { useState, useEffect } from "react";
import { ExitIntentModal } from "./ExitIntentModal";
import { ExitIntentModalB } from "./ExitIntentModalB";
import { getABVariant, trackABImpression, type ABVariant } from "@/lib/abTest";

/**
 * Routes the exit intent modal to Variant A or B based on the user's
 * persisted A/B assignment. Uses a lazy useState initializer so variant
 * is read from localStorage only on the client, avoiding hydration mismatch
 * and the setState-in-effect anti-pattern.
 */
export function ExitIntentABRouter() {
  const [variant] = useState<ABVariant | null>(() => {
    if (typeof globalThis.window === "undefined") return null;
    return getABVariant("exit_intent_modal");
  });

  useEffect(() => {
    if (variant) {
      trackABImpression("exit_intent_modal", variant);
    }
  }, [variant]);

  if (!variant) return null;
  return variant === "B" ? <ExitIntentModalB /> : <ExitIntentModal />;
}
