"use client";

import React, { createContext, useContext } from "react";

type Currency = "INR";

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  isLoading: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

/**
 * Cashfree orders are created and charged in INR. Until the storefront has a
 * live FX source and multi-currency settlement, customer-facing prices stay in
 * the same authoritative currency instead of presenting fixed-rate estimates
 * as if they were checkout amounts.
 */
export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  return (
    <CurrencyContext.Provider value={{ currency: "INR", setCurrency: () => undefined, isLoading: false }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}
