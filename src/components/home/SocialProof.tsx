"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    quote: "The Next.js SaaS starter kit saved me 3 weeks of setup time. I launched my MVP the same day I bought it.",
    name: "Arjun Mehta",
    title: "Indie Founder, SaaS startup",
    rating: 5,
    initials: "AM",
    color: "hsl(250,84%,60%)",
  },
  {
    quote: "I downloaded the AI agent boilerplate and had my first customer within 48 hours. The code quality is production-grade.",
    name: "Priya Sharma",
    title: "Freelance Developer",
    rating: 5,
    initials: "PS",
    color: "hsl(160,60%,45%)",
  },
  {
    quote: "Been going through 4 UI kits and this one is by far the cleanest. Dark mode just works, no fixes needed.",
    name: "Rahul Gupta",
    title: "Senior Frontend Engineer",
    rating: 5,
    initials: "RG",
    color: "hsl(30,90%,55%)",
  },
];

const stats = [
  { value: "50,000+", label: "Leads Generated" },
  { value: "₹1 Cr+", label: "Managed Ad Spend" },
  { value: "300%", label: "Avg. ROAS Increase" },
  { value: "100+", label: "Scaling Partners" },
];

const brands = [
  "ALPHA_TECH", "SWARM_LOGISTICS", "NEON_CLOTHING", "CYBER_RETAIL", "NEXUS_FINANCE"
];

export function SocialProof() {
  return (
    <section className="py-32 bg-secondary/5 border-y border-white/5 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
      
      <div className="container mx-auto px-6 relative z-10">
        
        {/* Trusted By Strip */}
        <div className="mb-24 text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 mb-10 italic">Trusted_By_Elite_Growth_Pods</p>
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
                {brands.map((brand, i) => (
                    <span key={i} className="text-xl md:text-2xl font-black italic tracking-tighter uppercase text-white hover:text-primary transition-colors cursor-default">
                        {brand}
                    </span>
                ))}
            </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 mb-32 max-w-6xl mx-auto border-y border-white/5 py-12">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="text-center md:text-left border-l border-primary/20 pl-8"
            >
              <p className="text-4xl md:text-6xl font-black italic tracking-tighter text-primary leading-none mb-2">{stat.value}</p>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 italic">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Section title */}
        <div className="mb-20">
          <h2 className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter text-white leading-none">
            Success_Logs
          </h2>
          <p className="text-primary font-black uppercase tracking-[0.4em] text-[10px] mt-4 italic">Audited_Partner_Performance</p>
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="bg-card border border-border rounded-2xl p-6 flex flex-col gap-4 hover:border-primary/40 transition-colors"
            >
              {/* Stars */}
              <div className="flex gap-0.5">
                {Array.from({ length: t.rating }).map((_, s) => (
                  <Star key={s} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                ))}
              </div>
              {/* Quote */}
              <p className="text-sm text-muted-foreground leading-relaxed grow">
                &quot;{t.quote}&quot;
              </p>
              {/* Author */}
              <div className="flex items-center gap-3 mt-2 border-t border-border pt-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                  style={{ background: t.color }}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="font-semibold text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.title}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
