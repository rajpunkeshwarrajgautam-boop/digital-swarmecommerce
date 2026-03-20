"use client";

import { Download, Gift, ArrowRight, Zap, Target, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { motion } from "framer-motion";

const freebies = [
  {
    id: "saas-checklist",
    name: "Ultimate SaaS Launch Checklist",
    description: "A comprehensive 150+ point checklist to go from idea to $1k MRR. Used by 500+ founders.",
    icon: <Target className="w-8 h-8 text-primary" />,
    stats: "2.4k Downloads",
    type: "Guide",
    downloadUrl: "/downloads/saas-launch-checklist.txt"
  },
  {
    id: "ai-prompt-library",
    name: "AI Agent Prompt Library",
    description: "Expert-crafted prompts for Claude, GPT-4, and Midjourney to automate your development workflow.",
    icon: <Sparkles className="w-8 h-8 text-accent" />,
    stats: "1.8k Downloads",
    type: "Asset",
    downloadUrl: "/downloads/ai-prompt-library.txt"
  },
  {
    id: "mini-ui-kit",
    name: "Cyberpunk Mini UI Kit",
    description: "A selection of premium React components from our main UI Kit. Buttons, cards, and inputs.",
    icon: <Zap className="w-8 h-8 text-primary" />,
    stats: "3.2k Downloads",
    type: "Code",
    downloadUrl: "/downloads/cyberpunk-mini-ui-kit.tsx"
  },
  {
    id: "tech-stack-audit",
    name: "SaaS Tech Stack Audit 2025",
    description: "A deep-dive research report on the most efficient tools for building high-scale startups in 2025.",
    icon: <Target className="w-8 h-8 text-blue-400" />,
    stats: "New Release",
    type: "Guide",
    downloadUrl: "/downloads/saas-tech-stack-audit.txt"
  },
  {
    id: "design-system-tokens",
    name: "Digital Swarm Design System",
    description: "Figma and CSS design tokens for the ultimate cyberpunk aesthetic. Includes neon palettes and UI elements.",
    icon: <Sparkles className="w-8 h-8 text-amber-400" />,
    stats: "Featured",
    type: "Asset",
    downloadUrl: "/downloads/design-system-tokens.css"
  }
];

export default function FreebiesPage() {
  return (
    <div className="min-h-screen bg-background py-24">
      <div className="container mx-auto px-4">
        
        {/* Hero */}
        <div className="max-w-4xl mx-auto text-center mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold mb-6"
          >
            <Gift className="w-4 h-4" /> 100% FREE RESOURCES
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl md:text-7xl font-black mb-8 tracking-tighter leading-[1.1]"
          >
            Fuel Your Growth Without <span className="text-primary italic">Spending a Rupee.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-muted-foreground leading-relaxed"
          >
            We believe in building in public. Here are the tools, guides, and assets we use to scale our own projects — yours for free.
          </motion.p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {freebies.map((freebie, idx) => (
            <motion.div
              key={freebie.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * idx }}
              className="group relative p-8 rounded-3xl bg-secondary/20 border border-border/50 hover:border-primary/50 transition-all duration-500 overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Gift className="w-24 h-24" />
              </div>
              
              <div className="mb-6 inline-flex p-4 rounded-2xl bg-background border border-border group-hover:scale-110 transition-transform duration-500">
                {freebie.icon}
              </div>
              
              <div className="space-y-4 relative z-10">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest text-primary">{freebie.type}</span>
                  <span className="text-xs text-muted-foreground">{freebie.stats}</span>
                </div>
                <h3 className="text-2xl font-bold tracking-tight group-hover:text-primary transition-colors">{freebie.name}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {freebie.description}
                </p>
                <div className="pt-4">
                  <a 
                    href={freebie.downloadUrl} 
                    download={freebie.downloadUrl.split('/').pop()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full"
                  >
                    <Button variant="outline" className="w-full group/btn gap-2">
                      Download Free <Download className="w-4 h-4 group-hover/btn:translate-y-0.5 transition-transform" />
                    </Button>
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Community Section */}
        <div className="mt-20 sm:mt-32 p-6 sm:p-12 rounded-[2rem] sm:rounded-[3rem] bg-secondary/10 border border-border/50 text-center relative overflow-hidden">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/20 blur-[120px] rounded-full" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-accent/20 blur-[120px] rounded-full" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-6 sm:space-y-8">
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight italic">Join the Swarm</h2>
            <p className="text-base sm:text-lg text-muted-foreground">
              We ship new freebies every Saturday. Join 4,200+ developers getting the edge in their inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full sm:w-80 h-12 sm:h-14 rounded-full bg-background border border-border px-6 focus:outline-hidden focus:ring-2 focus:ring-primary/50 transition-all text-sm"
              />
              <Button className="w-full sm:w-auto h-12 sm:h-14 px-8 rounded-full gap-2 text-sm">
                Join the List <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-[10px] sm:text-xs text-muted-foreground opacity-50 italic">
              No spam. Just code, assets, and value. Unsubscribe anytime.
            </p>
          </div>
        </div>

        {/* Back to Products */}
        <div className="mt-20 text-center">
          <Link href="/products" className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium flex items-center justify-center gap-2 group">
            Want the full premium versions? Browse our catalog <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>
    </div>
  );
}
