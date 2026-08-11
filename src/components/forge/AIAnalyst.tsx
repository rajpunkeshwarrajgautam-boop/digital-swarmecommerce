"use client";

import { CheckCircle2, CreditCard, FileArchive, ShieldCheck } from "lucide-react";

interface AIAnalystProps {
  productName: string;
  category: string;
}

/**
 * Product-integrity panel. The previous version animated a pretend AI scan and
 * displayed invented neural/security/latency/reliability scores. This panel is
 * intentionally limited to guarantees enforced by the storefront code and CI.
 */
export function AIAnalyst({ productName, category }: AIAnalystProps) {
  return (
    <section className="w-full overflow-hidden border border-white/10 bg-[#08080c]">
      <div className="flex flex-col gap-3 border-b border-white/8 bg-white/[0.025] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-primary" />
          <span className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-white/55">Product integrity</span>
        </div>
        <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/25">{category}</span>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-black uppercase italic tracking-tight text-white">{productName}</h3>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-white/40">
          This listing is part of the approved storefront catalog. Checkout revalidates the SKU, quantity and INR price on the server before creating a Cashfree payment order.
        </p>

        <div className="mt-7 grid gap-3 md:grid-cols-3">
          <Fact
            icon={FileArchive}
            title="Private delivery"
            body="Paid access resolves to a private ZIP bundle rather than a public product URL."
          />
          <Fact
            icon={CreditCard}
            title="Server-priced"
            body="The browser cannot choose the amount charged by the payment-order API."
          />
          <Fact
            icon={CheckCircle2}
            title="No synthetic score"
            body="No fabricated performance, security, latency, reliability or ROI score is shown."
          />
        </div>
      </div>
    </section>
  );
}

function Fact({
  icon: Icon,
  title,
  body,
}: {
  icon: React.ElementType;
  title: string;
  body: string;
}) {
  return (
    <div className="border border-white/8 bg-white/[0.02] p-4">
      <Icon className="mb-3 h-4 w-4 text-primary" />
      <div className="text-[10px] font-black uppercase tracking-[0.14em] text-white/70">{title}</div>
      <p className="mt-2 text-[11px] leading-5 text-white/35">{body}</p>
    </div>
  );
}
