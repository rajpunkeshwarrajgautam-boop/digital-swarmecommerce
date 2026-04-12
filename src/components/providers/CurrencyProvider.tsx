"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useSyncExternalStore,
} from "react";

type Currency = "INR" | "USD" | "EUR" | "GBP";

const STORAGE_KEY = "selected_currency";
const ALLOWED = new Set<string>(["INR", "USD", "EUR", "GBP"]);

let currencyListeners: Array<() => void> = [];

function subscribeCurrency(listener: () => void) {
  currencyListeners = [...currencyListeners, listener];
  return () => {
    currencyListeners = currencyListeners.filter((l) => l !== listener);
  };
}

function emitCurrency() {
  for (const l of currencyListeners) l();
}

function readCurrencyFromStorage(): Currency {
  if (typeof window === "undefined") return "INR";
  const s = localStorage.getItem(STORAGE_KEY);
  if (s && ALLOWED.has(s)) return s as Currency;
  return "INR";
}

function writeCurrency(c: Currency) {
  localStorage.setItem(STORAGE_KEY, c);
  emitCurrency();
}

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  isLoading: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const currency = useSyncExternalStore(
    subscribeCurrency,
    readCurrencyFromStorage,
    (): Currency => "INR"
  );

  const setCurrency = useCallback((newCurrency: Currency) => {
    writeCurrency(newCurrency);
  }, []);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, isLoading: false }}>
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
