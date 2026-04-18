"use client";

import { motion } from "framer-motion";
import { Check, Shield, Globe, Cpu, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";


const tiers = [
  {
    name: "Starter Kit",
    price: "₹1,499",
    desc: "ZIP bundle: Swarm paid prompt core (Markdown), audits, checklists, and token CSS — ready for ChatGPT / Claude workflows.",
    features: [
      "swarm-paid-prompt-core.md",
      "Launch + stack audit text packs",
      "Design-system token CSS",
      "Portable ZIP (READ_ME_FIRST inside)",
      "Email support"
    ],
    buttonText: "Acquire Starter",
    link: "/product/starter-kit",
    highlight: false
  },
  {
    name: "Professional",
    price: "₹3,999",
    desc: "Starter bundle plus a React/Tailwind sample module you can adapt — same prompt-first scope, more UI velocity.",
    features: [
      "Everything in Starter",
      "cyberpunk-mini-ui-kit.tsx sample",
      "Same Markdown prompt core",
      "ZIP fulfillment with manifest",
      "Email support"
    ],
    buttonText: "Acquire Pro",
    link: "/product/nextjs-saas-kit",
    highlight: true
  },
  {
    name: "Enterprise",
    price: "₹14,999",
    desc: "Infinite scalability and dedicated engineering for massive deployments.",
    features: [
      "Everything in Professional",
      "Custom Architecture Audit",
      "White-Glove Deployment",
      "Unlimited Domain License",
      "24/7 Priority Hotline",
      "Private Repo Access"
    ],
    buttonText: "Contact Engineering",
    link: "/contact",
    highlight: false
  }
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white pt-32 pb-20 font-mono">
      <div className="container mx-auto px-6 max-w-7xl">
        
        <header className="mb-20 text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-none bg-[#ff6b35]/20 border border-[#ff6b35]/40 mb-6"
          >
            <Shield className="w-4 h-4 text-[#ff6b35]" />
            <span className="text-[10px] font-black uppercase tracking-widest text-[#ff6b35]">Licensing Protocol</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter mb-6 leading-none"
          >
            Acquire the <br />
            <span className="text-primary italic">Architecture</span>.
          </motion.h1>
          <p className="text-white/40 text-sm uppercase font-black tracking-widest max-w-xl mx-auto">
            Transparent licensing with lifetime ownership. Select your operational tier.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
          {tiers.map((tier, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`relative flex flex-col p-10 border-4 transition-all hover:-translate-y-2 ${tier.highlight ? "bg-white text-black border-black shadow-[16px_16px_0_#ff6b35]" : "bg-white/5 border-white/10 text-white shadow-[8px_8px_0_#000]"}`}
            >
              {tier.highlight && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-1 text-[10px] font-black uppercase italic tracking-widest leading-none">
                  Most Popular
                </div>
              )}
              
              <div className="mb-8">
                <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-2">{tier.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black italic tracking-tighter">{tier.price}</span>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${tier.highlight ? "text-black/40" : "text-white/40"}`}>/ Lifetime</span>
                </div>
              </div>

              <p className={`text-xs font-bold uppercase tracking-tight mb-8 leading-relaxed ${tier.highlight ? "text-black/60" : "text-white/60"}`}>
                {tier.desc}
              </p>

              <div className="space-y-4 mb-12 flex-1">
                {tier.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <Check className={`w-4 h-4 mt-0.5 shrink-0 ${tier.highlight ? "text-black" : "text-primary"}`} />
                    <span className="text-[10px] font-black uppercase tracking-widest leading-tight">{feature}</span>
                  </div>
                ))}
              </div>

              <Link href={tier.link}>
                <Button className={`w-full py-6 text-sm font-black uppercase tracking-widest transition-all ${tier.highlight ? "bg-black text-white hover:bg-primary" : "bg-primary text-white hover:bg-white hover:text-black"}`}>
                  {tier.buttonText}
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* FAQ Preview Banner */}
        <div className="p-12 bg-white/5 border-2 border-white/5 rounded-none text-center">
          <h2 className="text-2xl font-black uppercase italic tracking-tighter mb-4">Enterprise Questions?</h2>
          <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] mb-8">Custom build requirements for large-scale operations.</p>
          <div className="flex flex-wrap justify-center gap-16 opacity-30">
             <div className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                <span className="text-[10px] font-black uppercase tracking-widest">Global Support</span>
             </div>
             <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5" />
                <span className="text-[10px] font-black uppercase tracking-widest">Architectural Audit</span>
             </div>
             <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span className="text-[10px] font-black uppercase tracking-widest">Team Onboarding</span>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}
