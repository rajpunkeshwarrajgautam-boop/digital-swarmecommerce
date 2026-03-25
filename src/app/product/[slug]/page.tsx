
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
  const { slug } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProduct() {
      if (!slug) return;
      
      try {
        setLoading(true);
        const res = await fetch(`/api/products/${slug}`);
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
  }, [slug]);

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
    <div className="min-h-screen bg-background relative pb-20 pt-8 overflow-hidden">
      <div className="absolute inset-0 bg-swarm-pattern opacity-[0.03] pointer-events-none" />
      
      {/* Breadcrumbs / Back */}
      <div className="container mx-auto px-6 mb-8 relative z-10">
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
          <div className="flex flex-col h-full py-2 relative z-10">
            <div>
              <div className="flex items-center gap-3 mb-6">
                 <span className="bg-primary text-black text-xs font-black px-4 py-1 border-2 border-black uppercase tracking-widest shadow-[4px_4px_0px_#CCFF00]">
                  {product.category}
                </span>
                {product.inStock ? (
                   <span className="text-white text-xs font-black flex items-center gap-2 bg-green-500 px-4 py-1 border-2 border-black uppercase tracking-widest shadow-[4px_4px_0px_#22c55e]">
                    <div className="w-2 h-2 bg-white animate-pulse rounded-full" />
                    Online
                   </span>
                ) : (
                  <span className="text-white text-xs font-black bg-red-500 px-4 py-1 border-2 border-black uppercase tracking-widest shadow-[4px_4px_0px_#ef4444]">Offline</span>
                )}
              </div>

              <h1 className="text-5xl md:text-7xl font-black italic uppercase mb-6 leading-[0.85] tracking-tighter drop-shadow-[4px_4px_0px_rgba(204,255,0,0.2)]">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-6 mb-8 p-4 border border-white/10 bg-black w-fit">
                <span className="text-4xl font-black italic tracking-tighter text-primary">₹{product.price.toLocaleString("en-IN")}</span>
                <div className="flex items-center gap-2 border-l border-white/20 pl-6">
                  <div className="flex">
                    {[1,2,3,4,5].map((s) => (
                        <Star key={s} className={`w-5 h-5 ${s <= Math.round(product.rating) ? 'text-primary fill-primary' : 'text-white/10'}`} />
                    ))}
                  </div>
                  <span className="font-black italic text-lg ml-2">{product.rating}</span>
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

            <div className="prose prose-zinc dark:prose-invert max-w-none mb-10 mt-8">
              {product.description.includes('🚀 DEPLOYMENT GUIDE:') ? (
                <>
                  <p className="text-xl font-medium tracking-wide text-white/70 leading-relaxed mb-8">
                    {product.description.split('🚀 DEPLOYMENT GUIDE:')[0]}
                  </p>
                  <div className="mt-8 border-4 border-[#333] shadow-[8px_8px_0px_#000] bg-zinc-950 p-0 overflow-hidden">
                    <div className="bg-[#333] px-6 py-4 flex items-center gap-3">
                      <BookOpen className="w-5 h-5 text-white" /> 
                      <h3 className="text-xl font-black uppercase tracking-widest text-white m-0">Deployment Guide</h3>
                    </div>
                    <div className="text-sm text-primary font-bold leading-relaxed whitespace-pre-wrap font-mono p-6">
                      {product.description.split('🚀 DEPLOYMENT GUIDE:')[1].trim()}
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-xl font-medium tracking-wide text-white/70 leading-relaxed">
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
                <div className="mt-12 bg-black/40 border border-white/5 p-8">
                  <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-6">System Capabilities</h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none p-0 m-0">
                    {product.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-4 text-sm font-bold tracking-wide text-white/70">
                        <span className="w-6 h-6 bg-primary/10 border border-primary text-primary flex items-center justify-center text-[10px] shrink-0 mt-0">
                          {i + 1}
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Specifications Grid */}
              {product.specs && (
                <div className="mt-12">
                  <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-6">Technical Architecture</h3>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
                    {Object.entries(product.specs).map(([key, value]) => (
                      <div key={key} className="flex flex-col border-b-2 border-white/10 pb-2 m-0! group hover:border-primary transition-colors">
                        <span className="font-black uppercase tracking-widest text-[#a855f7] text-[10px] mb-1">{key}</span>
                        <span className="text-white font-mono">{value as string}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="space-y-8 mt-12">
              <AddToCartButton product={product} />

              {/* Trust Signals */}
              <div className="grid grid-cols-3 gap-4 border-t-2 border-white/10 pt-8">
                <div className="flex flex-col items-center text-center gap-3 group">
                  <div className="p-4 border-2 border-white/20 bg-black text-primary group-hover:border-primary transition-colors shadow-[4px_4px_0px_#000]">
                    <Truck className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/50">Instant Sync</span>
                </div>
                <div className="flex flex-col items-center text-center gap-3 group">
                  <div className="p-4 border-2 border-white/20 bg-black text-[#a855f7] group-hover:border-[#a855f7] transition-colors shadow-[4px_4px_0px_#000]">
                    <Shield className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/50">Verified Intel</span>
                </div>
                <div className="flex flex-col items-center text-center gap-3 group">
                  <div className="p-4 border-2 border-white/20 bg-black text-blue-500 group-hover:border-blue-500 transition-colors shadow-[4px_4px_0px_#000]">
                    <RotateCcw className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/50">Support</span>
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

