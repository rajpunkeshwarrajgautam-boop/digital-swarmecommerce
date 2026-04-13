import { Suspense } from 'react';
import { Inter, Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ClientProviders } from "@/components/providers/ClientProviders";
import { VisualQuality } from "@/components/layout/VisualQuality";
import { ForgeToast } from "@/components/ui/ForgeToast";
import { AIConcierge } from "@/components/forge/AIConcierge";
import Script from "next/script";
import { env } from "@/lib/env";
import { ForgeErrorBoundary } from "@/components/ui/ForgeErrorBoundary";
import { ExitIntentABRouter } from "@/components/marketing/ExitIntentABRouter";
import { FBPixelPageView } from "@/components/analytics/FBPixel";
import { AffiliateTracker } from "@/components/analytics/AffiliateTracker";
import { JsonLd } from "@/components/layout/JsonLd";
import { metadata as siteMetadata } from "./metadata";

const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-inter",
  display: 'swap',
});

const outfit = Outfit({ 
  subsets: ["latin"], 
  variable: "--font-outfit",
  display: 'swap',
});

const jetbrains = JetBrains_Mono({ 
  subsets: ["latin"], 
  variable: "--font-jetbrains",
  display: 'swap',
});

export const metadata = siteMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html 
      lang="en" 
      className={`${inter.variable} ${outfit.variable} ${jetbrains.variable} dark scroll-smooth`}
      data-theme="dark"
      suppressHydrationWarning
    >
      <body className="font-sans antialiased bg-[#0a0a0b] text-white selection:bg-primary selection:text-black">
        <ForgeErrorBoundary>
          <ClientProviders>
            {/* FB Pixel SPA route tracking — fires PageView on every navigation */}
            <Suspense fallback={null}>
              <FBPixelPageView />
            </Suspense>

            {/* Affiliate click tracker — fires once per session when ?ref= cookie is set */}
            <AffiliateTracker />

            <VisualQuality />
            <ForgeToast />
            <AIConcierge />
            <div className="relative min-h-screen flex flex-col">
              <Header />
              <main className="grow">
                {children}
              </main>
              <ExitIntentABRouter />
              <Footer />
            </div>
            <JsonLd />

            {/* FB Pixel base init script — loads once, sets up fbq() */}
            <Script
              id="fb-pixel"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  !function(f,b,e,v,n,t,s)
                  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                  n.queue=[];t=b.createElement(e);t.async=!0;
                  t.src=v;s=b.getElementsByTagName(e)[0];
                  s.parentNode.insertBefore(t,s)}(window, document,'script',
                  'https://connect.facebook.net/en_US/fbevents.js');
                  fbq('init', '${env.NEXT_PUBLIC_FB_PIXEL_ID || "1128362615591321"}');
                  fbq('track', 'PageView');
                `,
              }}
            />
          </ClientProviders>
        </ForgeErrorBoundary>
      </body>
    </html>
  );
}
