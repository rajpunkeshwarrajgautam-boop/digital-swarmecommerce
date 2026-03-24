"use client";

import { Product } from "@/lib/types";
import { useCartStore } from "@/lib/store";
import { useWishlistStore } from "@/lib/wishlist-store";
import Link from "next/link";
import Image from "next/image";
import { Star, ShoppingCart, Heart, Zap, Cpu, Code2 } from "lucide-react";
import { motion } from "framer-motion";

interface ProductCardProps {
  product: Product;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1" aria-label={`Rated ${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`w-3.5 h-3.5 ${
            s <= Math.round(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-600"
          }`}
        />
      ))}
      <span className="text-[10px] text-gray-400 font-black ml-1 uppercase">{rating.toFixed(1)}</span>
    </div>
  );
}

function TechBadges({ category }: { category: string }) {
  const isAI = category.includes("AI") || category.includes("Agent");
  const isWeb = category.includes("Web") || category.includes("Software");
  
  return (
    <div className="flex items-center gap-2 mt-3">
      {isAI && (
        <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-[9px] font-black uppercase tracking-widest text-cyan-400 italic">
          <Cpu className="w-2.5 h-2.5" /> Neural
        </div>
      )}
      {isWeb && (
        <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/20 text-[9px] font-black uppercase tracking-widest text-blue-400 italic">
          <Code2 className="w-2.5 h-2.5" /> Next.js
        </div>
      )}
      <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-gray-400 italic">
        <Zap className="w-2.5 h-2.5" /> Optimized
      </div>
    </div>
  );
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isWishlisted } = useWishlistStore();
  
  const wishlisted = isWishlisted(product.id);

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

  return (
    <motion.div 
      whileHover={{ y: -8 }}
      className="group relative bg-white rounded-[2.5rem] p-5 transition-all duration-500 h-full flex flex-col hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)] border border-black/5"
    >
      {/* Glow Effect */}
      <div className="absolute inset-0 bg-linear-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-[2.5rem] pointer-events-none" />

      <div className="block relative aspect-square w-full mb-6 overflow-hidden rounded-4xl bg-gray-50 border border-black/5 group-hover:border-black/10 transition-colors">
        <Link href={`/products/${product.id}`} className="block w-full h-full">
          <div className="w-full h-full flex items-center justify-center relative">
            <Image
              src={product.image}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
              alt={product.name}
              loading="lazy"
            />
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
        </Link>

        {/* Status Badges */}
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
           {(product.sales ?? 0) > 50 && (
            <div className="w-fit bg-red-500 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-red-500/20 italic">
              Best Seller
            </div>
           )}
           {product.category === 'AI Agents' && (
             <div className="w-fit bg-cyan-500 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-cyan-500/20 italic">
               Agentic
             </div>
           )}
        </div>

        <button 
          onClick={toggleWishlist}
          className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all z-20 shadow-xl ${
            wishlisted 
              ? "bg-red-500 text-white scale-110" 
              : "bg-white/80 backdrop-blur-md text-gray-400 hover:text-red-500 hover:scale-110 border border-black/5"
          }`}
        >
          <Heart className={`w-4 h-4 ${wishlisted ? "fill-current" : ""}`} />
        </button>

        {/* Pricing Badge (Industrial Style) */}
        <div className="absolute bottom-4 right-4 bg-white shadow-2xl text-gray-900 font-black text-sm px-4 py-2 rounded-2xl border border-black/5 z-10 scale-90 group-hover:scale-100 transition-transform">
          ₹{product.price.toLocaleString("en-IN")}
        </div>
      </div>

      <div className="flex flex-col grow gap-2 px-1 relative z-10">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-black uppercase tracking-widest text-cyan-600 italic">{product.category}</span>
          {product.rating > 0 && <StarRating rating={product.rating} />}
        </div>

        <h3 className="text-xl font-black text-gray-900 leading-[1.1] tracking-tight mb-2 group-hover:text-cyan-600 transition-colors line-clamp-2 uppercase italic">
          {product.name}
        </h3>
        
        <p className="text-xs text-gray-500 mb-6 line-clamp-2 grow font-medium leading-relaxed uppercase tracking-tight">
          {product.description}
        </p>

        <TechBadges category={product.category} />

        <div className="flex gap-3 mt-6 relative z-10">
          <Link href={`/products/${product.id}`} className="w-1/3">
            <button className="w-full h-12 bg-gray-100 text-gray-900 rounded-2xl font-black uppercase italic text-xs border border-transparent hover:bg-white hover:border-black transition-all">
              Detail
            </button>
          </Link>
          <div className="w-2/3">
            {product.inStock ? (
              <button
                onClick={(e) => { 
                  e.preventDefault(); 
                  addItem(product); 
                }}
                className="w-full h-12 bg-black text-white font-black uppercase italic text-xs rounded-2xl border-4 border-black hover:shadow-[0_15px_30px_rgba(0,0,0,0.15)] hover:-translate-y-1 transition-all flex items-center justify-center gap-2 group/btn"
              >
                <ShoppingCart className="w-4 h-4 group-hover/btn:rotate-12 transition-transform" /> 
                Add To Stack
              </button>
            ) : (
              <button disabled className="w-full h-12 bg-gray-100 text-gray-400 rounded-2xl font-black uppercase italic text-xs cursor-not-allowed">
                Depleted
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

