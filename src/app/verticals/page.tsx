"use client";

import { motion } from "framer-motion";
import { Globe, ArrowRight, Activity, Terminal } from "lucide-react";
import { ProductGrid } from "@/components/products/ProductGrid";
import { products } from "@/lib/data";
import { seoData } from "@/lib/seo-data";

export default function VerticalsPage() {
  // Filter for vertical skeletons and boilerplates
  const verticalProducts = products.filter(p => p.category === "Boilerplates" || p.category === "Dashboards" || p.category === "Legal" || p.category === "Finance");

  return (
    <div className="min-h-screen bg-background pt-32 pb-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-swarm-pattern opacity-[0.03] pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10 w-full max-w-7xl">
        <header className="mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col gap-6"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-500/10 text-indigo-600 rounded-2xl border border-indigo-500/20">
                <Globe className="w-8 h-8" />
              </div>
              <span className="text-xs font-black uppercase tracking-[0.3em] text-indigo-600 italic">Sector Specific Protocols</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-[0.85] max-w-4xl">
              Industry <span className="text-secondary italic">Verticals</span>
            </h1>
            <p className="text-xl text-muted-foreground font-bold tracking-wide max-w-2xl">
              Niche-optimized architectural skeletons. Specialized templates engineered for the unique requirements of specific market sectors.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {verticals.map((v, i) => (
              <div key={i} className="p-8 bg-white border border-secondary/5 rounded-[2rem] hover:shadow-xl transition-all">
                <v.icon className="w-8 h-8 text-secondary mb-4" />
                <h3 className="text-xl font-black uppercase italic italic tracking-tighter mb-2">{v.name}</h3>
                <p className="text-xs text-muted-foreground font-bold leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </header>

        <section>
          <div className="flex items-center justify-between mb-12 border-b-2 border-secondary/5 pb-8">
            <h2 className="text-3xl font-black italic uppercase tracking-tighter">Vertical Skeletons</h2>
            <span className="text-[10px] font-black uppercase text-secondary/40 tracking-widest">{verticalProducts.length} ACTIVE SOLUTIONS</span>
          </div>
          <ProductGrid products={verticalProducts} />
        </section>
      </div>
    </div>
  );
}
