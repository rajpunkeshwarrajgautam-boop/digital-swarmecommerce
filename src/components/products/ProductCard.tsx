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

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1" aria-label={\`Rated \${rating} out of 5\`}>
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={\`w-3.5 h-3.5 \${
            s <= Math.round(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-200"
          }\`}
        />
      ))}
      <span className="text-xs text-gray-400 font-medium ml-1">{rating.toFixed(1)}</span>
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
    <div className="group relative bg-[#0f1115] backdrop-blur-xl border border-white/10 p-4 transition-all duration-500 rounded-3xl h-full flex flex-col hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] hover:-translate-y-2">

      {/* Soft Image Container */}
      <div className="block relative aspect-square w-full mb-5 overflow-hidden rounded-2xl bg-[#0a0c10] border border-white/10 group-hover:border-cyan-500/30 transition-colors">
        <Link href={\`/products/\${product.id}\`} className="block w-full h-full">
          <div className="w-full h-full flex items-center justify-center relative">
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
          <div className="absolute top-3 left-3 w-fit bg-pink-100 text-pink-600 border border-pink-200 text-[10px] font-bold px-3 py-1 rounded-full z-20 uppercase tracking-widest shadow-sm">
            Best Seller
          </div>
        ) : (product.sales ?? 0) < 5 && (
          <div className="absolute top-3 left-3 w-fit bg-cyan-900/40 text-cyan-400 border border-cyan-500/30 text-[10px] font-bold px-3 py-1 rounded-full z-20 uppercase tracking-widest shadow-sm">
            New Arrival
          </div>
        )}

        {/* Wishlist Button */}
        <button 
          onClick={toggleWishlist}
          className={\`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all z-20 shadow-sm \${
            wishlisted 
              ? "bg-red-500/10 border border-red-500/30 text-red-500" 
              : "bg-black/60 border border-white/20 text-gray-400 hover:text-red-500 hover:bg-black/80 backdrop-blur-md"
          }\`}
        >
          <Heart className={\`w-4 h-4 \${wishlisted ? "fill-current" : ""}\`} />
        </button>

        {/* Soft Price Badge */}
        <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md text-white font-mono font-bold text-sm px-3 py-1.5 rounded-full border border-white/20 z-10 shadow-[0_0_10px_rgba(0,0,0,0.5)]">
          ₹{product.price.toLocaleString("en-IN")}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col grow gap-2 px-1">
        {/* Star rating */}
        {product.rating > 0 && (
          <div className="mb-1">
            <StarRating rating={product.rating} />
          </div>
        )}

        <h3 className="text-xl font-bold text-white leading-tight mb-1 group-hover:text-cyan-400 transition-colors line-clamp-2">
          {product.name}
        </h3>
        <p className="text-sm text-gray-400 mb-6 line-clamp-2 grow font-medium leading-relaxed">
          {product.description}
        </p>

        {/* Actions */}
        <div className="flex gap-2 mt-auto relative z-10">
          <Link href={\`/products/\${product.id}\`} className="w-1/3">
            <Button variant="outline" className="w-full h-11 bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl font-bold transition-all shadow-[0_0_10px_rgba(255,255,255,0.02)]">
              View
            </Button>
          </Link>
          <div className="w-2/3">
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
                className="w-full h-11 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl border border-transparent hover:shadow-[0_0_20px_rgba(6,182,212,0.6)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" /> Add to Cart
              </button>
            ) : (
              <Button disabled variant="outline" className="w-full h-11 bg-white/5 text-gray-500 border border-white/10 rounded-xl font-bold">
                Out of Stock
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
