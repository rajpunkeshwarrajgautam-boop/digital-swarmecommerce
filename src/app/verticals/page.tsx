"use client";

import { motion } from "framer-motion";
import { Globe, Shield, Activity, Terminal, Layers, Cpu, Database, Code, Zap } from "lucide-react";
import { ProductGrid } from "@/components/products/ProductGrid";
import { products } from "@/lib/data";
import { seoData } from "@/lib/seo-data";
import { isSellableProductId, sanitizePublicProduct } from "@/lib/catalog-integrity";
import Link from "next/link";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Legal: Shield,
  "Real Estate": Globe,
  Finance: Database,
  Healthcare: Activity,
  "Digital Marketing": Zap,
  Copywriting: Terminal,
  SaaS: Layers,
  "E-commerce": Cpu,
  Recruitment: Code,
  "Home Services": Zap,
};

const verticalCategories = new Set([
  "Legal", "Real Estate", "Finance", "Healthcare", "Digital Marketing",
  "Copywriting", "SaaS", "E-commerce", "Recruitment", "Home Services", "AI Agent",
]);

export default function VerticalsPage() {
  const verticalProducts = products
    .filter((product) => product.inStock && isSellableProductId(product.id) && verticalCategories.has(product.category))
    .map(sanitizePublicProduct);

  return (
    <main className="min-h-screen bg-[#0a0a0b] text-white pt-32 pb-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[40px_40px]" />
      <div className="container mx-auto px-6 relative z-10 w-full max-w-7xl">
        <header className="mb-20">
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col gap-6">
            <div className="flex items-center gap-3"><div className="p-3 bg-primary/10 text-primary rounded-2xl border border-primary/20"><Globe className="w-8 h-8" /></div><span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Industry use cases</span></div>
            <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-[0.85] max-w-4xl">Industry <span className="text-primary">Verticals</span></h1>
            <p className="text-xl text-white/40 max-w-2xl leading-relaxed">Browse approved products and factual use-case pages by sector. These pages describe prompt workflows and digital assets, not autonomous business systems unless a specific SKU explicitly includes one.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
            {seoData.map((vertical, index) => {
              const Icon = iconMap[vertical.industry] || Layers;
              return (
                <Link href={`/solutions/${vertical.slug}`} key={vertical.slug}>
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }} className="p-7 h-full bg-white/5 border border-white/10 rounded-3xl hover:border-primary/40 transition-all group">
                    <Icon className="w-7 h-7 text-primary mb-5" />
                    <h2 className="text-lg font-black uppercase tracking-tight mb-2 group-hover:text-primary transition-colors">{vertical.industry}</h2>
                    <p className="text-xs text-white/35 leading-relaxed">For {vertical.target}</p>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </header>

        <section className="mt-32">
          <div className="flex items-center justify-between mb-12 border-b border-white/10 pb-8">
            <h2 className="text-3xl font-black tracking-tighter">Approved vertical products</h2>
            <span className="text-[10px] font-black uppercase text-white/30 tracking-widest">{verticalProducts.length} available</span>
          </div>
          {verticalProducts.length ? (
            <ProductGrid products={verticalProducts} />
          ) : (
            <div className="p-16 border border-white/10 bg-white/[0.03] rounded-3xl text-center"><Terminal className="w-10 h-10 text-primary mx-auto mb-5" /><h3 className="text-xl font-black text-white mb-2">No verified vertical products available</h3><p className="text-sm text-white/35">Products remain hidden until their delivery and catalog mapping pass verification.</p></div>
          )}
        </section>
      </div>
    </main>
  );
}
