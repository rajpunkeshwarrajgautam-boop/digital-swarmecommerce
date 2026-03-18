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
    default: "Digital Swarm | Scale to 7-Figures with Data-Driven Marketing & AI Agents",
    template: "%s | Digital_Swarm_v2"
  },
  description: "The absolute standard in algorithmic growth. Download production-ready AI agents, UI kits, and strategic source code. Optimized for Indian businesses scaling to 7-figures. Deploy in minutes, not weeks.",
  keywords: [
    "buy AI agents for developers", "React UI kits for sale", "source code bundles web dev", 
    "SaaS launch checklist template", "developer design system Figma", "pre-built legal AI agent for startups", 
    "customizable React dashboard UI kit", "full-stack web app source code MERN", "performance marketing India",
    "data-driven marketing agency", "buy digital products India", "AI sales automation"
  ],
  authors: [{ name: "Digital Swarm Engineering & Marketing Team" }],
  metadataBase: new URL('https://digitalswarm.in'),
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://digitalswarm.in',
    title: 'Digital Swarm | Scale to 7-Figures with AI & Strategic Code',
    description: 'Production-ready AI agents and UI kits trusted by elite growth pods. Instant sync — stop building, start scaling.',
    siteName: 'Digital Swarm',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Digital Swarm — Tactical Infrastructure for Rapid Growth' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Digital Swarm | Tactical AI Agents & UI Infrastructure',
    description: 'The absolute standard in algorithmic performance. Download production-ready source code and ship faster.',
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
