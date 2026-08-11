"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Building2, Check } from "lucide-react";
import { useCartStore } from "@/lib/store";
import type { Product } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { trackAddToCart } from "@/lib/web-analytics";

export default function AddToCartButton({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem);
  const [isAdding, setIsAdding] = useState(false);
  const [licenseType, setLicenseType] = useState<"standard" | "whitelabel">("standard");
  const isWhitelabel = licenseType === "whitelabel";
  const finalPrice = isWhitelabel ? product.price * 5 : product.price;

  const handleAdd = () => {
    setIsAdding(true);
    const cartProduct: Product = {
      ...product,
      id: isWhitelabel ? `${product.id}-whitelabel` : product.id,
      name: isWhitelabel ? `${product.name} [Agency Whitelabel License]` : product.name,
      price: finalPrice,
    };

    addItem(cartProduct);
    trackAddToCart({ id: cartProduct.id, name: cartProduct.name, price: finalPrice, quantity: 1, category: cartProduct.category });

    if (typeof window !== "undefined") {
      const fbq = (window as Window & { fbq?: (...args: unknown[]) => void }).fbq;
      fbq?.("track", "AddToCart", {
        content_ids: [cartProduct.id],
        content_name: cartProduct.name,
        content_type: "product",
        value: finalPrice,
        currency: "INR",
      });
    }

    window.setTimeout(() => setIsAdding(false), 700);
  };

  return (
    <div className="flex flex-col gap-6 text-[#151515]">
      <div>
        <span className="font-mono text-[9px] font-black uppercase tracking-[.2em] text-[#725cff]">Choose license</span>
        <p className="mt-2 text-sm leading-6 text-black/50">Select the scope you need before adding the product to your cart.</p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2" role="group" aria-label="Choose license">
        <button
          type="button"
          onClick={() => setLicenseType("standard")}
          aria-pressed={!isWhitelabel}
          className={`relative overflow-hidden border p-5 text-left transition ${!isWhitelabel ? "border-[#725cff] bg-[#d9d0ff]" : "border-black/20 bg-white/25 hover:border-black/40"}`}
        >
          <div className="mb-8 flex items-start justify-between gap-3">
            <span className="font-mono text-[9px] font-black uppercase tracking-[.16em]">Standard commercial</span>
            <BadgeCheck className={`h-5 w-5 ${!isWhitelabel ? "text-[#725cff]" : "text-black/20"}`} />
          </div>
          <div className="text-3xl font-black tracking-[-.055em]">{formatCurrency(product.price, "INR")}</div>
          <p className="mt-3 text-[11px] leading-5 text-black/50">Use and modify the asset for your own work or a client project. Raw delivery files may not be redistributed or resold.</p>
        </button>

        <button
          type="button"
          onClick={() => setLicenseType("whitelabel")}
          aria-pressed={isWhitelabel}
          className={`relative overflow-hidden border p-5 text-left transition ${isWhitelabel ? "border-[#151515] bg-[#d8b66d]" : "border-black/20 bg-white/25 hover:border-black/40"}`}
        >
          <div className="mb-8 flex items-start justify-between gap-3">
            <span className="font-mono text-[9px] font-black uppercase tracking-[.16em]">Agency whitelabel</span>
            <Building2 className={`h-5 w-5 ${isWhitelabel ? "text-black" : "text-black/20"}`} />
          </div>
          <div className="text-3xl font-black tracking-[-.055em]">{formatCurrency(product.price * 5, "INR")}</div>
          <p className="mt-3 text-[11px] leading-5 text-black/50">Rebrand implemented client-facing work under your agency. Raw archive or source-as-a-product resale remains prohibited.</p>
        </button>
      </div>

      <p className="text-[11px] leading-5 text-black/45">Review the <Link href="/licenses" className="font-bold text-[#725cff] underline underline-offset-4">license terms</Link> before ordering.</p>

      <button
        type="button"
        disabled={!product.inStock || isAdding}
        onClick={handleAdd}
        className={`flex min-h-14 w-full items-center justify-center gap-3 border px-6 text-[10px] font-black uppercase tracking-[.17em] transition ${!product.inStock ? "cursor-not-allowed border-black/10 bg-black/5 text-black/25" : isWhitelabel ? "border-[#151515] bg-[#d8b66d] text-[#151515] hover:bg-[#151515] hover:text-[#f1eee6]" : "border-[#151515] bg-[#151515] text-[#f1eee6] hover:border-[#725cff] hover:bg-[#725cff]"}`}
      >
        {isAdding ? <><Check className="h-4 w-4" /> Added to cart</> : <>Add {isWhitelabel ? "agency whitelabel" : "standard"} to cart <ArrowRight className="h-4 w-4" /></>}
      </button>
    </div>
  );
}
