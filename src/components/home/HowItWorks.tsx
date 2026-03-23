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
    <section className="py-24 bg-white border-y border-gray-100 relative overflow-hidden text-center md:text-left">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
            How It Works
          </h2>
          <p className="text-gray-500 font-medium text-lg max-w-xl mx-auto">
            From purchase to production in three simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 max-w-5xl mx-auto relative mt-8">
          {/* Connector line (desktop only) */}
          <div className="hidden md:block absolute top-[20%] lg:top-[25%] left-[20%] right-[20%] h-0.5 bg-gray-100" />

          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="relative text-center flex flex-col items-center gap-5 bg-white p-6 rounded-3xl hover:-translate-y-1 transition-transform"
            >
              {/* Step number badge */}
              <div className="relative w-24 h-24 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shadow-sm">
                {step.icon}
                <span className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-indigo-500 text-white text-sm font-bold flex items-center justify-center border-2 border-white shadow-sm">
                  {step.step}
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900">{step.title}</h3>
              <p className="text-base text-gray-500 font-medium leading-relaxed max-w-sm">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
