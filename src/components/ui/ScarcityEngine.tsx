"use client";

import { ShieldCheck } from "lucide-react";

export function ScarcityEngine({ productId: _productId }: { productId: string }) {
  return (
    <div className="mt-3 flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-mono text-white/45">
      <ShieldCheck className="h-3.5 w-3.5 text-primary" />
      <span>No simulated viewer, purchase, or stock counters.</span>
    </div>
  );
}
