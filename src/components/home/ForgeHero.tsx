"use client";

import React from "react";
import { motion } from "framer-motion";
import { ForgeButton } from "@/components/ui/ForgeButton";
import { GlassCard } from "@/components/ui/GlassCard";
import { Cpu, Zap, Shield, Sparkles, Terminal } from "lucide-react";
import { useForgeStore } from "@/lib/forge-store";

export const ForgeHero = () => {
  const toggleConcierge = useForgeStore((state) => state.toggleConcierge);

  return (
    <section className="relative min-h-svh w-full flex items-center justify-center overflow-hidden bg-[#0a0a0f] py-40">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent/5 blur-[100px] rounded-full" />
        
        {/* Technical Grid/Lines Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{ 
            backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90 text, #fff 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }} 
        />
      </div>

      <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center">
        {/* Launch Status Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
          </span>
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/50">
            System Protocol 2.0 Active
          </span>
        </motion.div>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-6xl md:text-8xl lg:text-[10rem] font-outfit font-black italic tracking-tighter leading-[0.8] uppercase mb-8"
        >
          Materialize <br />
          <span className="text-white/20">Architectural</span> <br />
          <span className="text-primary glow-text">Protocols</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="max-w-2xl text-lg md:text-xl text-white/40 font-inter mb-12"
        >
          Zero-friction deployment for high-performance developer stacks. Hardened, modular, and AI-native architecture for the next era of software.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-6 mb-24"
        >
          <ForgeButton variant="primary" onClick={() => (window.location.href = "#products")}>
            Materialize Stack
          </ForgeButton>
          <ForgeButton variant="outline" onClick={toggleConcierge}>
            <Sparkles className="w-4 h-4 mr-2" />
            Forge Concierge
          </ForgeButton>
        </motion.div>

        {/* Quick Insights Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
          <InsightCard 
            icon={<Cpu className="w-5 h-5 text-accent" />}
            label="Forge Stability"
            value="99.98%"
            delay={0.8}
          />
           <InsightCard 
            icon={<Zap className="w-5 h-5 text-primary" />}
            label="Deployment Velocity"
            value="< 480ms"
            delay={0.9}
          />
           <InsightCard 
            icon={<Shield className="w-5 h-5 text-green-400" />}
            label="Verified Security"
            value="SOC2 Tier 1"
            delay={1.0}
          />
        </div>
      </div>
    </section>
  );
};

const InsightCard = ({ icon, label, value, delay }: { icon: React.ReactNode, label: string, value: string, delay: number }) => (
  <GlassCard delay={delay} className="flex flex-col items-center gap-2 text-center py-8">
    <div className="p-3 bg-white/5 rounded-full mb-2">
      {icon}
    </div>
    <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/30">{label}</span>
    <span className="text-2xl font-outfit font-black italic text-white uppercase">{value}</span>
  </GlassCard>
);
