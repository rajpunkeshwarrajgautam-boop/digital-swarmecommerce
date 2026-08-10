"use client";

import { useCartStore } from "@/lib/store";
import type { Product } from "@/lib/types";
import { useState } from "react";
import { BadgeCheck, Building2, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { ForgeButton } from "@/components/ui/ForgeButton";
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
    trackAddToCart({
      id: cartProduct.id,
      name: cartProduct.name,
      price: finalPrice,
      quantity: 1,
      category: cartProduct.category,
    });

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

    window.setTimeout(() => setIsAdding(false), 500);
  };

  return (
    <div className="flex flex-col gap-7">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2" role="group" aria-label="Choose license">
        <button
          type="button"
          onClick={() => setLicenseType("standard")}
          aria-pressed={!isWhitelabel}
          className={`relative overflow-hidden border p-6 text-left transition-all ${
            !isWhitelabel ? "border-primary/45 bg-primary/[0.06]" : "border-white/8 bg-white/[0.02] hover:border-white/15"
          }`}
        >
          {!isWhitelabel ? <div className="absolute inset-y-0 left-0 w-1 bg-primary" /> : null}
          <div className="mb-5 flex items-start justify-between gap-3">
            <span className="font-mono text-[10px] font-black uppercase tracking-[.2em] text-white/55">Standard Commercial</span>
            <BadgeCheck className={`h-5 w-5 ${!isWhitelabel ? "text-primary" : "text-white/15"}`} />
          </div>
          <div className="text-3xl font-outfit font-black tracking-tighter text-white">{formatCurrency(product.price, "INR")}</div>
          <p className="mt-4 text-[11px] leading-5 text-white/38">
            Use and modify the asset for your own work or a client project. Do not redistribute or resell the raw delivery archive.
          </p>
        </button>

        <button
          type="button"
          onClick={() => setLicenseType("whitelabel")}
          aria-pressed={isWhitelabel}
          className={`relative overflow-hidden border p-6 text-left transition-all ${
            isWhitelabel ? "border-accent/45 bg-accent/[0.06]" : "border-white/8 bg-white/[0.02] hover:border-white/15"
          }`}
        >
          {isWhitelabel ? <div className="absolute inset-y-0 left-0 w-1 bg-accent" /> : null}
          <div className="mb-5 flex items-start justify-between gap-3">
            <span className="font-mono text-[10px] font-black uppercase tracking-[.2em] text-white/55">Agency Whitelabel</span>
            <Building2 className={`h-5 w-5 ${isWhitelabel ? "text-accent" : "text-white/15"}`} />
          </div>
          <div className="text-3xl font-outfit font-black tracking-tighter text-white">{formatCurrency(product.price * 5, "INR")}</div>
          <p className="mt-4 text-[11px] leading-5 text-white/38">
            Rebrand the implemented client-facing work under your agency. Raw archive resale, marketplace redistribution and source-as-a-product resale remain prohibited.
          </p>
        </button>
      </div>

      <p className="text-[11px] leading-5 text-white/30">
        License scope is part of the purchase. Review the <Link href="/licenses" className="text-primary underline underline-offset-4">license terms</Link> before ordering.
      </p>

      <ForgeButton
        className={`w-full py-6 text-lg ${!product.inStock ? "grayscale opacity-50" : ""}`}
        disabled={!product.inStock || isAdding}
        onClick={handleAdd}
        variant={isWhitelabel ? "accent" : "primary"}
      >
        {isAdding ? (
          <span className="flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 animate-spin" /> Adding…
          </span>
        ) : (
          <span className="flex items-center gap-3">
            Add {isWhitelabel ? "Agency Whitelabel" : "Standard"} to Cart
            <ArrowRight className="ml-2 h-5 w-5" />
          </span>
        )}
      </ForgeButton>
    </div>
  );
}
