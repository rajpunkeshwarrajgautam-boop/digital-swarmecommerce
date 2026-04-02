"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "next-themes";
import { CurrencyProvider } from "./CurrencyProvider";
import { SwarmSWRProvider } from "@/lib/cache/SwarmSWR";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        <SwarmSWRProvider>
          <CurrencyProvider>
            {children}
          </CurrencyProvider>
        </SwarmSWRProvider>
      </ThemeProvider>
    </ClerkProvider>
  );
}
