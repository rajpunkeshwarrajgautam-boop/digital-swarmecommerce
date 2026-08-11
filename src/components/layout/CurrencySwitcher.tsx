"use client";

/**
 * The current Cashfree integration settles authoritative catalog orders in
 * INR. Keep this control informational until genuine multi-currency settlement
 * is implemented; do not expose fixed-rate pseudo-conversion as a selector.
 */
export function CurrencySwitcher() {
  return (
    <div className="border border-black/15 bg-black/[0.025] px-2.5 py-1 font-mono text-[9px] font-black uppercase tracking-[.18em] text-black/55">
      ₹ INR
    </div>
  );
}
