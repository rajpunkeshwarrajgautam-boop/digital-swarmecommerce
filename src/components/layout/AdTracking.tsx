"use client";

import Script from "next/script";
import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function AdTracking() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Handle Google Analytics Page Views
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      if (typeof window.gtag !== 'undefined') {
        window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID!, {
          page_path: url,
        });
      }
    };
    handleRouteChange(`${pathname}${searchParams.toString() ? '?' + searchParams.toString() : ''}`);
  }, [pathname, searchParams]);

  const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <>
      {/* Google Analytics — base init; route changes handled in useEffect above */}
      {GA_ID && (
        <>
          <Script
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          />
          <Script
            id="gtag-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}', {
                  page_path: window.location.pathname,
                });
              `,
            }}
          />
        </>
      )}
    </>
  );
}

// Add these types to global
declare global {
  interface Window {
    gtag: (command: string, id: string, config?: object) => void;
    fbq: (command: string, event: string, params?: object) => void;
  }
}
