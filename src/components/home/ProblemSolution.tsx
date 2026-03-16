"use client";

import { motion } from "framer-motion";

const pains = [
  {
    problem: "Spending weeks building the same boilerplate from scratch",
    solution: "Get production-ready source code you can start using in 5 minutes",
  },
  {
    problem: "Paying expensive freelancers for basic UI components",
    solution: "Buy beautiful, well-documented templates once — use them forever",
  },
  {
    problem: "Wasting hours searching for quality, trusted resources",
    solution: "Every product is hand-picked, tested, and ready to ship",
  },
];

export function ProblemSolution() {
  return (
    <section className="py-40 bg-background border-t border-white/5 relative overflow-hidden">
      <div className="absolute inset-0 bg-swarm-pattern opacity-5" />
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-left mb-24 max-w-4xl">
          <h2 className="text-5xl md:text-8xl font-black italic uppercase leading-[0.8] tracking-tighter mb-8">
            <span className="ono-text-split"><span>Operational</span></span><br/>
            <span className="text-primary ono-text-split"><span>Efficiency</span></span>
          </h2>
          <p className="text-white/50 text-xl font-bold italic uppercase tracking-tighter max-w-xl silk-reveal-mask">
            Legacy development pipelines are slow. We distribute optimized architectural solutions for immediate system integration.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-t border-l border-white/10">
          {pains.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, duration: 0.8 }}
              className="border-r border-b border-white/10 bg-zinc-950/20 backdrop-blur-sm group hover:bg-primary/5 transition-colors"
            >
              {/* Problem */}
              <div className="p-10 border-b border-white/5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-2 h-2 bg-red-500 rounded-none shadow-[0_0_10px_#ef4444]" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-red-500">Anomaly Detected</span>
                </div>
                <p className="text-lg font-bold uppercase italic tracking-tighter text-white/40 leading-tight">{item.problem}</p>
              </div>
              {/* Solution */}
              <div className="p-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-2 h-2 bg-primary rounded-none shadow-[0_0_10px_#CCFF00]" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary">Protocol Applied</span>
                </div>
                <p className="text-xl font-black uppercase italic tracking-tighter leading-tight">{item.solution}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
