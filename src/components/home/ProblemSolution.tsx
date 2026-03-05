"use client";

import { motion } from "framer-motion";
import { AlertCircle, CheckCircle2 } from "lucide-react";

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
    <section className="py-24 bg-background border-t border-border/40">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Stop Rebuilding. <span className="text-primary">Start Shipping.</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Every developer hits the same walls. Here&apos;s how Digital Swarm knocks them down.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {pains.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="rounded-2xl border border-border bg-card overflow-hidden"
            >
              {/* Problem */}
              <div className="p-6 bg-red-500/5 border-b border-border/50 flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground leading-relaxed">{item.problem}</p>
              </div>
              {/* Solution */}
              <div className="p-6 flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                <p className="text-sm font-medium leading-relaxed">{item.solution}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
