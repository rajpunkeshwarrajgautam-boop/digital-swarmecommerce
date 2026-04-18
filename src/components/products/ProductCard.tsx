"use client";

import { Product } from "@/lib/types";
import { useCartStore } from "@/lib/store";
import { useWishlistStore } from "@/lib/wishlist-store";
import Link from "next/link";
import Image from "next/image";
import { Heart, Cpu, Code2, ShoppingCart, Check, Terminal, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { ForgeButton } from "@/components/ui/ForgeButton";
import { useCurrency } from "@/components/providers/CurrencyProvider";
import { formatCurrency } from "@/lib/utils";
import { trackAddToCart, trackSelectItem } from "@/lib/web-analytics";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
  listName?: string;
}

function TechBadges({ category, version }: { category: string; version?: string }) {
  const isAI = category?.includes("AI") || category?.includes("Agent");
  const isWeb = category?.includes("Web") || category?.includes("Software") || category?.includes("Boilerplates");

  return (
    <div className="flex flex-wrap items-center gap-2 mt-4">
      {isAI && (
        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-accent/5 border border-accent/20 text-[9px] font-mono uppercase tracking-widest text-accent">
          <Cpu className="w-3 h-3" /> AI / Agent
        </div>
      )}
      {isWeb && (
        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-primary/5 border border-primary/20 text-[9px] font-mono uppercase tracking-widest text-primary">
          <Code2 className="w-3 h-3" /> Software
        </div>
      )}
      {version && (
        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-white/5 border border-white/5 text-[9px] font-mono uppercase tracking-widest text-white/40">
          <Terminal className="w-3 h-3" /> {version}
        </div>
      )}
    </div>
  );
}

import { useSwarmPrefetch } from "@/hooks/useSwarmPrefetch";

export function ProductCard({ product, priority = false, listName = "product_grid" }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isWishlisted } = useWishlistStore();
  const { currency } = useCurrency();
  const { prefetch } = useSwarmPrefetch();

  const [added, setAdded] = useState(false);
  const wishlisted = isWishlisted(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (added) return;
    addItem(product);
    trackAddToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      category: product.category,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (wishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image
      });
    }
  };

  const handleMouseEnter = () => {
    prefetch(`/api/products/${product.id}`);
  };

  const handleSelectItem = () => {
    trackSelectItem(listName, {
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.category,
    });
  };

  return (
    <GlassCard 
      className="p-0 overflow-hidden h-full group flex flex-col ono-reveal relative"
      onMouseEnter={handleMouseEnter}
    >
      <Link href={`/product/${product.id}`} onClick={handleSelectItem} className="block relative aspect-square overflow-hidden bg-white/5 silk-reveal-mask">
        <div className="ono-reveal h-full w-full">
          <Image
            src={product.image}
            fill
            className="object-cover transition-transform duration-1000 ease-out group-hover:scale-110 group-hover:rotate-1"
            alt={product.name}
            priority={priority}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-60" />
        
        {/* Most Popular Badge */}
        {product.id === "ai-agent-boilerplate" && (
          <div className="absolute top-4 left-4 z-20">
            <div className="bg-primary text-black text-[9px] font-outfit font-black px-3 py-1 rounded-sm uppercase tracking-widest shadow-lg italic">
              Elite Protocol
            </div>
          </div>
        )}

        {/* Wishlist */}
        <button
          onClick={toggleWishlist}
          aria-label={wishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all z-20 ${
            wishlisted
              ? "bg-primary text-black"
              : "bg-black/40 backdrop-blur-md text-white/40 hover:text-primary hover:bg-black/60 border border-white/10"
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${wishlisted ? "fill-current" : ""}`} />
        </button>

        {/* Price Tag + Discount Anchor */}
        <div className="absolute bottom-4 left-4 z-10 flex flex-col gap-0.5">
          {product.originalPrice && (
            <span className="font-outfit text-xs text-white/30 line-through italic tracking-tight">
              {formatCurrency(product.originalPrice, currency)}
            </span>
          )}
          <span className="font-outfit font-black text-lg text-white uppercase italic tracking-tighter glow-text">
            {formatCurrency(product.price, currency)}
          </span>
        </div>
      </Link>

      <div className="p-6 flex flex-col flex-1 gap-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-primary">{product.category}</span>
          <span className="text-[9px] font-mono text-white/25 uppercase tracking-widest text-right">
            Reviews on product page
          </span>
        </div>

        <h3 className="text-xl font-outfit font-black italic uppercase text-white group-hover:text-accent transition-colors line-clamp-1 leading-none">
          {product.name}
        </h3>

        <p className="text-sm text-white/40 font-inter line-clamp-2 leading-snug">
          {product.description}
        </p>

        <TechBadges category={product.category} version={product.specs?.Version} />

        {/* Swarm Analytics Injection */}
        {(product.swarmScore || product.matchDensity || product.aura) && (
          <div className="mt-4 p-3 bg-white/2 border border-white/5 rounded-lg space-y-3">
             {product.aura && (
                <div className="flex items-center gap-2">
                   <Sparkles className="w-3 h-3 text-accent animate-pulse" />
                   <span className="text-[8px] font-mono font-black text-accent uppercase tracking-widest italic">
                      {product.aura.replace('_', ' ')}
                   </span>
                </div>
             )}
             {product.matchDensity !== undefined && (
                <div className="space-y-1.5">
                   <div className="flex justify-between text-[7px] font-mono uppercase tracking-widest text-white/20">
                      <span>Neural Match Density</span>
                      <span className="text-primary">{product.matchDensity}%</span>
                   </div>
                   <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: `${product.matchDensity}%` }}
                         className="h-full bg-primary"
                      />
                   </div>
                </div>
             )}
          </div>
        )}

        <div className="mt-6 pt-6 border-t border-white/5 flex flex-col gap-3">
          <ForgeButton
            variant={added ? "outline" : "primary"}
            size="sm"
            onClick={handleAddToCart}
            className="w-full"
          >
            <AnimatePresence mode="wait" initial={false}>
              {added ? (
                <motion.span
                  key="added"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-2"
                >
                  <Check className="w-3.5 h-3.5" /> Added to Cart
                </motion.span>
              ) : (
                <motion.span
                  key="add"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-2"
                >
                  <ShoppingCart className="w-3.5 h-3.5" /> Add to Cart
                </motion.span>
              )}
            </AnimatePresence>
          </ForgeButton>

          <Link href={`/product/${product.id}`} onClick={handleSelectItem} className="w-full" aria-label={`View details for ${product.name}`}>
            <button className="w-full text-[10px] font-mono text-white/20 uppercase tracking-[0.3em] hover:text-white transition-colors">
              View Details
            </button>
          </Link>
        </div>
      </div>
    </GlassCard>
  );
}
