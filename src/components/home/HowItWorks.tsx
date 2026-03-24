"use client";

import { motion } from "framer-motion";
import { Search, Download, Rocket, ArrowRight } from "lucide-react";

const STEPS = [
  {
    id: "01",
    title: "Browse Catalog",
    description: "Search our elite repository of code templates and find the exact architectural pattern for your next mission.",
    icon: <Search className="w-8 h-8 text-primary" />,
    color: "bg-primary/10"
  },
  {
    id: "02",
    title: "Secure Checkout",
    description: "Uplink with Razorpay for instant encrypted processing. We support UPI, Cards, and Net Banking for global clearance.",
    icon: <Download className="w-8 h-8 text-secondary" />,
    color: "bg-secondary/10"
  },
  {
    id: "03",
    title: "Launch Empire",
    description: "Download the source code immediately and deploy your project in minutes. Skip the boilerplate, keep the results.",
    icon: <Rocket className="w-8 h-8 text-accent" />,
    color: "bg-accent/10"
  }
];

export function HowItWorks() {
  return (
    <section className="py-32 bg-white relative overflow-hidden">
      <div className="container px-6 mx-auto relative z-10 w-full max-w-7xl">
        <div className="flex flex-col items-center text-center gap-6 mb-24">
          <h2 className="text-5xl md:text-7xl font-black text-secondary tracking-tighter uppercase italic leading-[0.9]">
            Rapid <span className="text-primary italic">Setup</span> Protocol
          </h2>
          <p className="text-secondary/50 font-bold text-lg max-w-2xl uppercase tracking-tight">
            How to go from idea to absolute production dominance in three steps.
          </p>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20">
          {/* Connector Line (Desktop) */}
          <div className="absolute top-[3.5rem] left-[15%] right-[15%] h-1 bg-linear-to-r from-transparent via-secondary/10 to-transparent z-0 hidden lg:block" />

          {STEPS.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              className="relative z-10 flex flex-col items-center text-center group"
            >
              <div className={`w-24 h-24 ${step.color} rounded-[2rem] border-4 border-white shadow-2xl flex items-center justify-center mb-10 group-hover:scale-110 transition-transform duration-500`}>
                {step.icon}
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-secondary text-white rounded-full flex items-center justify-center font-black text-xs italic border-2 border-white shadow-lg">
                  {step.id}
                </div>
              </div>
              <h3 className="text-3xl font-black text-secondary uppercase italic tracking-tighter mb-4 group-hover:text-primary transition-colors">
                {step.title}
              </h3>
              <p className="text-secondary/50 font-bold text-sm lg:text-base uppercase tracking-tight leading-tight max-w-xs">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="mt-24 flex justify-center">
           <div className="flex items-center gap-4 px-8 py-4 bg-secondary/5 rounded-2xl border border-secondary/5 animate-pulse">
             <ArrowRight className="w-5 h-5 text-primary" />
             <span className="text-[10px] font-black uppercase text-secondary/40 tracking-[0.2em]">Deployment Complete // Source_Verified</span>
           </div>
        </div>
      </div>
    </section>
  );
}
