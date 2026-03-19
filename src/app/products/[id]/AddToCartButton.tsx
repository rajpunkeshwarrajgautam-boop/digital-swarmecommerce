"use client";

import { useCartStore } from "@/lib/store";
import { Product } from "@/lib/types";
import { useState } from "react";
import { BadgeCheck, Building2 } from "lucide-react";

export default function AddToCartButton({ product }: { product: Product }) {
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

    // Track AddToCart Event
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'AddToCart', {
        content_ids: [cartProduct.id],
        content_name: cartProduct.name,
        content_type: 'product',
        value: finalPrice,
        currency: 'INR'
      });
    }

    setTimeout(() => setIsAdding(false), 500);
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* License Selection Tier */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        {/* Standard Tier */}
        <button
          onClick={() => setLicenseType("standard")}
          className={`flex flex-col text-left p-6 border-4 transition-all cursor-pointer relative ${
            !isWhitelabel 
              ? "border-primary bg-primary/10 shadow-[6px_6px_0px_#CCFF00]" 
              : "border-white/20 bg-transparent hover:border-primary/50"
          }`}
        >
          <div className="flex justify-between items-start mb-4">
            <span className="font-bold text-foreground uppercase tracking-widest text-sm">Standard</span>
            <BadgeCheck className={`w-8 h-8 ${!isWhitelabel ? "text-primary fill-primary/20" : "text-white/20"}`} />
          </div>
          <span className="text-4xl font-black italic tracking-tighter text-foreground mb-2 leading-none">₹{product.price.toLocaleString("en-IN")}</span>
          <span className="text-xs text-white/50 uppercase font-bold tracking-wider leading-relaxed">Personal / single use.<br/>Cannot be resold.</span>
        </button>

        {/* Whitelabel Tier */}
        <button
          onClick={() => setLicenseType("whitelabel")}
          className={`flex flex-col text-left p-6 border-4 transition-all cursor-pointer relative overflow-hidden group ${
            isWhitelabel 
              ? "border-[#a855f7] bg-purple-500/10 shadow-[6px_6px_0px_#a855f7]" 
              : "border-white/20 bg-transparent hover:border-[#a855f7]/50"
          }`}
        >
          {/* Shine effect */}
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
          
          <div className="flex justify-between items-start mb-4 relative z-10">
            <span className="font-bold text-[#a855f7] uppercase tracking-widest text-sm">Whitelabel</span>
            <Building2 className={`w-8 h-8 ${isWhitelabel ? "text-[#a855f7] fill-purple-500/20" : "text-white/20"}`} />
          </div>
          <span className="text-4xl font-black italic tracking-tighter text-foreground mb-2 leading-none relative z-10">₹{(product.price * 5).toLocaleString("en-IN")}</span>
          <span className="text-xs text-white/50 uppercase font-bold tracking-wider leading-relaxed relative z-10">Full resell rights.<br/>Rebrand as your own.</span>
        </button>
      </div>

      <div className="flex gap-4">
        <button 
          className={`w-full py-6 text-2xl font-black italic uppercase tracking-tighter border-4 transition-all relative overflow-hidden active:translate-x-[4px] active:translate-y-[4px] active:shadow-none ${
            isWhitelabel 
              ? "bg-[#a855f7] text-white border-white hover:border-[#a855f7] shadow-[8px_8px_0px_#fff]" 
              : "bg-primary text-black border-black shadow-[8px_8px_0px_#000] hover:shadow-[8px_8px_0px_#CCFF00]"
          } ${!product.inStock ? "opacity-50 cursor-not-allowed shadow-none active:translate-x-0" : ""}`}
          disabled={!product.inStock}
          onClick={handleAdd}
        >
          {isAdding ? "System Injecting..." : `Deploy ${isWhitelabel ? 'Agency Proxy' : 'Protocol'} ->`}
        </button>
      </div>
    </div>
  );
}
