/**
 * A/B Test utility for client-side variant assignment.
 * Persists variant in localStorage so the same user always sees the same variant.
 * Uses a 50/50 coin flip on first visit.
 */

export type ABVariant = "A" | "B";

/**
 * Returns the assigned variant for a given test key.
 * Creates + stores a variant if one doesn't exist yet.
 */
export function getABVariant(key: string): ABVariant {
  if (typeof globalThis.window === "undefined") return "A";

  const storageKey = `ab_${key}`;
  const existing = localStorage.getItem(storageKey) as ABVariant | null;

  if (existing === "A" || existing === "B") {
    return existing;
  }

  const assigned: ABVariant = Math.random() < 0.5 ? "A" : "B";
  localStorage.setItem(storageKey, assigned);
  return assigned;
}

/**
 * Tracks which variant a user was shown by writing to sessionStorage.
 * Useful for analytics correlation later.
 */
export function trackABImpression(testName: string, variant: ABVariant): void {
  if (typeof globalThis.window === "undefined") return;
  sessionStorage.setItem(`ab_impression_${testName}`, variant);
}
