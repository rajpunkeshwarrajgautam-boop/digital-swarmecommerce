"use client";

import { Product } from "@/lib/types";
import { useCartStore } from "@/lib/store";
import Link from "next/link";
import Image from "next/image";

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <div className="group relative bg-white border-4 border-black p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 transition-all duration-200 rounded-xl overflow-hidden flex flex-col h-full">
        {/* Image Container with Sticker Effect */}
        <div className="relative aspect-square w-full mb-4 bg-muted rounded-lg border-2 border-black overflow-hidden group-hover:rotate-1 transition-transform">
             <Image
                src={product.image}
                fill
                className="object-cover"
                alt={product.name}
              />
              {/* Floating Price Tag */}
              <div className="absolute top-2 right-2 bg-primary text-black font-black text-lg px-3 py-1 border-2 border-black rounded-full rotate-6 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                ₹{product.price}
              </div>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-grow">
            <h3 className="text-2xl font-bold font-titan leading-none mb-2 text-black group-hover:text-primary transition-colors line-clamp-2">
                {product.name}
            </h3>
            <p className="text-sm font-fredoka text-gray-600 mb-4 line-clamp-2 flex-grow">
                {product.description}
            </p>

            {/* Actions */}
            <div className="flex gap-2 mt-auto">
                <Link href={`/products/${product.id}`} className="flex-1">
                    <button className="w-full py-2 px-4 bg-white border-2 border-black text-black font-bold rounded-lg hover:bg-black hover:text-white transition-colors">
                        Details
                    </button>
                </Link>
                <button 
                    onClick={() => addItem(product)}
                    disabled={!product.inStock}
                    className="flex-1 py-2 px-4 bg-accent text-white border-2 border-black font-bold rounded-lg hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-[2px] active:translate-x-[2px] transition-all"
                >
                    {product.inStock ? "Add +" : "Sold Out"}
                </button>
            </div>
        </div>
    </div>
  );
}
