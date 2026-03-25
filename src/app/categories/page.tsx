"use client";

import { motion } from "framer-motion";
import { Cpu, Code2, LayoutDashboard, Smartphone, Chrome, BrainCircuit, Globe, Rocket } from "lucide-react";
import Link from "next/link";

const categories = [
  {
    id: "ai-agents",
    name: "AI Agents",
    description: "Autonomous neural protocols for workflow automation and LLM orchestration.",
    icon: BrainCircuit,
    count: 12,
    color: "primary",
    href: "/ai-agents"
  },
  {
    id: "software-stacks",
    name: "Software Stacks",
    description: "Full-stack boilerplates and architectural baselines for Next.js, React, and Node.js.",
    icon: Code2,
    count: 24,
    color: "secondary",
    href: "/software-stacks"
  },
  {
    id: "dashboards",
    name: "Dashboards",
    description: "Enterprise-grade admin panels and data visualization environments.",
    icon: LayoutDashboard,
    count: 8,
    color: "primary",
    href: "/products?category=Dashboards"
  },
  {
    id: "mobile-apps",
    name: "Mobile Apps",
    description: "Cross-platform mobile foundations powered by React Native and Expo.",
    icon: Smartphone,
    count: 6,
    color: "secondary",
    href: "/products?category=Mobile"
  },
  {
    id: "neural-swarms",
    name: "Neural Swarms",
    description: "Complex multi-agent systems and swarm intelligence frameworks.",
    icon: Cpu,
    count: 4,
    color: "primary",
    href: "/neural-swarms"
  },
  {
    id: "extensions",
    name: "Extensions",
    description: "Browser-based productivity tools and Manifest V3 templates.",
    icon: Chrome,
    count: 10,
    color: "secondary",
    href: "/products?category=Extensions"
  },
  {
    id: "verticals",
    name: "Verticals",
    description: "Niche-specific solutions for E-commerce, EdTech, and FinTech.",
    icon: Globe,
    count: 15,
    color: "primary",
    href: "/verticals"
  },
  {
    id: "elite-access",
    name: "Elite Access",
    description: "High-tier architectural reviews and custom engineering protocols.",
    icon: Rocket,
    count: 5,
    color: "secondary",
    href: "/elite-access"
  }
];

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-background pt-32 pb-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-swarm-pattern opacity-[0.03] pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10 w-full max-w-7xl">
        <header className="mb-20 text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-6"
          >
            <span className="inline-block bg-primary/10 text-primary border border-primary/20 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">
              The Swarm Index
            </span>
            <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-[0.85]">
              Browse the <span className="text-primary underline decoration-4 underline-offset-8 italic">Library</span>
            </h1>
            <p className="text-xl text-muted-foreground font-bold tracking-wide mt-4">
              Explore our curated collection of production-hardened architectural protocols.
            </p>
          </motion.div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="group relative"
            >
              <Link href={cat.href} className="block h-full">
                <div className="h-full bg-white border border-secondary/5 rounded-[2.5rem] p-8 transition-all duration-500 hover:border-primary/20 hover:shadow-[0_40px_80px_rgba(26,26,46,0.08)] flex flex-col">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 transition-transform group-hover:scale-110 group-hover:rotate-3 ${
                    cat.color === "primary" ? "bg-primary/10 text-primary" : "bg-secondary/5 text-secondary"
                  }`}>
                    <cat.icon className="w-8 h-8" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-4 group-hover:text-primary transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-sm text-muted-foreground font-bold tracking-tight leading-relaxed mb-6">
                      {cat.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-secondary/5">
                    <span className="text-[10px] font-black uppercase tracking-widest text-secondary/40">
                      {cat.count} Protocols
                    </span>
                    <span className="text-primary font-black italic text-xs uppercase group-hover:translate-x-1 transition-transform">
                      Deploy →
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
