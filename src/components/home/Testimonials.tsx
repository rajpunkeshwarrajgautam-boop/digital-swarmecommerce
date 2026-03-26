"use client";

import { motion } from "framer-motion";
import { Quote, Star, ShieldCheck, TrendingUp, Zap } from "lucide-react";

const testimonials = [
  {
    name: "ALEX RIVERA",
    role: "Lead Architect @ CipherStream",
    content: "The Digital Swarm Next.js kit saved us 150+ hours of groundwork. The architectural patterns are elite and production-hardened. Deployed to prod in 2 days flat.",
    rating: 5,
    avatar: "AR",
    metric: "150+ hrs saved",
    tag: "BOILERPLATE"
  },
  {
    name: "SARAH CHEN",
    role: "Founding Engineer @ NexusAI",
    content: "Absolute best-in-class AI agent templates. Clean, modular, and performant. This is how modern software should be built. The Swarm is the only marketplace I trust.",
    rating: 5,
    avatar: "SC",
    metric: "4 agents shipped",
    tag: "AI AGENTS"
  },
  {
    name: "DAVID HOFFMAN",
    role: "CTO @ BlackBox Lab",
    content: "We've integrated five different protocols from the Swarm. The consistency and visual quality are unmatched in the marketplace. Our dev velocity doubled.",
    rating: 5,
    avatar: "DH",
    metric: "2x dev velocity",
    tag: "UI KITS"
  },
  {
    name: "PRIYA SHARMA",
    role: "Senior Frontend Dev @ VortexIO",
    content: "The dashboard template alone was worth the entire investment. Obsessive attention to dark mode detail, monospace typography, and edge-case handling.",
    rating: 5,
    avatar: "PS",
    metric: "∞ ROI",
    tag: "DASHBOARDS"
  },
  {
    name: "MARCUS BLAKE",
    role: "Indie Hacker & SaaS Founder",
    content: "Launched three micro-SaaS products in one month using Swarm boilerplates. The authentication, billing, and DB layers are battle-tested from day one.",
    rating: 5,
    avatar: "MB",
    metric: "3 SaaS in 30 days",
    tag: "BOILERPLATE"
  },
  {
    name: "YUKI TANAKA",
    role: "Product Engineer @ StealthStack",
    content: "Tried 6 other template marketplaces. Nothing comes close. The code is actually readable, extensible, and follows real-world SaaS patterns. Zero refactoring needed.",
    rating: 5,
    avatar: "YT",
    metric: "6 competitors beaten",
    tag: "VERDICT"
  }
];

export function Testimonials() {
  return (
    <section className="bg-[#0a0a0f] py-32 border-t border-white/5 overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl">

        {/* Header */}
        <div className="flex flex-col items-center text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#CCFF00]/10 border border-[#CCFF00]/20 mb-6"
          >
            <ShieldCheck className="w-4 h-4 text-[#CCFF00]" />
            <span className="text-[10px] font-black uppercase tracking-widest text-[#CCFF00]">
              Verified Field Transmissions
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic leading-none mb-6"
          >
            Swarm <br />
            <span className="text-white/20">Intelligence</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-white/40 font-bold uppercase tracking-widest text-xs max-w-md"
          >
            2,000+ developers shipped faster. Read their transmissions.
          </motion.p>
        </div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-3 gap-4 mb-20 border-b border-white/5 pb-20"
        >
          {[
            { icon: <TrendingUp className="w-5 h-5" />, value: "2,000+", label: "Developers" },
            { icon: <Zap className="w-5 h-5" />, value: "4.9 / 5", label: "Average Rating" },
            { icon: <ShieldCheck className="w-5 h-5" />, value: "150hrs+", label: "Saved Per Dev" }
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center text-center p-8 border border-white/5 bg-white/2">
              <div className="text-[#CCFF00] mb-3">{stat.icon}</div>
              <span className="text-3xl md:text-4xl font-black italic text-white tracking-tighter">{stat.value}</span>
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 mt-2">{stat.label}</span>
            </div>
          ))}
        </motion.div>

        {/* Testimonial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="p-8 bg-white/3 border border-white/10 group hover:bg-white/6 hover:border-[#CCFF00]/20 transition-all relative flex flex-col"
            >
              {/* Tag */}
              <span className="text-[8px] font-black uppercase tracking-[0.3em] text-[#CCFF00]/60 mb-4 inline-block">
                {t.tag}
              </span>

              <Quote className="absolute top-6 right-6 w-8 h-8 text-white/5 group-hover:text-[#CCFF00]/10 transition-colors" />

              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {[...Array(t.rating)].map((_, idx) => (
                  <Star key={idx} className="w-3 h-3 fill-[#CCFF00] text-[#CCFF00]" />
                ))}
              </div>

              {/* Content */}
              <p className="font-bold uppercase italic tracking-tight text-white/70 mb-8 leading-relaxed text-sm grow">
                &quot;{t.content}&quot;
              </p>

              {/* Metric Badge */}
              <div className="mb-8 inline-flex items-center gap-2 px-3 py-1.5 bg-[#CCFF00]/10 border border-[#CCFF00]/20 w-fit">
                <TrendingUp className="w-3 h-3 text-[#CCFF00]" />
                <span className="text-[9px] font-black uppercase tracking-widest text-[#CCFF00]">{t.metric}</span>
              </div>

              {/* Author */}
              <div className="flex items-center gap-4 mt-auto pt-6 border-t border-white/5">
                <div className="w-10 h-10 bg-[#CCFF00]/10 border border-[#CCFF00]/20 flex items-center justify-center text-[10px] font-black italic text-[#CCFF00] shrink-0">
                  {t.avatar}
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-white">{t.name}</h4>
                  <p className="text-[9px] font-black uppercase tracking-widest text-white/30 mt-0.5">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
