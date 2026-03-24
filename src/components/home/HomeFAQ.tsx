"use client";

import { useState } from "react";
import { Plus, Minus, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const QUESTIONS = [
  {
    q: "What format are the downloads in?",
    a: "All architectural patterns are delivered as standard .zip archives. Inside you will find production-ready source code, configuration manifests (.env.example), and an industrial deployment guide."
  },
  {
    q: "Do I get lifetime updates?",
    a: "Yes. Once you acquire a protocol, you get access to all future updates for that specific product forever. We regularly patch our templates for the latest framework versions (e.g., Next.js 15)."
  },
  {
    q: "Can I use these for client projects?",
    a: "Absolutely. Our Commercial MRR License allows you to use the code for unlimited client builds. You just cannot resell the templates themselves as competition to the swarm."
  },
  {
    q: "What's your refund policy?",
    a: "Due to the digital nature of source code, we generally don't offer refunds once the protocol is downloaded. However, if there is a technical defect we cannot fix, we will issue a credit manually."
  },
  {
    q: "How do I get support?",
    a: "Every product includes priority Discord support. Join our server and open a ticket in the #uplink-support channel. Our engineers are active 24/7."
  },
  {
    q: "Are these production-ready?",
    a: "Yes. These aren't high-school tutorials. These are the same architectural frameworks we use to launch 7-figure SaaS platforms. Hardened, typed, and optimized."
  },
  {
    q: "What tech stacks do you support?",
    a: "We primary dominate the JavaScript/TypeScript ecosystem (React, Next.js, Node.js). We also provide specialized kits for Python AI agents and React Native mobile builds."
  },
  {
    q: "Do you offer team licenses?",
    a: "Yes. If you have a dev pod larger than 5 engineers, contact our enterprise unit for a custom Team Command License."
  }
];

export function HomeFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-32 bg-background relative overflow-hidden">
      <div className="container px-6 mx-auto relative z-10 w-full max-w-4xl">
        <div className="flex flex-col items-center text-center gap-6 mb-24">
           <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/5 border border-secondary/10 shadow-sm">
            <HelpCircle className="w-4 h-4 text-secondary/40" />
            <span className="text-[10px] font-black uppercase tracking-widest text-secondary/60 italic">FAQ Protocol // V3.1</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-secondary tracking-tighter uppercase italic leading-[0.9]">
            Common <span className="text-primary italic">Queries</span>
          </h2>
          <p className="text-secondary/50 font-bold text-lg uppercase tracking-tight">
            Detailed answers for your hardware and software objectives.
          </p>
        </div>

        <div className="space-y-4">
          {QUESTIONS.map((item, i) => (
            <div 
              key={i}
              className={`bg-white rounded-[2rem] border-4 transition-all duration-300 ${openIndex === i ? 'border-primary/20 shadow-2xl shadow-primary/5' : 'border-secondary/5'}`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full px-10 py-8 flex items-center justify-between gap-6 text-left"
              >
                <span className="text-xl font-black text-secondary italic uppercase tracking-tight">{item.q}</span>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${openIndex === i ? 'bg-primary text-white' : 'bg-secondary/5 text-secondary/40'}`}>
                  {openIndex === i ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                </div>
              </button>
              
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-10 pb-10">
                      <div className="h-px w-full bg-secondary/5 mb-8" />
                      <p className="text-base md:text-lg font-bold text-secondary/50 uppercase tracking-tight leading-snug">
                        {item.a}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
