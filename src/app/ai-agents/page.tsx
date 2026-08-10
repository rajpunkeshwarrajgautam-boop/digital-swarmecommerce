"use client";

import { motion } from "framer-motion";
import { BrainCircuit, FileArchive, ShieldCheck, Wrench } from "lucide-react";
import { ProductGrid } from "@/components/products/ProductGrid";
import { products } from "@/lib/data";
import { isSellableProductId, sanitizePublicProduct } from "@/lib/catalog-integrity";

export default function AIAgentsPage() {
  const agentProducts = products
    .filter((product) => product.inStock && isSellableProductId(product.id) && ["AI Agent", "AI Agents"].includes(product.category))
    .map(sanitizePublicProduct);

  return (
    <main className="min-h-screen bg-background pt-32 pb-24 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10 w-full max-w-7xl">
        <header className="mb-20">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-6">
            <div className="flex items-center gap-3"><div className="p-3 bg-primary/10 text-primary border border-primary/20"><BrainCircuit className="w-8 h-8" /></div><span className="text-xs font-black uppercase tracking-[0.3em] text-primary">AI agent assets</span></div>
            <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-[0.85] max-w-4xl">Agent-oriented <span className="text-primary">Digital Assets</span></h1>
            <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">Browse approved downloadable assets intended to help you build or operate AI-agent workflows. Each product page states whether the deliverable is code, a ZIP, prompts, or another format.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <FeatureCard icon={FileArchive} title="Exact delivery type" desc="The product page identifies the file or asset format before checkout." />
            <FeatureCard icon={Wrench} title="Bring-your-own services" desc="API keys, model accounts and third-party integrations are yours unless a SKU explicitly states otherwise." />
            <FeatureCard icon={ShieldCheck} title="Verified catalog mapping" desc="Unavailable or placeholder SKUs are removed from sale instead of being represented as working products." />
          </div>
        </header>

        <section>
          <div className="flex items-center justify-between mb-12 border-b border-white/5 pb-8"><h2 className="text-3xl font-black tracking-tighter">Available products</h2><span className="text-[10px] font-black uppercase text-secondary/40 tracking-widest">{agentProducts.length} verified listings</span></div>
          {agentProducts.length ? <ProductGrid products={agentProducts} /> : <div className="p-12 border border-white/10 text-white/40">No verified AI-agent products are currently available.</div>}
        </section>
      </div>
    </main>
  );
}

function FeatureCard({ icon: Icon, title, desc }: { icon: React.ElementType; title: string; desc: string }) {
  return <div className="p-6 bg-white border border-secondary/5 hover:border-primary/20 transition-all flex flex-col gap-3"><Icon className="w-6 h-6 text-primary" /><h3 className="font-black uppercase text-sm tracking-tight">{title}</h3><p className="text-xs text-muted-foreground font-bold leading-relaxed">{desc}</p></div>;
}
