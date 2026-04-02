"use client";

import { use } from "react";
import { motion } from "framer-motion";
import { Terminal, Shield, Activity, Layers } from "lucide-react";
import { seoData } from "@/lib/seo-data";
import { products } from "@/lib/data";
import { ProductGrid } from "@/components/products/ProductGrid";
import Link from "next/link";
import { ForgeButton } from "@/components/ui/ForgeButton";

/**
 * Dynamic Elite Vertical Protocol (Full Completion Milestone)
 * Renders an industry-specific "Forge" landing page for any industry slug in seo-data.ts.
 */
export default function IndustryProtocolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const metadata = seoData.find(s => s.slug === slug || s.slug === `ai-for-${slug}`);
  
  // Filter for relevant industry products
  const industryProducts = products.filter(p => 
    p.category?.toLowerCase() === metadata?.industry.toLowerCase() ||
    p.category === "Boilerplates"
  ).slice(0, 4);

  if (!metadata) return (
    <div className="h-screen bg-[#0a0a0f] flex items-center justify-center text-white/20 italic">
      404: SECTOR_NOT_FOUND
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white pt-40 pb-32 relative overflow-hidden">
      {/* Background Cyber-Grids */}
      <div className="absolute inset-x-0 top-0 h-[800px] bg-linear-to-b from-primary/10 to-transparent pointer-events-none opacity-40 animate-pulse" />
      <div className="absolute top-0 right-0 w-1/2 h-screen bg-indigo-500/5 blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <header className="space-y-12 mb-32">
          {/* Industry Breadcrumb */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
             <div className="p-3 bg-primary/20 border border-primary/20 text-primary">
                <Terminal className="w-5 h-5" />
             </div>
             <span className="text-[10px] font-black uppercase tracking-[0.4em] italic text-primary/60">
                Sector_Protocol // {metadata.industry} 
             </span>
          </motion.div>

          {/* Elite Title */}
          <div className="space-y-6">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-7xl md:text-9xl font-black italic uppercase tracking-tighter leading-[0.8] max-w-5xl"
            >
              {metadata.industry} <span className="text-secondary italic drop-shadow-[0_0_40px_rgba(255,107,53,0.3)]">Intelligence</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-2xl text-white/40 font-bold max-w-2xl leading-relaxed italic border-l-2 border-white/10 pl-8"
            >
              Building the future of {metadata.target.toLowerCase()} with elite multi-agent frameworks.
            </motion.p>
          </div>

          <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ delay: 0.2 }}
             className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12"
          >
             {[
               { icon: Shield, label: "Compliance", val: "Elite_Grade" },
               { icon: Activity, label: "Latency", val: "0.24ms_Core" },
               { icon: Layers, label: "Sync", val: "Multi_Thread" }
             ].map((stat, i) => (
                <div key={i} className="p-10 border border-white/5 bg-white/2 backdrop-blur-2xl relative overflow-hidden group">
                   <div className="absolute top-0 right-0 w-12 h-12 border-t border-r border-white/10 transition-all group-hover:border-primary" />
                   <stat.icon className="w-8 h-8 text-secondary mb-6" />
                   <div className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30 mb-1">{stat.label}</div>
                   <div className="text-xl font-black italic uppercase text-white">{stat.val}</div>
                </div>
             ))}
          </motion.div>
        </header>

        {/* Dynamic Context */}
        <section className="mb-40 grid grid-cols-1 lg:grid-cols-12 gap-20">
           <div className="lg:col-span-12 space-y-12">
              <div className="flex items-center gap-6 pb-6 border-b border-white/5">
                 <h2 className="text-4xl font-black italic uppercase tracking-tighter">Mission_Protocol</h2>
                 <div className="h-px bg-white/10 flex-1" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                 <div className="space-y-6">
                    <h3 className="text-xl font-black text-secondary italic uppercase tracking-widest">Architectural_Vison</h3>
                    <p className="text-white/40 leading-relaxed text-sm font-bold uppercase tracking-wide italic">
                       Deploying autonomous agentic frameworks for {metadata.target} to minimize cognitive load and maximize deployment speed. {metadata.description}
                    </p>
                 </div>
                 <div className="p-8 bg-black/40 border border-[#CCFF00]/10 italic">
                    <p className="text-[10px] font-black text-[#CCFF00] uppercase tracking-widest leading-loose">
                       KEYWORDS: {metadata.keywords}
                    </p>
                 </div>
              </div>
           </div>
        </section>

        {/* Skeletons Section */}
        <section className="space-y-16">
           <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b-2 border-white/5 pb-12">
              <div className="space-y-2">
                 <h2 className="text-6xl font-black italic uppercase tracking-tighter">Protocol_Assets</h2>
                 <p className="text-[10px] font-black uppercase text-white/30 tracking-[0.4em] italic">Pre-Architected Vertical Skeletons v2.4</p>
              </div>
              <Link href="/products">
                 <ForgeButton className="px-10 py-6 text-sm">Registry_Hub</ForgeButton>
              </Link>
           </div>
           
           <ProductGrid products={industryProducts} />
        </section>

      </div>
    </div>
  );
}
