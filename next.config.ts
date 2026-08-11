import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";
const isVercelProduction = process.env.VERCEL_ENV === "production";

const scriptSrc = [
  "script-src 'self'",
  "'unsafe-inline'",
  ...(isDev ? (["'unsafe-eval'"] as const) : []),
  "https://www.googletagmanager.com",
  "https://clerk.digitalswarm.in",
  "https://*.clerk.accounts.dev",
  "https://*.cashfree.com",
  "https://sdk.cashfree.com",
  "https://*.stripe.com",
  "https://challenges.cloudflare.com",
  "https://unpkg.com",
  "https://cdnjs.cloudflare.com",
  "https://connect.facebook.net",
].join(" ");

const contentSecurityPolicy = [
  "default-src 'self'",
  scriptSrc,
  "connect-src 'self' data: https://*.supabase.co https://*.clerk.accounts.dev https://clerk.digitalswarm.in https://*.cashfree.com https://api.cashfree.com https://sandbox.cashfree.com https://*.stripe.com https://ipapi.co https://*.lottiefiles.com https://www.facebook.com https://www.google-analytics.com https://region1.google-analytics.com https://stats.g.doubleclick.net https://www.google.com https://www.googletagmanager.com https://analytics.google.com",
  "img-src 'self' data: blob: https:",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "frame-src 'self' https://*.cashfree.com https://sdk.cashfree.com https://*.stripe.com https://checkout.razorpay.com https://challenges.cloudflare.com https://www.facebook.com",
  "media-src 'self' data:",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self' https://*.cashfree.com https://*.stripe.com",
  "frame-ancestors 'none'",
  ...(isVercelProduction ? ["upgrade-insecure-requests"] : []),
].join("; ");

const baseSecurityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-XSS-Protection", value: "0" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(self)" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "*.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "*.cloudinary.com" },
      { protocol: "https", hostname: "*.amazonaws.com" },
      { protocol: "https", hostname: "*.cloudfront.net" },
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "i.pravatar.cc" },
      { protocol: "https", hostname: "pravatar.cc" },
    ],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 86400,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          ...baseSecurityHeaders,
          ...(isVercelProduction
            ? [{ key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" }]
            : []),
        ],
      },
      {
        source: "/api/:path*",
        headers: [
          { key: "Cache-Control", value: "no-store, max-age=0" },
        ],
      },
    ];
  },
};

export default nextConfig;
