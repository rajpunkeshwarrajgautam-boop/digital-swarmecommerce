"use client";

import { motion } from "framer-motion";
import { ShoppingCart, Download, Rocket } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: <ShoppingCart className="w-7 h-7 text-primary" />,
    title: "Browse & Buy",
    description: "Find the digital product you need. Add to cart and check out securely via Razorpay in under 2 minutes.",
  },
  {
    step: "02",
    icon: <Download className="w-7 h-7 text-primary" />,
    title: "Instant Download",
    description: "Your download link lands in your inbox immediately. No waiting, no delays — available forever.",
  },
  {
    step: "03",
    icon: <Rocket className="w-7 h-7 text-primary" />,
    title: "Use & Launch",
    description: "Follow the included setup guide and have your project running in 5 minutes. Ship something you're proud of.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 bg-background border-t border-border/40">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            How It Works
          </h2>
          <p className="text-muted-foreground text-lg max-w-lg mx-auto">
            From purchase to production in three simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto relative">
          {/* Connector line (desktop only) */}
          <div className="hidden md:block absolute top-10 left-1/3 right-1/3 h-px bg-border" />

          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              className="relative text-center flex flex-col items-center gap-4"
            >
              {/* Step number badge */}
              <div className="relative w-20 h-20 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center">
                {step.icon}
                <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-primary text-black text-xs font-black flex items-center justify-center border-2 border-background">
                  {step.step}
                </span>
              </div>
              <h3 className="text-xl font-bold">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
