"use client";

import { motion } from "framer-motion";
import { Search, CreditCard, Download, ArrowRight } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

const STEPS = [
  {
    id: "01",
    title: "Review the Listing",
    description: "Check the product page for the included files, format, dependencies, license details and support scope before adding anything to your cart.",
    icon: <Search className="w-8 h-8 text-primary" />,
    color: "bg-primary/10"
  },
  {
    id: "02",
    title: "Checkout with Cashfree",
    description: "The server recalculates the catalog price and creates the payment session with Cashfree. Client-supplied prices are not accepted as the source of truth.",
    icon: <CreditCard className="w-8 h-8 text-secondary" />,
    color: "bg-secondary/10"
  },
  {
    id: "03",
    title: "Receive the Paid Asset",
    description: "After a verified payment event, the purchased file is issued through a time-limited private download link and recorded against the order.",
    icon: <Download className="w-8 h-8 text-accent" />,
    color: "bg-accent/10"
  }
];

export function HowItWorks() {
  return (
    <section className="py-40 bg-[#07070a] relative overflow-hidden">
      <div className="container px-6 mx-auto relative z-10 w-full max-w-7xl">
        <div className="flex flex-col items-center text-center gap-6 mb-24">
          <h2 className="text-5xl md:text-7xl font-outfit font-black text-white tracking-tighter uppercase leading-[0.9]">
            How <span className="text-primary text-6xl md:text-8xl">delivery</span> <br /> works
          </h2>
          <p className="text-white/40 font-mono text-xs uppercase tracking-[0.3em] max-w-xl">
            Listing → server-validated checkout → verified private delivery
          </p>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          <div className="absolute top-20 left-[15%] right-[15%] h-px bg-white/5 z-0 hidden lg:block" />
          {STEPS.map((step, i) => (
            <motion.div key={step.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }} className="relative z-10">
              <GlassCard className="flex flex-col items-center text-center p-12 h-full border-white/5 bg-white/2 hover:bg-white/5 transition-all duration-500 group">
                <div className={`w-20 h-20 ${step.color} rounded-xl flex items-center justify-center mb-10 group-hover:scale-105 transition-transform duration-500 border border-white/10 relative`}>
                  {step.icon}
                  <div className="absolute -top-2 -right-2 w-7 h-7 bg-primary text-black flex items-center justify-center font-outfit font-black text-[10px] border border-white/20 shadow-xl">
                    {step.id}
                  </div>
                </div>
                <h3 className="text-2xl font-outfit font-black text-white uppercase tracking-tighter mb-4 group-hover:text-primary transition-colors">{step.title}</h3>
                <p className="text-white/40 font-inter text-sm leading-relaxed max-w-xs">{step.description}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        <div className="mt-24 flex justify-center">
          <div className="flex items-center gap-4 px-8 py-3 bg-white/5 border border-white/5 rounded-full">
            <ArrowRight className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-mono font-black uppercase text-white/25 tracking-[0.22em]">
              Exact deliverables are listed per product
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
