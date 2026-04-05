import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    turbo: {
      resolveAlias: {
        'tailwindcss': 'tailwindcss'
      }
    }
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: '*.unsplash.com' },
      { protocol: 'https', hostname: 'images.pexels.com' },
      { protocol: 'https', hostname: '*.cloudinary.com' },
      { protocol: 'https', hostname: '*.amazonaws.com' },
      { protocol: 'https', hostname: '*.cloudfront.net' },
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: 'i.pravatar.cc' },
      { protocol: 'https', hostname: 'pravatar.cc' },
    ],
    // Improve image optimization
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 86400, // 24 hours
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://clerk.digitalswarm.in https://*.clerk.accounts.dev https://*.cashfree.com https://sdk.cashfree.com https://*.stripe.com https://challenges.cloudflare.com https://unpkg.com https://cdnjs.cloudflare.com https://connect.facebook.net",
              "connect-src 'self' data: https://*.supabase.co https://*.clerk.accounts.dev https://clerk.digitalswarm.in https://*.cashfree.com https://api.cashfree.com https://sandbox.cashfree.com https://*.stripe.com https://ipapi.co https://*.lottiefiles.com https://www.facebook.com",
              "img-src 'self' data: blob: https: https://www.facebook.com https://i.pravatar.cc https://pravatar.cc",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "frame-src 'self' https://*.cashfree.com https://sdk.cashfree.com https://*.stripe.com https://checkout.razorpay.com https://challenges.cloudflare.com https://www.facebook.com",
              "media-src 'self' data:",
              "worker-src 'self' blob:",
            ].join('; '),
          }
        ],
      },
    ];
  },
};

export default nextConfig;
