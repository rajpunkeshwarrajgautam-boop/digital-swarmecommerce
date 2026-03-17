"use client";

import { Product } from "@/lib/types";
import { useCartStore } from "@/lib/store";
import { useWishlistStore } from "@/lib/wishlist-store";
import Link from "next/link";
import Image from "next/image";
import { Star, ShoppingCart, Heart } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ProductCardProps {
  product: Product;
}

/** Renders star icons for a given rating (0–5). */
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1" aria-label={`Rated ${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`w-3.5 h-3.5 ${
            s <= Math.round(rating) ? "fill-yellow-500 text-yellow-500" : "text-muted"
          }`}
        />
      ))}
      <span className="text-xs text-muted-foreground ml-1">{rating.toFixed(1)}</span>
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
    <div className="group relative bg-card border border-white/5 p-4 transition-all duration-300 rounded-none h-full overflow-hidden">

      {/* Minimalist Image Container */}
      <div className="block relative aspect-square w-full mb-6 overflow-hidden">
        <Link href={`/products/${product.id}`} className="block w-full h-full">
          <div className="w-full h-full bg-black/40 flex items-center justify-center">
            <Image
              src={product.image}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              alt={product.name}
              loading="lazy"
            />
          </div>
        </Link>

        {/* Dynamic Badge */}
        {(product.sales ?? 0) > 50 ? (
          <div className="absolute top-4 inset-x-0 mx-auto w-fit bg-primary text-black text-[9px] font-black px-4 py-1.5 rounded-none z-20 uppercase tracking-[0.2em] italic">
            Best Seller
          </div>
        ) : (product.sales ?? 0) < 5 && (
          <div className="absolute top-4 inset-x-0 mx-auto w-fit bg-white text-black text-[9px] font-black px-4 py-1.5 rounded-none z-20 uppercase tracking-[0.2em] italic">
            New Protocol
          </div>
        )}

        {/* Wishlist Button */}
        <button 
          onClick={toggleWishlist}
          className={`absolute top-4 left-4 w-10 h-10 flex items-center justify-center border transition-all z-20 ${
            wishlisted 
              ? "bg-red-500/10 border-red-500 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]" 
              : "bg-black/60 border-white/10 text-white/50 hover:border-red-500 hover:text-red-500 backdrop-blur-md"
          }`}
        >
          <Heart className={`w-5 h-5 ${wishlisted ? "fill-current" : ""}`} />
        </button>

        {/* Minimalist Price Badge */}
        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-primary font-black text-sm px-4 py-1.5 border border-white/10 z-10 italic">
          ₹{product.price.toLocaleString("en-IN")}
        </div>
        {/* Instant download badge */}
        <div className="absolute bottom-4 left-4 bg-primary text-black text-[8px] font-black px-3 py-1 z-10 uppercase tracking-widest italic">
          INSTANT_SYNC
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col grow gap-2">
        {/* Star rating */}
        {product.rating > 0 && (
          <div className="mb-2">
            <StarRating rating={product.rating} />
          </div>
        )}

        <h3 className="text-2xl font-black italic tracking-tighter leading-none mb-1 group-hover:text-primary transition-colors line-clamp-2 uppercase">
          {product.name}
        </h3>
        <p className="text-sm text-muted-foreground mb-6 line-clamp-2 grow font-bold uppercase italic tracking-tighter leading-tight">
          {product.description}
        </p>

        {/* Actions */}
        <div className="flex flex-col gap-3 mt-auto relative z-10">
          <Link href={`/products/${product.id}`} className="w-full">
            <Button variant="outline" className="w-full h-12 bg-transparent border-white/10 text-white/50 hover:text-white hover:border-white rounded-none uppercase tracking-widest text-xs font-black">
              View Specs
            </Button>
          </Link>
          <div className="w-full">
            {product.inStock ? (
              <button
                onClick={(e) => { 
                  e.preventDefault(); 
                  if (typeof window !== 'undefined' && window.fbq) {
                    window.fbq('track', 'AddToCart', {
                      content_ids: [product.id],
                      content_name: product.name,
                      content_type: 'product',
                      value: product.price,
                      currency: 'INR'
                    });
                  }
                  addItem(product); 
                }}
                className="w-full h-12 bg-primary text-black font-black uppercase tracking-widest text-xs border border-primary hover:bg-white hover:border-white transition-all flex items-center justify-center gap-3"
              >
                <ShoppingCart className="w-4 h-4" /> Establish Link
              </button>
            ) : (
              <Button disabled variant="outline" className="w-full h-12 bg-zinc-900 text-muted-foreground border-white/5 rounded-none uppercase tracking-widest text-xs">
                Protocol Offline
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
