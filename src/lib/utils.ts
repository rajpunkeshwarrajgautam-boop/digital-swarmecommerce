import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const EXCHANGE_RATES: Record<string, number> = {
  INR: 1,
  USD: 0.012,
  EUR: 0.011,
  GBP: 0.0094,
};

/**
 * Currency Formatting Protocol
 * Strictly formats the provided numeric amount into a locale-aware string.
 */
export function formatCurrency(amount: number, currency: string = 'INR') {
  return new Intl.NumberFormat(currency === 'INR' ? 'en-IN' : 'en-US', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: currency === 'INR' ? 0 : 2,
  }).format(amount);
}

/**
 * Currency Conversion Protocol
 * Converts a base (INR) amount to the target currency using fixed exchange rates.
 */
export function convertAmount(amount: number, targetCurrency: string) {
  const rate = EXCHANGE_RATES[targetCurrency] || 1;
  return amount * rate;
}
