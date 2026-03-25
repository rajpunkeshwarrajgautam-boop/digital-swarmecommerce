"use client";

import { motion } from "framer-motion";
import { BrainCircuit, Zap, Shield, Cpu, ArrowRight } from "lucide-react";
import { ProductGrid } from "@/components/products/ProductGrid";
import { products } from "@/lib/data";

export default function AIAgentsPage() {
  const agentProducts = products.filter(p => p.category === "AI Agents");

  return (
    <div className="min-h-screen bg-background pt-32 pb-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-swarm-pattern opacity-[0.03] pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10 w-full max-w-7xl">
        <header className="mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col gap-6"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 text-primary rounded-2xl border border-primary/20">
                <BrainCircuit className="w-8 h-8" />
              </div>
              <span className="text-xs font-black uppercase tracking-[0.3em] text-primary italic">Neural Protocol 01</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-[0.85] max-w-4xl">
              Autonomous <span className="text-primary italic">Neural</span> Agents
            </h1>
            <p className="text-xl text-muted-foreground font-bold tracking-wide max-w-2xl">
              Production-hardened agentic workflows. Build multi-agent systems, LLM orchestrators, and autonomous bots with elite baseline architectures.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <FeatureCard 
              icon={Zap} 
              title="LLM agnostic" 
              desc="OpenAI, Gemini, and Anthropic ready protocols."
            />
            <FeatureCard 
              icon={Shield} 
              title="Secure Memory" 
              desc="Pre-integrated vector DB and RAG patterns."
            />
            <FeatureCard 
              icon={Cpu} 
              title="Edge Optimized" 
              desc="Low-latency runtime for high-velocity swarms."
            />
          </div>
        </header>

        <section>
          <div className="flex items-center justify-between mb-12 border-b-2 border-secondary/5 pb-8">
            <h2 className="text-3xl font-black italic uppercase tracking-tighter">Available Agents</h2>
            <span className="text-[10px] font-black uppercase text-secondary/40 tracking-widest">{agentProducts.length} ACTIVE ASSETS</span>
          </div>
          <ProductGrid products={agentProducts} />
        </section>
      </div>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="p-6 bg-white border border-secondary/5 rounded-2xl hover:border-primary/20 transition-all flex flex-col gap-3">
      <Icon className="w-6 h-6 text-primary" />
      <h3 className="font-black uppercase italic text-sm tracking-tight">{title}</h3>
      <p className="text-xs text-muted-foreground font-bold leading-relaxed">{desc}</p>
    </div>
  );
}
