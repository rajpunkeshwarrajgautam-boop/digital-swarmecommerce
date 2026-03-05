"use client";

import { Product } from "@/lib/types";
import { useCartStore } from "@/lib/store";
import Link from "next/link";
import Image from "next/image";
import { Star, ShoppingCart } from "lucide-react";

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

  return (
    <div className="group relative bg-white border-4 border-black p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 transition-all duration-200 rounded-xl overflow-hidden flex flex-col h-full">
      {/* Image Container */}
      <div className="relative aspect-square w-full mb-4 bg-muted rounded-lg border-2 border-black overflow-hidden group-hover:rotate-1 transition-transform">
        <Image
          src={product.image}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover"
          alt={product.name}
          loading="lazy"
        />
        {/* Price Tag */}
        <div className="absolute top-2 right-2 bg-primary text-black font-black text-base px-3 py-1 border-2 border-black rounded-full rotate-6 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          ₹{product.price.toLocaleString("en-IN")}
        </div>
        {/* Instant download badge */}
        <div className="absolute bottom-2 left-2 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm">
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

        <h3 className="text-xl font-bold font-titan leading-tight mb-1 text-black group-hover:text-primary transition-colors line-clamp-2">
          {product.name}
        </h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2 grow leading-relaxed">
          {product.description}
        </p>

        {/* Actions */}
        <div className="flex gap-2 mt-auto">
          <Link href={`/products/${product.id}`} className="flex-1">
            <button className="w-full py-2.5 px-4 bg-white border-2 border-black text-black text-sm font-bold rounded-lg hover:bg-black hover:text-white transition-colors">
              View Details
            </button>
          </Link>
          <button
            onClick={() => addItem(product)}
            disabled={!product.inStock}
            aria-label={`Add ${product.name} to cart`}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 bg-accent text-white border-2 border-black text-sm font-bold rounded-lg hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-[2px] active:translate-x-[2px] transition-all"
          >
            {product.inStock ? (
              <>
                <ShoppingCart className="w-4 h-4" /> Add
              </>
            ) : (
              "Sold Out"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
