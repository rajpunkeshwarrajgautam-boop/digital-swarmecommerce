"use client";

import { motion } from "framer-motion";
import { Globe, Shield, Activity, Terminal, Layers, Cpu, Database, Code, Zap } from "lucide-react";
import { ProductGrid } from "@/components/products/ProductGrid";
import { products } from "@/lib/data";
import { seoData } from "@/lib/seo-data";

const iconMap: Record<string, any> = {
  'Legal': Shield,
  'Real Estate': Globe,
  'Finance': Database,
  'Healthcare': Activity,
  'Digital Marketing': Zap,
  'Copywriting': Terminal,
  'SaaS': Layers,
  'E-commerce': Cpu,
  'Recruitment': Code,
  'Home Services': Zap
};

export default function VerticalsPage() {
  // Filter for products that might already be in the database
  const verticalProducts = products.filter(p => p.category === "Boilerplates" || p.category === "Legal" || p.category === "Finance");

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white pt-32 pb-24 relative overflow-hidden">
      {/* Heavy Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      
      <div className="container mx-auto px-6 relative z-10 w-full max-w-7xl">
        <header className="mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col gap-6"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 text-primary rounded-2xl border border-primary/20 shadow-[0_0_15px_rgba(204,255,0,0.1)]">
                <Globe className="w-8 h-8" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary italic">Sector Specific Protocols</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-[0.85] max-w-4xl">
              Industry <span className="text-primary italic">Verticals</span>
            </h1>
            <p className="text-xl text-white/40 font-bold tracking-wide max-w-2xl italic">
              Niche-optimized architectural skeletons. Specialized templates engineered for the unique requirements of specific market sectors.
            </p>
          </motion.div>

          {/* Industry Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
            {seoData.map((v, i) => {
              const Icon = iconMap[v.industry] || Layers;
              return (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-8 bg-white/5 border border-white/5 rounded-[2rem] hover:border-primary/40 hover:bg-white/[0.07] transition-all group cursor-pointer"
                >
                  <Icon className="w-8 h-8 text-primary mb-6 transition-transform group-hover:scale-110" />
                  <h3 className="text-xl font-black uppercase italic tracking-tighter mb-2 group-hover:text-primary transition-colors">{v.industry}</h3>
                  <p className="text-[10px] text-white/30 font-black uppercase tracking-widest leading-relaxed line-clamp-2">{v.target}</p>
                </motion.div>
              );
            })}
          </div>
        </header>

        {/* Dynamic Solutions Section */}
        <section className="mt-40">
          <div className="flex items-center justify-between mb-12 border-b border-white/10 pb-8">
            <h2 className="text-3xl font-black italic uppercase tracking-tighter">Vertical Skeletons</h2>
            <div className="flex items-center gap-4">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_#CCFF00]" />
              <span className="text-[10px] font-black uppercase text-white/30 tracking-widest">
                {verticalProducts.length > 0 ? `${verticalProducts.length} ACTIVE SOLUTIONS` : "ESTABLISHING SIGNAL..."}
              </span>
            </div>
          </div>
          
          {verticalProducts.length > 0 ? (
            <ProductGrid products={verticalProducts} />
          ) : (
            <div className="p-20 border border-white/5 bg-white/5 rounded-[3rem] text-center">
              <Terminal className="w-12 h-12 text-primary mx-auto mb-6 opacity-40" />
              <h3 className="text-xl font-black uppercase italic tracking-tighter text-white/40">Waiting for Registry Broadcast</h3>
              <p className="text-xs font-bold text-white/20 uppercase tracking-[0.3em] mt-2 italic">Run npx ts-node scripts/final-seed.ts to establish ground connection.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
