import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { AdTracking } from "@/components/layout/AdTracking";
import { Suspense } from "react";

import { Footer } from "@/components/layout/Footer";
import { PageTransition } from "@/components/layout/PageTransition";
import { HiveMindChat } from "@/components/chat/HiveMindChat";
import { ExitIntentPopup } from "@/components/home/ExitIntentPopup";
import { LiveSalesNotification } from "@/components/home/LiveSalesNotification";
import { PromoBanner } from "@/components/layout/PromoBanner";
import { GeoPricing } from "@/components/layout/GeoPricing";
import { JsonLd } from "@/components/layout/JsonLd";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Digital Swarm | Source Code, UI Kits & Digital Templates for Developers",
    template: "%s | Digital Swarm"
  },
  description: "Buy production-ready source code, UI kits, and digital templates. Used by 2,000+ indie developers. Instant download, setup guide included. Start building faster today.",
  keywords: ["source code", "UI kits", "digital templates", "Next.js starter", "React components", "developer tools", "AI agent boilerplate", "web development", "instant download", "digital products India"],
  authors: [{ name: "Digital Swarm Team" }],
  metadataBase: new URL('https://digitalswarm.in'),
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://digitalswarm.in',
    title: 'Digital Swarm | Source Code, UI Kits & Templates — Download & Ship Faster',
    description: 'Production-ready source code, UI kits, and digital templates trusted by 2,000+ developers. Instant download, 30-day guarantee.',
    siteName: 'Digital Swarm',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Digital Swarm — Premium Digital Products for Developers' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Digital Swarm | Source Code, UI Kits & Templates',
    description: 'Production-ready source code, UI kits, and digital templates trusted by 2,000+ developers. Instant download — start shipping faster.',
    images: ['/opengraph-image'],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
  verification: {
    google: 'ZAF9N1DVHDNUydBH8uni8jRo6si3uXjHg1c-6r-gLhs',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#CCFF00',
};

import { ClerkProvider } from "@clerk/nextjs";
import { VisualQuality } from "@/components/layout/VisualQuality";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        variables: { colorPrimary: '#CCFF00', colorBackground: '#050505', colorText: '#ffffff' },
      }}
    >
      <html lang="en" className="dark">
        <body
          className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} ${inter.variable} antialiased bg-background text-foreground overflow-x-hidden selection:bg-primary selection:text-black`}
        >
          <VisualQuality />
          <Suspense fallback={null}>
            <AdTracking />
          </Suspense>
          <GeoPricing />
          <PromoBanner />
          <Header />
          <main className="flex-1 w-full pt-16">
            <PageTransition>{children}</PageTransition>
          </main>
          <HiveMindChat />
          <Footer />
          <ExitIntentPopup />
          <LiveSalesNotification />
          <JsonLd />
          <Script 
            src="https://cdnjs.cloudflare.com/ajax/libs/lottie-player/2.0.4/lottie-player.min.js" 
            strategy="afterInteractive"
          />
        </body>
      </html>
    </ClerkProvider>
  );
}
