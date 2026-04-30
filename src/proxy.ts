import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Protect all routes under /dashboard or /profile or /affiliate
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)', 
  '/profile(.*)', 
  '/affiliate(.*)',
  '/checkout/success(.*)'
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) await auth.protect();

  const response = NextResponse.next();
  const isHttps = req.nextUrl.protocol === "https:";
  const cookieBase = {
    path: "/",
    sameSite: "lax" as const,
    secure: isHttps,
  };

  // 1. Edge Geolocation (Market Detection)
  const country = req.headers.get('x-vercel-ip-country') || 'IN';
  if (!req.cookies.has('market_hint')) {
    response.cookies.set('market_hint', country, {
      ...cookieBase,
      maxAge: 60 * 60 * 24 * 7,
    });
  }

  // 2. Referral & Intent Personalization
  const ref = req.nextUrl.searchParams.get('ref');
  if (ref) {
    // 30-day tracking cookie
    response.cookies.set('affiliate_id', ref, {
      ...cookieBase,
      maxAge: 60 * 60 * 24 * 30,
    });
    response.cookies.set('intent_ref', ref, {
      ...cookieBase,
      maxAge: 60 * 60 * 24 * 1,
    }); // 24h immediate personalized welcome
  }

  // 3. Marketing attribution persistence
  const attributionKeys = [
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_content',
    'utm_term',
  ] as const;

  for (const key of attributionKeys) {
    const value = req.nextUrl.searchParams.get(key);
    if (value) {
      response.cookies.set(key, value, {
        ...cookieBase,
        maxAge: 60 * 60 * 24 * 30,
      });
    }
  }

  if (
    attributionKeys.some((key) => req.nextUrl.searchParams.has(key)) &&
    !req.cookies.has('landing_path')
  ) {
    response.cookies.set('landing_path', req.nextUrl.pathname, {
      ...cookieBase,
      maxAge: 60 * 60 * 24 * 30,
    });
  }

  return response;
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
