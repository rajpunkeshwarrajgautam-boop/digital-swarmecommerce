"use client";

import { motion } from "framer-motion";
import { Cpu, Network, Zap, Shield, ArrowRight, Share2 } from "lucide-react";
import { ProductGrid } from "@/components/products/ProductGrid";
import { products } from "@/lib/data";

export default function NeuralSwarmsPage() {
  // Filtering for swarm-like agents
  const swarmProducts = products.filter(p => p.category === "AI Agents" && (p.name.toLowerCase().includes('swarm') || p.name.toLowerCase().includes('agent')));

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-32 pb-24 relative overflow-hidden">
      {/* Dark themed for Neural Swarms */}
      <div className="absolute inset-0 bg-swarm-pattern opacity-[0.1] pointer-events-none" />
      <div className="absolute inset-0 bg-linear-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10 w-full max-w-7xl">
        <header className="mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col gap-8"
          >
            <div className="flex items-center gap-4">
              <div className="p-4 bg-primary/20 text-primary rounded-full border border-primary/30 animate-pulse">
                <Network className="w-10 h-10" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Collective Intelligence</span>
                <span className="text-xs font-bold text-white/40 uppercase tracking-widest">Protocol Series_04</span>
              </div>
            </div>
            
            <h1 className="text-7xl md:text-9xl font-black italic uppercase tracking-tighter leading-[0.8] max-w-5xl">
              Neural <span className="text-primary italic underline decoration-8 underline-offset-10">Swarms</span>
            </h1>
            <p className="text-2xl text-white/60 font-bold tracking-tight max-w-3xl leading-snug">
              Multi-agent coordination protocols. Deploy distributed swarm intelligence frameworks built for autonomous decision-making at scale.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-16">
             <SwarmStat label="Latency" value="< 40ms" />
             <SwarmStat label="Autonomy" value="Level 5" />
             <SwarmStat label="Security" value="Zero Trust" />
             <SwarmStat label="Nodes" value="Infinite" />
          </div>
        </header>

        <section>
          <div className="flex items-center justify-between mb-12 border-b-4 border-white/10 pb-10">
            <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white">Swarm Assets</h2>
            <div className="flex items-center gap-4">
               <span className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-primary">Status: Operational</span>
            </div>
          </div>
          <ProductGrid products={swarmProducts} />
        </section>
      </div>
    </div>
  );
}

function SwarmStat({ label, value }: { label: string, value: string }) {
  return (
    <div className="p-6 bg-white/5 border border-white/10 rounded-[2rem] hover:bg-white/10 transition-all">
       <p className="text-xs font-black uppercase tracking-widest text-white/30 mb-2">{label}</p>
       <p className="text-3xl font-black italic text-primary uppercase">{value}</p>
    </div>
  );
}
