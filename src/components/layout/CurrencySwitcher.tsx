"use client";

import React from "react";
import { useCurrency } from "../providers/CurrencyProvider";
import { cn } from "@/lib/utils";

const CURRENCIES = [
  { code: "INR", label: "₹ INR", symbol: "₹" },
  { code: "USD", label: "$ USD", symbol: "$" },
  { code: "EUR", label: "€ EUR", symbol: "€" },
  { code: "GBP", label: "£ GBP", symbol: "£" },
];

export function CurrencySwitcher() {
  const { currency, setCurrency } = useCurrency();

  return (
    <div className="flex items-center gap-2">
      <div className="flex bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 p-0.5 backdrop-blur-md">
        {CURRENCIES.map((c) => (
          <button
            key={c.code}
            onClick={() => setCurrency(c.code as any)}
            className={cn(
              "px-2 py-1 text-[10px] font-mono uppercase transition-all duration-200",
              currency === c.code
                ? "bg-black text-white dark:bg-white dark:text-black"
                : "text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5"
            )}
          >
            {c.code}
          </button>
        ))}
      </div>
    </div>
  );
}
