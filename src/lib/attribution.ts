type AttributionContext = {
  affiliate_id?: string;
  intent_ref?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  landing_path?: string;
};

function readCookie(name: string) {
  if (typeof window === "undefined") return undefined;
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`))
    ?.split("=")[1];
}

export function getAttributionContext(): AttributionContext {
  if (typeof window === "undefined") return {};

  const context: AttributionContext = {};
  const cookieNames: Array<keyof AttributionContext> = [
    "affiliate_id",
    "intent_ref",
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
    "utm_term",
    "landing_path",
  ];

  for (const key of cookieNames) {
    const value = readCookie(key);
    if (value) {
      context[key] = decodeURIComponent(value);
    }
  }

  return context;
}
