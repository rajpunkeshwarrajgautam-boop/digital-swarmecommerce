"use client";

import { Button } from "@/components/ui/Button";
import { useCartStore } from "@/lib/store";
import { Product } from "@/lib/types";
import { ShoppingCart } from "lucide-react";
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
    setTimeout(() => setIsAdding(false), 500);
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* License Selection Tier */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Standard Tier */}
        <button
          onClick={() => setLicenseType("standard")}
          className={`flex flex-col text-left p-4 rounded-2xl border-2 transition-all cursor-pointer ${
            !isWhitelabel 
              ? "border-primary bg-primary/5 shadow-[0_0_15px_rgba(204,255,0,0.1)]" 
              : "border-border/50 bg-secondary/20 hover:border-primary/50"
          }`}
        >
          <div className="flex justify-between items-start mb-2">
            <span className="font-bold text-foreground">Standard License</span>
            <BadgeCheck className={`w-5 h-5 ${!isWhitelabel ? "text-primary" : "text-muted-foreground"}`} />
          </div>
          <span className="text-2xl font-black text-foreground mb-1">₹{product.price.toLocaleString("en-IN")}</span>
          <span className="text-xs text-muted-foreground leading-relaxed">Personal or single commercial project. Cannot be resold.</span>
        </button>

        {/* Whitelabel Tier */}
        <button
          onClick={() => setLicenseType("whitelabel")}
          className={`flex flex-col text-left p-4 rounded-2xl border-2 transition-all cursor-pointer relative overflow-hidden group ${
            isWhitelabel 
              ? "border-purple-500 bg-purple-500/5 shadow-[0_0_20px_rgba(168,85,247,0.2)]" 
              : "border-border/50 bg-secondary/20 hover:border-purple-500/50"
          }`}
        >
          {/* Shine effect */}
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
          
          <div className="flex justify-between items-start mb-2 relative z-10">
            <span className="font-bold text-purple-400">Agency Whitelabel</span>
            <Building2 className={`w-5 h-5 ${isWhitelabel ? "text-purple-500" : "text-muted-foreground"}`} />
          </div>
          <span className="text-2xl font-black text-foreground mb-1 relative z-10">₹{(product.price * 5).toLocaleString("en-IN")}</span>
          <span className="text-xs text-muted-foreground leading-relaxed relative z-10">Full resell rights. Rebrand and sell as your own SaaS.</span>
        </button>
      </div>

      <div className="flex gap-4">
        <Button 
          size="lg" 
          className={`flex-1 text-lg h-14 font-black tracking-wide border-0 transition-all ${
            isWhitelabel 
              ? "bg-linear-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white shadow-xl shadow-purple-500/20" 
              : ""
          }`}
          disabled={!product.inStock}
          onClick={handleAdd}
        >
          {isAdding ? "Added to Payload!" : `Add ${isWhitelabel ? 'Agency License' : 'to Cart'} - ₹${finalPrice.toLocaleString("en-IN")}`}
        </Button>
      </div>
    </div>
  );
}
