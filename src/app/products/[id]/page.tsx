
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Star, Shield, RotateCcw, Truck, AlertCircle } from "lucide-react";
import AddToCartButton from "./AddToCartButton";
import { RelatedProducts } from "@/components/products/RelatedProducts";
import { Product } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { QuantumProductView } from "@/components/products/QuantumProductView";

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProduct() {
      if (!id) return;
      
      try {
        setLoading(true);
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) {
            if (res.status === 404) throw new Error("Product not found");
            throw new Error("Failed to fetch product");
        }
        const data = await res.json();
        setProduct(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-24 min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 animate-pulse">
            <div className="space-y-4">
                <div className="aspect-square bg-secondary/50 rounded-2xl"></div>
                <div className="grid grid-cols-4 gap-4">
                    {[1,2,3,4].map(i => <div key={i} className="aspect-square bg-secondary/30 rounded-lg"></div>)}
                </div>
            </div>
            <div className="space-y-6 py-8">
                <div className="h-8 bg-secondary/50 w-1/3 rounded-full"></div>
                <div className="h-12 bg-secondary/50 w-3/4 rounded-lg"></div>
                <div className="h-8 bg-secondary/30 w-1/4 rounded-lg"></div>
                <div className="space-y-2 pt-8">
                    <div className="h-4 bg-secondary/30 w-full rounded"></div>
                    <div className="h-4 bg-secondary/30 w-full rounded"></div>
                    <div className="h-4 bg-secondary/30 w-2/3 rounded"></div>
                </div>
            </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-24 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <AlertCircle className="w-16 h-16 text-muted-foreground mb-4 opacity-20" />
        <h1 className="text-2xl font-bold mb-2">Product Not Found</h1>
        <p className="text-muted-foreground mb-8">{error || "The product you're looking for doesn't exist."}</p>
        <Link href="/products">
            <Button>Back to Catalog</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 pt-8">
      
      {/* Breadcrumbs / Back */}
      <div className="container mx-auto px-4 mb-8">
        <Link href="/products" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group">
          <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Catalog
        </Link>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          
          {/* Left: Quantum Product View (Signature Moment) */}
          <div className="space-y-4 perspective-1000">
            <QuantumProductView image={product.image} name={product.name} />
          </div>

          {/* Right: Product Info */}
          <div className="flex flex-col h-full py-2">
            <div>
              <div className="flex items-center gap-2 mb-4">
                 <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-primary/20">
                  {product.category}
                </span>
                {product.inStock ? (
                   <span className="text-green-500 text-xs font-medium flex items-center gap-1 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
                    ● In Stock
                   </span>
                ) : (
                  <span className="text-red-500 text-xs font-medium bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">Out of Stock</span>
                )}
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight bg-clip-text text-transparent bg-linear-to-r from-foreground to-foreground/70">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-4 mb-8">
                <span className="text-3xl font-bold text-primary">₹{product.price}</span>
                <div className="flex items-center gap-1 border-l border-border pl-4">
                  <div className="flex">
                    {[1,2,3,4,5].map((s) => (
                        <Star key={s} className={`w-4 h-4 ${s <= Math.round(product.rating) ? 'text-yellow-500 fill-yellow-500' : 'text-muted'}`} />
                    ))}
                  </div>
                  <span className="font-medium ml-2">{product.rating}</span>
                  <span className="text-muted-foreground text-sm ml-1">(124 reviews)</span>
                </div>
              </div>
            </div>

            <div className="prose prose-zinc dark:prose-invert max-w-none mb-8">
              <p className="text-lg text-muted-foreground leading-relaxed">
                {product.description}
              </p>
              
              {/* Features List */}
              {product.features && product.features.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-xl font-bold mb-4">Key Features</h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 list-none p-0 m-0">
                    {product.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="mt-1 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Specifications Grid */}
              {product.specs && (
                <div className="mt-8">
                  <h3 className="text-xl font-bold mb-4">Technical Specifications</h3>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
                    {Object.entries(product.specs).map(([key, value]) => (
                      <div key={key} className="flex flex-col border-b border-border/50 pb-2">
                        <span className="font-medium text-foreground">{key}</span>
                        <span className="text-muted-foreground">{value as string}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="space-y-8 mt-auto">
              <AddToCartButton product={product} />

              {/* Trust Signals */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-border">
                <div className="flex flex-col items-center text-center gap-2 group">
                  <div className="p-3 rounded-full bg-secondary text-primary group-hover:scale-110 transition-transform">
                    <Truck className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">Free Global Shipping</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2 group">
                  <div className="p-3 rounded-full bg-secondary text-primary group-hover:scale-110 transition-transform">
                    <Shield className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">2-Year Warranty</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2 group">
                  <div className="p-3 rounded-full bg-secondary text-primary group-hover:scale-110 transition-transform">
                    <RotateCcw className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">30-Day Returns</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Pass ID filtering to related products to avoid showing current product */}
        <RelatedProducts category={product.category} currentProductId={product.id} />
      </div>
    </div>
  );
}
