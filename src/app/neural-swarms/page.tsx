"use client";

import { motion } from "framer-motion";
import { Network, FileArchive, Wrench, ShieldCheck } from "lucide-react";
import { ProductGrid } from "@/components/products/ProductGrid";
import { products } from "@/lib/data";
import { isSellableProductId, sanitizePublicProduct } from "@/lib/catalog-integrity";

export default function NeuralSwarmsPage() {
  const swarmProducts = products
    .filter((product) => product.inStock && isSellableProductId(product.id) && ["AI Agent", "AI Agents"].includes(product.category) && /swarm|agent/i.test(product.name))
    .map(sanitizePublicProduct);

  return (
    <main className="min-h-screen bg-[#050505] text-white pt-32 pb-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
      <div className="container mx-auto px-6 relative z-10 w-full max-w-7xl">
        <header className="mb-20">
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col gap-7">
            <div className="flex items-center gap-4"><div className="p-4 bg-primary/10 text-primary rounded-full border border-primary/20"><Network className="w-9 h-9" /></div><span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Swarm & agent collection</span></div>
            <h1 className="text-7xl md:text-9xl font-black italic uppercase tracking-tighter leading-[0.8] max-w-5xl">Neural <span className="text-primary">Swarms</span></h1>
            <p className="text-xl md:text-2xl text-white/55 max-w-3xl leading-snug">A catalog view for Digital Swarm products whose names and scope relate to agents or multi-step AI workflows. It does not claim infinite nodes, Level-5 autonomy, fixed latency, or autonomous decision-making unless an individual deliverable actually implements and documents those capabilities.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-14">
            <Fact icon={FileArchive} title="Deliverable first" body="Every visible SKU maps to a verified storage object." />
            <Fact icon={Wrench} title="Dependencies disclosed" body="Bring-your-own models, APIs and external accounts remain your responsibility unless listed." />
            <Fact icon={ShieldCheck} title="No synthetic telemetry" body="This page shows catalog facts, not invented latency, autonomy or node counts." />
          </div>
        </header>

        <section>
          <div className="flex items-center justify-between mb-12 border-b border-white/10 pb-8"><h2 className="text-4xl font-black tracking-tighter">Available products</h2><span className="text-[10px] font-black uppercase tracking-widest text-white/35">{swarmProducts.length} verified listings</span></div>
          {swarmProducts.length ? <ProductGrid products={swarmProducts} /> : <div className="p-12 border border-white/10 text-white/40">No verified swarm/agent products are currently available.</div>}
        </section>
      </div>
    </main>
  );
}

function Fact({ icon: Icon, title, body }: { icon: React.ElementType; title: string; body: string }) {
  return <div className="p-6 bg-white/5 border border-white/10 rounded-2xl"><Icon className="w-5 h-5 text-primary mb-4" /><h2 className="font-black text-white mb-2">{title}</h2><p className="text-sm text-white/40 leading-relaxed">{body}</p></div>;
}
