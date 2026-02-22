
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Star, Shield, RotateCcw, Truck, AlertCircle, ExternalLink, Eye, BookOpen } from "lucide-react";
import AddToCartButton from "./AddToCartButton";
import { RelatedProducts } from "@/components/products/RelatedProducts";
import { Product } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { QuantumProductView } from "@/components/products/QuantumProductView";
import { ScarcityEngine } from "@/components/products/ScarcityEngine";
import { ReviewSystem } from "@/components/products/ReviewSystem";

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
      } catch (err: unknown) {
        const error = err as Error;
        setError(error.message);
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

              <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-bold text-primary">₹{product.price}</span>
                <div className="flex items-center gap-1 border-l border-border pl-4">
                  <div className="flex">
                    {[1,2,3,4,5].map((s) => (
                        <Star key={s} className={`w-4 h-4 ${s <= Math.round(product.rating) ? 'text-yellow-500 fill-yellow-500' : 'text-muted'}`} />
                    ))}
                  </div>
                  <span className="font-medium ml-2">{product.rating}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mt-6">
                {product.demoUrl && (
                  <a href={product.demoUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="gap-2 border-primary/30 hover:border-primary text-primary">
                      <Eye className="w-4 h-4" /> Live Preview
                    </Button>
                  </a>
                )}
                <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground">
                  <ExternalLink className="w-4 h-4" /> View Source
                </Button>
              </div>

              {/* Scarcity Engine */}
              {(product.scarcityStock || product.isFeatured) && (
                <div className="mt-8 border-t border-border pt-8">
                   <ScarcityEngine 
                      stockCount={product.scarcityStock} 
                      expiresInHours={product.isFeatured ? 24 : undefined} 
                   />
                </div>
              )}
            </div>

            <div className="prose prose-zinc dark:prose-invert max-w-none mb-8 mt-8">
              {product.description.includes('🚀 DEPLOYMENT GUIDE:') ? (
                <>
                  <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                    {product.description.split('🚀 DEPLOYMENT GUIDE:')[0]}
                  </p>
                  <div className="mt-8 p-6 rounded-2xl bg-primary/5 border border-primary/20">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-primary">
                      <BookOpen className="w-5 h-5" /> 
                      Deployment Guide
                    </h3>
                    <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap font-mono bg-black/20 p-4 rounded-xl border border-white/5">
                      {product.description.split('🚀 DEPLOYMENT GUIDE:')[1].trim()}
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              )}
              
              {/* Installation Guide Snippet */}
              {product.installGuide && (
                <div className="mt-8 p-6 rounded-2xl bg-secondary/20 border border-border/50">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary" /> 
                    Installation Preview
                  </h3>
                  <pre className="text-xs bg-black/40 p-4 rounded-xl font-mono text-zinc-400 overflow-x-auto border border-white/5">
                    {product.installGuide}
                  </pre>
                </div>
              )}

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
                      <div key={key} className="flex flex-col border-b border-border/50 pb-2 m-0!">
                        <span className="font-medium text-foreground">{key}</span>
                        <span className="text-muted-foreground">{value as string}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="space-y-8 mt-auto pt-8 border-t border-border">
              <AddToCartButton product={product} />

              {/* Trust Signals */}
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col items-center text-center gap-2 group">
                  <div className="p-3 rounded-full bg-secondary text-primary group-hover:scale-110 transition-transform">
                    <Truck className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">Instant Delivery</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2 group">
                  <div className="p-3 rounded-full bg-secondary text-primary group-hover:scale-110 transition-transform">
                    <Shield className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">Verified Assets</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2 group">
                  <div className="p-3 rounded-full bg-secondary text-primary group-hover:scale-110 transition-transform">
                    <RotateCcw className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">24/7 Support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Related Products */}
        <ReviewSystem productId={product.id} />
        <RelatedProducts category={product.category} currentProductId={product.id} />
      </div>
    </div>
  );
}

