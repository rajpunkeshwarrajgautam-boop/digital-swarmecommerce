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
import { CustomCursor } from "@/components/ui/CustomCursor";
import { SmoothScroll } from "@/components/ui/SmoothScroll";
import { MainWrapper } from "@/components/layout/MainWrapper";

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
        variables: { 
          colorPrimary: '#CCFF00', 
          colorBackground: '#050505', 
          colorText: '#ffffff',
          colorInputBackground: '#111111',
          colorInputText: '#ffffff',
        },
        elements: {
          formButtonPrimary: "bg-[#CCFF00] text-black hover:bg-white transition-all border-4 border-black shadow-[4px_4px_0_#000]",
          card: "bg-black border-4 border-[#CCFF00] shadow-[10px_10px_0_#CCFF00]",
          headerTitle: "text-white font-black italic uppercase tracking-tighter",
          headerSubtitle: "text-white/60 font-bold uppercase text-[10px]",
          socialButtonsBlockButton: "bg-white text-black border-4 border-black font-black uppercase tracking-tighter shadow-[4px_4px_0_#CCFF00] hover:bg-[#CCFF00]",
          socialButtonsBlockButtonText: "text-black font-black",
          socialButtonsBlockButtonArrow: "text-black",
          formFieldLabel: "text-white font-black uppercase text-[10px] tracking-widest",
          formFieldInput: "bg-black border-2 border-[#CCFF00] text-[#CCFF00] focus:ring-0 rounded-none h-12 font-black",
          footerActionLink: "text-[#CCFF00] font-black hover:text-white underline decoration-2",
          identityPreviewText: "text-white",
          identityPreviewEditButtonIcon: "text-[#CCFF00]",
          dividerLine: "bg-white/20",
          dividerText: "text-white font-black uppercase text-[10px] bg-black px-2"
        }
      }}
    >
      <html lang="en" className="dark">
        <body
          className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} ${inter.variable} antialiased bg-background text-foreground overflow-x-hidden selection:bg-primary selection:text-black`}
        >
          <CustomCursor />
          <SmoothScroll>
            <VisualQuality />
            <Suspense fallback={null}>
              <AdTracking />
            </Suspense>
            <GeoPricing />
            <PromoBanner />
            <Header />
            <MainWrapper>
              <PageTransition>{children}</PageTransition>
            </MainWrapper>
            <HiveMindChat />
            <Footer />
            <ExitIntentPopup />
            <LiveSalesNotification />
            <JsonLd />
          </SmoothScroll>
          <Script 
            src="https://cdnjs.cloudflare.com/ajax/libs/lottie-player/2.0.4/lottie-player.min.js" 
            strategy="afterInteractive"
          />
        </body>
      </html>
    </ClerkProvider>
  );
}
