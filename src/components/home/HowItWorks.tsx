"use client";

import { motion } from "framer-motion";
import { ShoppingCart, Download, Rocket } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: <ShoppingCart className="w-8 h-8 text-blue-500" />,
    title: "Browse & Buy",
    description: "Find the digital product you need. Add to cart and check out securely via Cashfree in under 2 minutes.",
  },
  {
    step: "02",
    icon: <Download className="w-8 h-8 text-pink-500" />,
    title: "Instant Download",
    description: "Your download link lands in your inbox immediately. No waiting, no delays — available forever.",
  },
  {
    step: "03",
    icon: <Rocket className="w-8 h-8 text-amber-500" />,
    title: "One-Click Launch",
    description: "Execute the included protocol to launch your Dashboard. Zero configuration. Instant AI intelligence.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-32 bg-black border-y border-white/5 relative overflow-hidden text-center md:text-left">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-black text-white tracking-tighter uppercase italic mb-4">
            Deployment <span className="text-cyan-400">Sequence</span>
          </h2>
          <p className="text-gray-400 font-bold text-lg max-w-xl mx-auto uppercase tracking-tight">
            From purchase to production in three simple phases.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 max-w-5xl mx-auto relative mt-8">
          {/* Connector line (desktop only) */}
          <div className="hidden md:block absolute top-[20%] lg:top-[25%] left-[20%] right-[20%] h-px bg-white/10" />

          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="relative text-center flex flex-col items-center gap-6 bg-white/5 border border-white/5 p-10 rounded-4xl hover:border-cyan-500/30 transition-all group"
            >
              {/* Step number badge */}
              <div className="relative w-28 h-28 rounded-2xl bg-black border border-white/10 flex items-center justify-center shadow-2xl group-hover:scale-105 transition-transform duration-500">
                <div className="bg-white/5 p-4 rounded-xl">{step.icon}</div>
                <span className="absolute -top-3 -right-3 w-10 h-10 rounded-xl bg-cyan-500 text-black text-xs font-black flex items-center justify-center border-4 border-black shadow-[4px_4px_0_rgba(6,182,212,0.3)] italic">
                  {step.step}
                </span>
              </div>
              <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">{step.title}</h3>
              <p className="text-sm text-gray-400 font-bold uppercase tracking-tight leading-relaxed max-w-[200px]">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
