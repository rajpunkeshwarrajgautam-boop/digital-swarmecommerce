"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "next-themes";
import { CurrencyProvider } from "./CurrencyProvider";

import { SwarmHueSync } from "./SwarmHueSync";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider signInFallbackRedirectUrl="/" signUpFallbackRedirectUrl="/">
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        <SwarmHueSync />
        <CurrencyProvider>
          {children}
        </CurrencyProvider>
      </ThemeProvider>
    </ClerkProvider>
  );
}
