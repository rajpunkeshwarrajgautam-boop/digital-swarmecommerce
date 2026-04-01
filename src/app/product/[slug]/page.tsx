"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Shield, RotateCcw, Truck, AlertCircle, ExternalLink, Eye, BookOpen, Terminal, ArrowRight } from "lucide-react";
import AddToCartButton from "./AddToCartButton";
import { RelatedProducts } from "@/components/products/RelatedProducts";
import { Product } from "@/lib/types";
import { AIAnalyst } from "@/components/forge/AIAnalyst";
import { ForgeButton } from "@/components/ui/ForgeButton";
import { GlassCard } from "@/components/ui/GlassCard";
import { QuantumProductView } from "@/components/products/QuantumProductView";
import { ScarcityEngine } from "@/components/products/ScarcityEngine";
import { ReviewSystem } from "@/components/products/ReviewSystem";
import { useSwarmSWR } from "@/hooks/useSwarmSWR";

export default function ProductPage() {
  const { slug } = useParams();
  const { data: product, isLoading: loading, error: swrError } = useSwarmSWR<Product>(slug ? `/api/products/${slug}` : null);
  const error = swrError?.message || "";


  if (loading) {
    return (
      <div className="container mx-auto px-6 py-32 min-h-screen bg-[#0a0a0f]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 animate-pulse">
            <div className="space-y-6">
                <div className="aspect-square bg-white/5 border border-white/5 rounded-sm"></div>
                <div className="grid grid-cols-4 gap-4">
                    {[1,2,3,4].map(i => <div key={i} className="aspect-square bg-white/5 rounded-sm"></div>)}
                </div>
            </div>
            <div className="space-y-8 py-8">
                <div className="h-4 bg-white/5 w-1/4"></div>
                <div className="h-20 bg-white/5 w-full"></div>
                <div className="h-12 bg-white/5 w-1/3"></div>
                <div className="space-y-4 pt-12">
                    <div className="h-4 bg-white/5 w-full"></div>
                    <div className="h-4 bg-white/5 w-full"></div>
                    <div className="h-4 bg-white/5 w-2/3"></div>
                </div>
            </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-6 py-32 text-center min-h-[60vh] flex flex-col items-center justify-center bg-[#0a0a0f]">
        <div className="w-20 h-20 rounded-full border border-white/5 flex items-center justify-center mb-8">
           <AlertCircle className="w-10 h-10 text-white/10" />
        </div>
        <h1 className="text-4xl font-outfit font-black text-white uppercase italic tracking-tighter mb-4">Product Not Found</h1>
        <p className="text-xs font-mono text-white/20 uppercase tracking-[0.4em] mb-12">{error || "The requested item is currently unavailable."}</p>
        <Link href="/products">
            <ForgeButton>Browse All Products</ForgeButton>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative pb-32 pt-16 overflow-hidden">
      {/* Decorative Forge Background */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
        style={{ 
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
        }} 
      />
      
      {/* Breadcrumbs / Back */}
      <div className="container mx-auto px-6 mb-12 relative z-10">
        <Link href="/products" className="text-[10px] font-mono font-black uppercase tracking-[0.4em] text-white/20 hover:text-primary transition-all flex items-center gap-4 group">
          <span className="group-hover:-translate-x-2 transition-transform duration-300">BACK</span> TO SHOP
        </Link>
      </div>

      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          
          {/* Left: Product Viz */}
          <div className="space-y-6">
            <div className="relative group">
               <div className="absolute -inset-1 bg-primary/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
               <QuantumProductView image={product.image} name={product.name} />
            </div>
            
            {/* Tech Specs Summary Table */}
            <GlassCard className="p-6 border-white/5 bg-white/1 overflow-hidden relative">
               <div className="absolute top-0 right-0 p-3 opacity-10">
                  <Terminal className="w-12 h-12 text-white" />
               </div>
               <h4 className="text-[10px] font-mono font-black uppercase text-white/20 tracking-[0.3em] mb-4">Technical Specifications</h4>
               <div className="grid grid-cols-2 gap-y-3">
                  <div className="flex flex-col">
                     <span className="text-[9px] font-mono text-white/10 uppercase mb-1">Architecture</span>
                     <span className="text-[11px] font-mono text-white/60">AI-Native Hybrid</span>
                  </div>
                  <div className="flex flex-col">
                     <span className="text-[9px] font-mono text-white/10 uppercase mb-1">Core Tech</span>
                     <span className="text-[11px] font-mono text-white/60">Next.js 15+ / TS</span>
                  </div>
                  <div className="flex flex-col">
                     <span className="text-[9px] font-mono text-white/10 uppercase mb-1">License</span>
                     <span className="text-[11px] font-mono text-white/60">Commercial Standard</span>
                  </div>
                  <div className="flex flex-col">
                     <span className="text-[9px] font-mono text-white/10 uppercase mb-1">Security</span>
                     <span className="text-[11px] font-mono font-black text-primary italic">FORGE_VERIFIED</span>
                  </div>
               </div>
            </GlassCard>
          </div>

          {/* Right: Forge Intelligence */}
          <div className="flex flex-col h-full relative z-10">
            <div>
              <div className="flex flex-wrap items-center gap-4 mb-8">
                 <div className="px-3 py-1 border border-white/10 bg-white/5 text-white/60 text-[11px] font-mono font-black uppercase tracking-widest italic">
                  {product.category}
                </div>
                {product.inStock ? (
                   <div className="px-3 py-1 border border-primary/20 bg-primary/5 text-primary text-[9px] font-mono font-black uppercase tracking-widest flex items-center gap-2 italic">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                    In Stock
                   </div>
                ) : (
                  <div className="px-3 py-1 border border-red-500/20 bg-red-500/5 text-red-500 text-[9px] font-mono font-black uppercase tracking-widest italic">Inventory Depleted</div>
                )}
              </div>

              <h1 className="text-6xl md:text-8xl font-outfit font-black italic uppercase mb-8 leading-[0.85] tracking-tighter text-white">
                {product.name}
              </h1>
              
              <div className="flex flex-wrap items-end gap-10 mb-12">
                <div className="flex flex-col">
                  <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest mb-1">Price Tracking</p>
                  <div className="flex items-baseline gap-4">
                    <span className="text-5xl font-outfit font-black italic tracking-tighter text-primary">₹{product.price.toLocaleString("en-IN")}</span>
                    {product.originalPrice && (
                      <span className="text-xl text-white/20 line-through font-outfit font-bold italic tracking-tighter">₹{product.originalPrice.toLocaleString("en-IN")}</span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-4 pb-1">
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map((s) => (
                        <div key={s} className={`w-1.5 h-6 ${s <= Math.round(product.rating) ? 'bg-primary' : 'bg-white/5'}`} />
                    ))}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-mono text-white/20 uppercase leading-none mb-1">Customer Rating</span>
                    <span className="font-outfit font-black italic text-xl text-white leading-none">{product.rating}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mt-8">
                {product.demoUrl && (
                  <a href={product.demoUrl} target="_blank" rel="noopener noreferrer">
                    <button className="flex items-center gap-3 px-6 py-3 border border-white/10 bg-white/5 hover:bg-white/10 hover:border-primary/40 text-white/60 hover:text-white transition-all text-[10px] font-mono font-black uppercase tracking-widest rounded-sm">
                      <Eye className="w-4 h-4 text-primary" /> View Live Demo
                    </button>
                  </a>
                )}
                <button className="flex items-center gap-3 px-6 py-3 text-white/20 hover:text-primary transition-all text-[10px] font-mono font-black uppercase tracking-widest">
                  <ExternalLink className="w-3.5 h-3.5" /> Core_Manifest.json
                </button>
              </div>

              {/* Scarcity Engine (Industrial Refinement) */}
              {(product.scarcityStock || product.isFeatured) && (
                <div className="mt-12 bg-white/2 border border-white/5 p-6 relative overflow-hidden group">
                   <div className="absolute top-0 left-0 w-1 h-full bg-accent opacity-40 group-hover:opacity-100 transition-opacity" />
                   <ScarcityEngine 
                      stockCount={product.scarcityStock} 
                      expiresInHours={product.isFeatured ? 24 : undefined} 
                   />
                </div>
              )}
            </div>

            {/* Description Section */}
            <div className="mt-16 space-y-12">
              <div className="flex flex-col gap-6">
                <h3 className="text-[11px] font-mono font-black text-white/40 uppercase tracking-[0.5em] flex items-center gap-4">
                  <span className="h-px flex-1 bg-white/10" /> 
                  Product Details 
                  <span className="h-px flex-1 bg-white/10" />
                </h3>
                
                {product.description.includes('🚀 DEPLOYMENT GUIDE:') ? (
                  <>
                    <p className="text-lg font-inter text-white/60 leading-relaxed italic border-l border-primary/20 pl-8">
                      {product.description.split('🚀 DEPLOYMENT GUIDE:')[0]}
                    </p>
                    <div className="mt-8 border border-white/10 bg-black/40 p-0 overflow-hidden">
                      <div className="bg-white/5 px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                           <BookOpen className="w-4 h-4 text-primary" /> 
                           <h3 className="text-xs font-mono font-black uppercase tracking-widest text-white m-0">deployment_operations.log</h3>
                        </div>
                        <div className="flex gap-1.5">
                           <div className="w-2 h-2 rounded-full bg-red-500/20" />
                           <div className="w-2 h-2 rounded-full bg-yellow-500/20" />
                           <div className="w-2 h-2 rounded-full bg-green-500/20" />
                        </div>
                      </div>
                      <div className="text-[11px] text-primary/80 font-mono leading-loose whitespace-pre-wrap p-8 bg-black/40 backdrop-blur-3xl">
                        {product.description.split('🚀 DEPLOYMENT GUIDE:')[1].trim()}
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="text-lg font-inter text-white/60 leading-relaxed italic border-l border-primary/20 pl-8">
                    {product.description}
                  </p>
                )}
              </div>
              
              {/* Features Grid */}
              {product.features && product.features.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {product.features.map((feature, i) => (
                      <div key={i} className="group flex items-center gap-4 p-4 border border-white/5 bg-white/1 hover:bg-white/2 transition-all">
                        <div className="w-8 h-8 flex items-center justify-center border border-white/10 text-[9px] font-mono text-white/20 group-hover:text-primary group-hover:border-primary/40 transition-all">
                          {String(i + 1).padStart(2, '0')}
                        </div>
                        <span className="text-[11px] font-mono font-black uppercase tracking-widest text-white/60 group-hover:text-white transition-colors">
                          {feature}
                        </span>
                      </div>
                    ))}
                </div>
              )}
            </div>

            <div className="mt-16">
              <AIAnalyst productName={product.name} category={product.category} />
            </div>

            {/* Final Conversion Actions */}
            <div className="mt-20 space-y-10">
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex-1">
                   <AddToCartButton product={product} />
                </div>
                <ForgeButton 
                   className="flex-1 py-6 text-xl shadow-[0_20px_60px_rgba(255,107,53,0.2)]"
                   onClick={() => {
                     window.location.href = `/checkout?product=${product.id}`;
                   }}
                >
                  Link Protocols <ArrowRight className="w-5 h-5 ml-4 inline-block" />
                </ForgeButton>
              </div>

              {/* Secure Trust Protocol */}
              <div className="grid grid-cols-3 gap-8 py-10 border-y border-white/5">
                <div className="flex flex-col items-center gap-4 group">
                  <Truck className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                  <span className="text-[9px] font-mono font-black uppercase tracking-[0.2em] text-white/20 text-center">Instant Delivery</span>
                </div>
                <div className="flex flex-col items-center gap-4 group text-center">
                  <Shield className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                  <span className="text-[9px] font-mono font-black uppercase tracking-[0.2em] text-white/20">Secure Payments</span>
                </div>
                <div className="flex flex-col items-center gap-4 group text-center">
                  <RotateCcw className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                  <span className="text-[9px] font-mono font-black uppercase tracking-[0.2em] text-white/20">Satisfaction Guaranteed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Swarm Intelligence Layers */}
        <div className="mt-40 space-y-40">
           <ReviewSystem productId={product.id} />
           <div className="border-t border-white/5 pt-40">
              <RelatedProducts category={product.category} currentProductId={product.id} />
           </div>
        </div>
      </div>
    </div>
  );
}

