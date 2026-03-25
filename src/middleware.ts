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

  const ref = req.nextUrl.searchParams.get('ref');
  if (ref) {
    const response = NextResponse.next();
    // 30-day tracking cookie
    response.cookies.set('affiliate_id', ref, { path: '/', maxAge: 60 * 60 * 24 * 30 });
    return response;
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
