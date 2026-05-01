"use client";

import { useCartStore } from "@/lib/store";
import { Product } from "@/lib/types";
import { useState } from "react";
import { BadgeCheck, Building2, ArrowRight, ShieldCheck } from "lucide-react";
import { ForgeButton } from "@/components/ui/ForgeButton";
import { useCurrency } from "@/components/providers/CurrencyProvider";
import { formatCurrency } from "@/lib/utils";
import { trackAddToCart } from "@/lib/web-analytics";

export default function AddToCartButton({ product }: { product: Product }) {
  const { currency } = useCurrency();
  const addItem = useCartStore((state) => state.addItem);
  const [isAdding, setIsAdding] = useState(false);
  const [licenseType, setLicenseType] = useState<"standard" | "whitelabel">("standard");

  const isWhitelabel = licenseType === "whitelabel";
  const finalPrice = isWhitelabel ? product.price * 5 : product.price;

  const handleAdd = () => {
    setIsAdding(true);
    
    // Create a deeply copied customized product for the cart
    const cartProduct: Product = {
      ...product,
      id: isWhitelabel ? `${product.id}-whitelabel` : product.id,
      name: isWhitelabel ? `${product.name} [Whitelabel License]` : product.name,
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

      // Track AddToCart Event
      if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('track', 'AddToCart', {
          content_ids: [cartProduct.id],
          content_name: cartProduct.name,
          content_type: 'product',
          value: finalPrice,
          currency: currency
        });
      }

    setTimeout(() => setIsAdding(false), 800);
  };

  return (
    <div className="flex flex-col gap-8">
      
      {/* License Selection Tier */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Standard Tier */}
        <div
          onClick={() => setLicenseType("standard")}
          className={`group flex flex-col text-left p-6 border transition-all duration-500 cursor-pointer relative overflow-hidden ${
            !isWhitelabel 
              ? "border-primary/40 bg-primary/5" 
              : "border-white/5 bg-white/1 hover:border-white/10"
          }`}
        >
          {!isWhitelabel && (
            <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
          )}
          <div className="flex justify-between items-start mb-6">
            <span className="text-[10px] font-mono font-black text-white/40 uppercase tracking-[0.3em]">Standard_Protocol</span>
            <BadgeCheck className={`w-6 h-6 ${!isWhitelabel ? "text-primary flex shadow-[0_0_15px_rgba(255,107,53,0.3)]" : "text-white/10"}`} />
          </div>
            <div className="flex flex-col mb-4">
               <span className="text-sm font-mono text-white/20 uppercase tracking-widest mb-1">Valuation</span>
               <span className="text-3xl font-outfit font-black italic tracking-tighter text-white">{formatCurrency(product.price, currency)}</span>
            </div>
          <p className="text-[10px] font-mono text-white/20 uppercase tracking-widest leading-relaxed">
            Deployment: Single Instance<br/>
            Redistribution: Prohibited
          </p>
        </div>

        {/* Agency Tier */}
        <div
          onClick={() => setLicenseType("whitelabel")}
          className={`group flex flex-col text-left p-6 border transition-all duration-500 cursor-pointer relative overflow-hidden ${
            isWhitelabel 
              ? "border-accent/40 bg-accent/5" 
              : "border-white/5 bg-white/1 hover:border-white/10"
          }`}
        >
          {isWhitelabel && (
            <div className="absolute top-0 left-0 w-1 h-full bg-accent" />
          )}
          
          <div className="flex justify-between items-start mb-6">
            <span className="text-[10px] font-mono font-black text-white/40 uppercase tracking-[0.3em]">Agency_Bypass</span>
            <Building2 className={`w-6 h-6 ${isWhitelabel ? "text-accent flex shadow-[0_0_15px_rgba(168,85,247,0.3)]" : "text-white/10"}`} />
          </div>
            <div className="flex flex-col mb-4">
               <span className="text-sm font-mono text-white/20 uppercase tracking-widest mb-1">Valuation</span>
               <span className="text-3xl font-outfit font-black italic tracking-tighter text-white">{formatCurrency(product.price * 5, currency)}</span>
            </div>
          <p className="text-[10px] font-mono text-white/20 uppercase tracking-widest leading-relaxed">
            Deployment: Unlimited Swarms<br/>
            Rights: Full Whitelabel Bypass
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <ForgeButton 
          className={`w-full py-6 text-xl shadow-[0_10px_40px_rgba(255,107,53,0.1)] ${!product.inStock ? "grayscale opacity-50" : ""}`}
          disabled={!product.inStock || isAdding}
          onClick={handleAdd}
          variant={isWhitelabel ? 'accent' : 'primary'}
        >
          {isAdding ? (
             <span className="flex items-center gap-3 animate-pulse">
                <ShieldCheck className="w-5 h-5 animate-spin" /> SYNCHRONIZING...
             </span>
          ) : (
            <span className="flex items-center gap-3">
               ADD TO CART <ArrowRight className="w-5 h-5 ml-4" />
            </span>
          )}
        </ForgeButton>
      </div>
    </div>
  );
}
