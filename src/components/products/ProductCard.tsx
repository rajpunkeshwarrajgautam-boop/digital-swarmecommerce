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
    <div className="flex items-center gap-1" aria-label={`Rated ${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`w-3.5 h-3.5 ${
            s <= Math.round(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-200"
          }`}
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
    <div className="group relative bg-white border border-gray-100 p-4 transition-all duration-300 rounded-3xl h-full flex flex-col hover:shadow-xl hover:-translate-y-1">

      {/* Soft Image Container */}
      <div className="block relative aspect-square w-full mb-5 overflow-hidden rounded-2xl bg-gray-50 border border-gray-100">
        <Link href={`/products/${product.id}`} className="block w-full h-full">
          <div className="w-full h-full flex items-center justify-center">
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
          <div className="absolute top-3 left-3 w-fit bg-blue-100 text-blue-600 border border-blue-200 text-[10px] font-bold px-3 py-1 rounded-full z-20 uppercase tracking-widest shadow-sm">
            New Arrival
          </div>
        )}

        {/* Wishlist Button */}
        <button 
          onClick={toggleWishlist}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all z-20 shadow-sm ${
            wishlisted 
              ? "bg-red-50 border border-red-100 text-red-500" 
              : "bg-white/80 border border-gray-200 text-gray-400 hover:text-red-500 hover:bg-red-50 backdrop-blur-md"
          }`}
        >
          <Heart className={`w-4 h-4 ${wishlisted ? "fill-current" : ""}`} />
        </button>

        {/* Soft Price Badge */}
        <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md text-gray-900 font-bold text-sm px-3 py-1.5 rounded-full border border-gray-200 z-10 shadow-sm">
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

        <h3 className="text-xl font-bold text-gray-900 leading-tight mb-1 group-hover:text-blue-600 transition-colors line-clamp-2">
          {product.name}
        </h3>
        <p className="text-sm text-gray-500 mb-6 line-clamp-2 grow font-medium leading-relaxed">
          {product.description}
        </p>

        {/* Actions */}
        <div className="flex gap-2 mt-auto relative z-10">
          <Link href={`/products/${product.id}`} className="w-1/3">
            <Button variant="outline" className="w-full h-11 bg-white border border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-300 rounded-xl font-bold transition-all shadow-sm">
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
                className="w-full h-11 bg-[#f26496] text-white font-bold rounded-xl border border-transparent hover:shadow-[0_4px_15px_rgba(242,100,150,0.4)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" /> Add to Cart
              </button>
            ) : (
              <Button disabled variant="outline" className="w-full h-11 bg-gray-50 text-gray-400 border border-gray-200 rounded-xl font-bold">
                Out of Stock
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
