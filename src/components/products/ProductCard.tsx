"use client";

import { Product } from "@/lib/types";
import { useCartStore } from "@/lib/store";
import Link from "next/link";
import Image from "next/image";
import { Star, ShoppingCart, Eye } from "lucide-react";
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

  return (
    <div className="group relative bg-card border-2 border-border p-4 hover:-translate-y-1 hover:-translate-x-1 transition-all duration-300 rounded-xl overflow-hidden flex flex-col h-full cyber-shadow">

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

        <h3 className="text-xl font-bold font-titan leading-tight mb-1 group-hover:text-primary transition-colors line-clamp-2">
          {product.name}
        </h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2 grow leading-relaxed">
          {product.description}
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-2 mt-auto">
          <Link href={`/products/${product.id}`} className="flex-1">
            <Button variant="outline" className="w-full h-11 border-primary/20 hover:border-primary/50 group/view">
              <Eye className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform text-primary" /> View Details
            </Button>
          </Link>
          <Button
            onClick={() => addItem(product)}
            disabled={!product.inStock}
            variant="neon"
            className="flex-1 h-11"
          >
            {product.inStock ? (
              <>
                <ShoppingCart className="w-4 h-4 mr-2" /> Buy
              </>
            ) : (
              "Sold Out"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
