"use client";

import { Product } from "@/lib/types";
import { useCartStore } from "@/lib/store";
import { useWishlistStore } from "@/lib/wishlist-store";
import Link from "next/link";
import Image from "next/image";
import { Star, ShoppingCart, Eye, Heart } from "lucide-react";
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
    <div className="group relative bg-card border-2 border-border p-4 hover:-translate-y-1 hover:-translate-x-1 transition-all duration-300 rounded-xl overflow-hidden flex flex-col h-full cyber-shadow">

      {/* Minimalist Image Container (Uiverse) */}
      <div className="block relative aspect-square w-full mb-4 overflow-hidden rounded-lg">
        <Link href={`/products/${product.id}`} className="block w-full h-full">
          <div className="minimalist-card">
            <Image
              src={product.image}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              alt={product.name}
              loading="lazy"
            />
          </div>
        </Link>

        {/* Wishlist Button */}
        <button 
          onClick={toggleWishlist}
          className={`absolute top-3 left-3 w-10 h-10 flex items-center justify-center rounded-full border border-border/50 backdrop-blur-md transition-all z-20 ${
            wishlisted 
              ? "bg-red-500 text-white border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]" 
              : "bg-white/80 text-foreground hover:bg-white hover:text-red-500"
          }`}
        >
          <Heart className={`w-5 h-5 ${wishlisted ? "fill-current" : ""}`} />
        </button>

        {/* Minimalist Price Badge */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-foreground font-black text-sm px-3 py-1 border border-border/50 rounded-full shadow-sm z-10">
          ₹{product.price.toLocaleString("en-IN")}
        </div>
        {/* Instant download badge */}
        <div className="absolute bottom-3 left-3 bg-black/80 text-white text-[10px] font-bold px-3 py-1 rounded-full backdrop-blur-md z-10">
          ⚡ Instant Download
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col grow">
        {/* Star rating */}
        {product.rating > 0 && (
          <div className="mb-2">
            <StarRating rating={product.rating} />
          </div>
        )}

        <h3 className="text-xl font-bold font-titan leading-tight mb-1 group-hover:text-primary transition-colors line-clamp-2">
          {product.name}
        </h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2 grow leading-relaxed">
          {product.description}
        </p>

        {/* Actions - Uiverse Button Applied */}
        <div className="flex flex-col sm:flex-row gap-3 mt-auto relative z-10">
          <Link href={`/products/${product.id}`} className="flex-1">
            <Button variant="outline" className="w-full h-11 bg-white hover:bg-gray-50 border-border group/view shadow-sm text-foreground">
              <Eye className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform text-primary" /> View Details
            </Button>
          </Link>
          <div className="flex-1">
            {product.inStock ? (
              <button
                onClick={(e) => { e.preventDefault(); addItem(product); }}
                className="uiverse-glow-btn h-11 shadow-sm"
              >
                <ShoppingCart className="w-4 h-4 mr-2" /> Buy
              </button>
            ) : (
              <Button disabled variant="outline" className="w-full h-11 bg-gray-100 text-muted-foreground border-border">
                Sold Out
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
