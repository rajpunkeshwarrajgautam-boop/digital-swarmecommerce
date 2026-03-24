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
          className={`w-3 h-3 ${
            s <= Math.round(rating) ? "fill-primary text-primary" : "text-secondary/10"
          }`}
        />
      ))}
    </div>
  );
}

function TechBadges({ category }: { category: string }) {
  const isAI = category.includes("AI") || category.includes("Agent");
  const isWeb = category.includes("Web") || category.includes("Software") || category.includes("Boilerplates");
  
  return (
    <div className="flex flex-wrap items-center gap-2 mt-4">
      {isAI && (
        <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-[8px] font-black uppercase tracking-widest text-accent italic">
          <Cpu className="w-2.5 h-2.5" /> Neural
        </div>
      )}
      {isWeb && (
        <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[8px] font-black uppercase tracking-widest text-primary italic">
          <Code2 className="w-2.5 h-2.5" /> Next.js 15
        </div>
      )}
      <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-secondary/5 border border-secondary/10 text-[8px] font-black uppercase tracking-widest text-secondary/40 italic">
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
      whileHover={{ y: -10 }}
      className="group relative bg-white rounded-[2.5rem] p-6 transition-all duration-500 h-full flex flex-col hover:shadow-[0_40px_80px_rgba(26,26,46,0.1)] border border-secondary/5 hover:border-primary/20"
    >
      <div className="block relative aspect-4/5 w-full mb-8 overflow-hidden rounded-[2rem] bg-secondary/5 border-2 border-transparent group-hover:border-primary/10 transition-all">
        <Link href={`/products/${product.id}`} className="block w-full h-full">
          <Image
            src={product.image}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
            alt={product.name}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-linear-to-t from-secondary/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </Link>
        
        {/* Most Popular Badge */}
        {product.id === 'ai-agent-boilerplate' && (
          <div className="absolute top-6 left-6 z-20">
            <div className="bg-primary text-white text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-primary/20 italic">
              Most Popular
            </div>
          </div>
        )}

        <button 
          onClick={toggleWishlist}
          className={`absolute top-6 right-6 w-12 h-12 rounded-full flex items-center justify-center transition-all z-20 shadow-xl ${
            wishlisted 
              ? "bg-primary text-white scale-110" 
              : "bg-white/80 backdrop-blur-md text-secondary/40 hover:text-primary hover:scale-110 border border-secondary/5"
          }`}
        >
          <Heart className={`w-5 h-5 ${wishlisted ? "fill-current" : ""}`} />
        </button>

        <div className="absolute bottom-6 right-6 bg-white shadow-2xl text-secondary font-black text-lg px-5 py-2.5 rounded-2xl border border-secondary/5 z-10 skew-x-[-6deg] group-hover:skew-x-0 transition-transform">
          ₹{product.price.toLocaleString("en-IN")}
        </div>
      </div>

      <div className="flex flex-col grow gap-2 px-1 relative z-10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-primary italic">{product.category}</span>
          <StarRating rating={product.rating} />
        </div>

        <h3 className="text-2xl font-black text-secondary leading-[1] tracking-tighter mb-3 group-hover:text-primary transition-colors line-clamp-2 uppercase italic">
          {product.name}
        </h3>
        
        <p className="text-sm text-secondary/50 mb-6 line-clamp-2 grow font-bold uppercase tracking-tight leading-tight">
          {product.description}
        </p>

        <TechBadges category={product.category} />

        <div className="flex gap-4 mt-8 relative z-10">
          <Link href={`/products/${product.id}`} className="flex-1">
            <button className="w-full h-14 bg-secondary/5 text-secondary rounded-2xl font-black uppercase italic text-xs border-2 border-transparent hover:bg-white hover:border-secondary/20 transition-all">
              View Details
            </button>
          </Link>
          <button
            onClick={(e) => { 
              e.preventDefault(); 
              addItem(product); 
            }}
            className="flex-1 h-14 bg-primary text-white font-black uppercase italic text-xs rounded-2xl border-2 border-secondary hover:shadow-xl transition-all flex items-center justify-center gap-2"
          >
            Buy Now
          </button>
        </div>
      </div>
    </motion.div>
  );
}
