"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "next-themes";
import { CurrencyProvider } from "./CurrencyProvider";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
        <CurrencyProvider>
          {children}
        </CurrencyProvider>
      </ThemeProvider>
    </ClerkProvider>
  );
}
