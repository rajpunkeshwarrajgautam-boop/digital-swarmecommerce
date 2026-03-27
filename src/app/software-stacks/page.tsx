"use client";

import { motion } from "framer-motion";
import { Code2, Layers, Server, Database, ShieldCheck } from "lucide-react";
import { ProductGrid } from "@/components/products/ProductGrid";
import { products } from "@/lib/data";

export default function SoftwareStacksPage() {
  const stackProducts = products.filter(p => p.category === "Boilerplates");

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
              <div className="p-3 bg-secondary/10 text-secondary rounded-none border border-secondary/20">
                <Code2 className="w-8 h-8" />
              </div>
              <span className="text-xs font-black uppercase tracking-[0.3em] text-secondary italic">Architectural Baseline 02</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-[0.85] max-w-4xl">
              Elite <span className="text-secondary italic">Software</span> Stacks
            </h1>
            <p className="text-xl text-muted-foreground font-bold tracking-wide max-w-2xl">
              Production-ready full-stack foundations. Skip the configuration hell and deploy industry-standard architectures for Next.js 15, Vite, and Prisma.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
            <StackFeature 
              icon={Layers} 
              title="Next.js 15 App Router" 
              desc="Latest features, optimized."
            />
            <StackFeature 
              icon={Server} 
              title="Edge Runtime" 
              desc="Global performance default."
            />
            <StackFeature 
              icon={Database} 
              title="Prisma & Supabase" 
              desc="Type-safe data persistence."
            />
            <StackFeature 
              icon={ShieldCheck} 
              title="Clerk Auth" 
              desc="Enterprise user management."
            />
          </div>
        </header>

        <section>
          <div className="flex items-center justify-between mb-12 border-b-2 border-secondary/5 pb-8">
            <h2 className="text-3xl font-black italic uppercase tracking-tighter">Hardened Boilerplates</h2>
            <span className="text-[10px] font-black uppercase text-secondary/40 tracking-widest">{stackProducts.length} ACTIVE STACKS</span>
          </div>
          <ProductGrid products={stackProducts} />
        </section>
      </div>
    </div>
  );
}

function StackFeature({ icon: Icon, title, desc }: { icon: React.ElementType, title: string, desc: string }) {
  return (
    <div className="p-6 bg-white border border-secondary/5 rounded-none hover:border-secondary/20 transition-all flex flex-col gap-3 group">
      <Icon className="w-6 h-6 text-secondary group-hover:scale-110 transition-transform" />
      <h3 className="font-black uppercase italic text-sm tracking-tight">{title}</h3>
      <p className="text-[10px] text-muted-foreground font-bold leading-relaxed">{desc}</p>
    </div>
  );
}
