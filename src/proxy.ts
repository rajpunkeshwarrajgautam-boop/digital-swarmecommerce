import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/profile(.*)",
  "/affiliate(.*)",
  "/checkout/success(.*)",
  "/admin(.*)",
]);

const SAFE_ATTRIBUTION = /^[a-zA-Z0-9._~:@/+\- ]{1,120}$/;

function cleanAttribution(value: string | null): string | null {
  if (!value) return null;
  const normalized = value.trim().slice(0, 120);
  return SAFE_ATTRIBUTION.test(normalized) ? normalized : null;
}

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) await auth.protect();

  const response = NextResponse.next();
  const isHttps = req.nextUrl.protocol === "https:";
  const cookieBase = {
    path: "/",
    sameSite: "lax" as const,
    secure: isHttps,
  };

  const countryHeader = req.headers.get("x-vercel-ip-country");
  const country = /^[A-Z]{2}$/.test(countryHeader || "") ? countryHeader! : "IN";
  if (!req.cookies.has("market_hint")) {
    response.cookies.set("market_hint", country, {
      ...cookieBase,
      maxAge: 60 * 60 * 24 * 7,
    });
  }

  const ref = cleanAttribution(req.nextUrl.searchParams.get("ref"));
  if (ref) {
    response.cookies.set("affiliate_id", ref, {
      ...cookieBase,
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30,
    });
    response.cookies.set("intent_ref", ref, {
      ...cookieBase,
      maxAge: 60 * 60 * 24,
    });
  }

  const attributionKeys = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
    "utm_term",
  ] as const;

  let hasValidAttribution = false;
  for (const key of attributionKeys) {
    const value = cleanAttribution(req.nextUrl.searchParams.get(key));
    if (value) {
      hasValidAttribution = true;
      response.cookies.set(key, value, {
        ...cookieBase,
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 30,
      });
    }
  }

  if (hasValidAttribution && !req.cookies.has("landing_path")) {
    const path = req.nextUrl.pathname.slice(0, 256);
    response.cookies.set("landing_path", path, {
      ...cookieBase,
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30,
    });
  }

  return response;
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
