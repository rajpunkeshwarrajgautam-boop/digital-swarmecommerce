"use client";

import { motion } from "framer-motion";
import { Shield, Zap, ExternalLink, Code2, Cpu, Globe } from "lucide-react";
import Image from "next/image";
import { GlassCard } from "@/components/ui/GlassCard";
import { ForgeButton } from "@/components/ui/ForgeButton";
import Link from "next/link";

const PROJECTS = [
  {
    id: "swarm-omega",
    title: "Project Omega",
    category: "AI INFRASTRUCTURE",
    description: "A self-healing neural network architecture for heavy industry automation. Integrated with multi-agent orchestration.",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200",
    tags: ["Next.js 16", "Python", "TensorFlow"],
    status: "MISSION_CRITICAL"
  },
  {
    id: "hoxmbot-ui",
    title: "Hoxmbot Core",
    category: "FINTECH SOLUTIONS",
    description: "The ultimate trading bot interface with real-time WebSocket sync and millisecond latency processing.",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=1200",
    tags: ["React 19", "Ethers.js", "Zustand"],
    status: "STABLE"
  },
  {
    id: "digital-vessel",
    title: "Digital Vessel",
    category: "ECOMMERCE FORGE",
    description: "A premium digital asset marketplace architecture designed for high-conversion software sales.",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200",
    tags: ["Supabase", "Stripe", "Clerk"],
    status: "OPERATIONAL"
  }
];

export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-background pt-32 pb-20 relative overflow-hidden">
      {/* Structural Decoration */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-linear-to-b from-primary/5 to-transparent pointer-events-none" />
      <div className="absolute top-1/4 -right-1/4 w-[600px] h-[600px] bg-accent/5 blur-[150px] rounded-full pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Header Section */}
        <div className="max-w-4xl mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-8"
          >
            <Shield className="w-5 h-5 text-primary" />
            <span className="text-[10px] font-mono font-black uppercase tracking-[0.5em] text-white/40 italic">ARCHIVE_01: ELITE_BUILDS</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-9xl font-outfit font-black italic tracking-tighter uppercase leading-[0.8] mb-12"
          >
            Tactical <br />
            <span className="text-primary italic">Portfolio</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/40 text-xl font-inter leading-relaxed max-w-2xl"
          >
            Exploration of high-velocity engineering projects forged by the swarm. Every build represents a standard in performance and visual excellence.
          </motion.p>
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PROJECTS.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + idx * 0.1 }}
            >
              <GlassCard className="p-0 border-white/5 bg-white/2 group h-full flex flex-col overflow-hidden">
                {/* Media Layer */}
                <div className="relative aspect-video overflow-hidden">
                  <Image 
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-background via-background/20 to-transparent opacity-80" />
                  
                  <div className="absolute top-4 left-4 p-2 glass-panel border border-white/10 rounded-lg">
                    <span className="text-[8px] font-mono font-black text-primary uppercase tracking-widest">{project.status}</span>
                  </div>
                </div>

                {/* Content Layer */}
                <div className="p-8 flex flex-col grow">
                  <div className="flex items-center gap-2 mb-4">
                    <Cpu className="w-3 h-3 text-white/20" />
                    <span className="text-[9px] font-mono font-bold text-white/30 uppercase tracking-[0.2em]">{project.category}</span>
                  </div>
                  
                  <h3 className="text-3xl font-outfit font-black italic uppercase tracking-tight text-white mb-4 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  
                  <p className="text-sm text-white/40 font-inter leading-relaxed mb-8 grow">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-8">
                    {project.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-white/5 border border-white/5 rounded text-[10px] font-mono text-white/20">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <Link href={`#`} className="w-full">
                    <button className="w-full py-4 border border-white/10 rounded-xl bg-white/2 hover:bg-primary hover:text-black transition-all flex items-center justify-center gap-3 group/btn">
                      <span className="text-[11px] font-outfit font-black uppercase tracking-widest">Inspect Archive</span>
                      <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                    </button>
                  </Link>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Global Stats Footer Strip */}
        <div className="mt-40 pt-12 border-t border-white/5 flex flex-wrap items-center justify-between gap-12">
          <div className="flex items-center gap-10">
            {[
              { icon: Globe, label: "Live_Nodes", value: "142+" },
              { icon: Zap, label: "Response_Time", value: "14ms" },
              { icon: Code2, label: "Commits_Synced", value: "8.2M" },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <stat.icon className="w-3 h-3 text-primary" />
                  <span className="text-[9px] font-mono font-black text-white/10 uppercase tracking-widest">{stat.label}</span>
                </div>
                <span className="text-xl font-outfit font-black italic text-white/40">{stat.value}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-6">
            <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest italic">Ready to forge your vision?</span>
            <ForgeButton>Start Collaboration</ForgeButton>
          </div>
        </div>
      </div>

      {/* SEO Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "Digital Swarm Project Archive",
            "description": "High-fidelity digital assets and architectural benchmarks forge by the Digital Swarm elite engineering team.",
            "url": "https://digitalswarm.in/portfolio",
            "hasPart": PROJECTS.map(p => ({
              "@type": "CreativeWork",
              "name": p.title,
              "description": p.description,
              "image": p.image
            }))
          })
        }}
      />
    </div>
  );
}
