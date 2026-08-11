"use client";

/**
 * The current Cashfree integration settles authoritative catalog orders in
 * INR. Keep this control informational until genuine multi-currency settlement
 * is implemented; do not expose fixed-rate pseudo-conversion as a selector.
 */
export function CurrencySwitcher() {
  return (
    <div className="border border-white/10 bg-white/[0.03] px-2.5 py-1 font-mono text-[10px] font-black uppercase tracking-wider text-white/45">
      ₹ INR
    </div>
  );
}
