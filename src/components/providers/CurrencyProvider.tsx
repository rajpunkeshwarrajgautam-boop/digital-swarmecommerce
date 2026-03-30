"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Currency = "INR" | "USD" | "EUR" | "GBP";

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  isLoading: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>("INR");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedCurrency = localStorage.getItem("selected_currency") as Currency;
    if (storedCurrency && ["INR", "USD", "EUR", "GBP"].includes(storedCurrency)) {
      setCurrencyState(storedCurrency);
    } else {
      // Optional: Auto-detect logic can be added here
      // For now, default to INR
    }
    setIsLoading(false);
  }, []);

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency);
    localStorage.setItem("selected_currency", newCurrency);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, isLoading }}>
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
