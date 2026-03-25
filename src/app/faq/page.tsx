"use client";

import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, Plus, Minus } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    question: "What exactly do I get after purchase?",
    answer: "You receive the full source code (Next.js/Vite), a private GitHub repository invitation, comprehensive documentation, and lifetime access to future updates for that specific template."
  },
  {
    question: "Are these templates production-ready?",
    answer: "Yes. Every template is hardened with enterprise-grade security protocols, SEO optimization, and high-performance architectural patterns. Just plug in your API keys and deploy."
  },
  {
    question: "Can I use these for commercial projects?",
    answer: "Absolutely. Our 'Commercial License' allows you to use the code for yourself or for clients. You cannot, however, resell the source code as a competing template."
  },
  {
    question: "Is there a refund policy?",
    answer: "Given the digital nature of our products (source code access), we offer a 30-day money-back guarantee if the product doesn't meet its technical specifications. No questions asked."
  },
  {
    question: "Do you offer technical support?",
    answer: "Yes, every purchase includes 6 months of priority email support and access to our developer community on Discord."
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white pt-32 pb-20 font-mono">
      <div className="container mx-auto px-6 max-w-4xl">
        <header className="mb-20 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6"
          >
            <HelpCircle className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-black uppercase tracking-widest text-primary">Support Base</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter mb-6 leading-none"
          >
            Frequently Asked <br />
            <span className="text-primary italic">Questions</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/40 text-sm uppercase font-bold tracking-widest max-w-xl mx-auto"
          >
            Everything you need to know about the Digital Swarm infrastructure and deployment process.
          </motion.p>
        </header>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`border-4 border-black transition-all ${openIndex === index ? "bg-white text-black shadow-[12px_12px_0_#ff6b35]" : "bg-white/5 hover:bg-white/10 shadow-[6px_6px_0_#000]"}`}
            >
              <button 
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-8 text-left group"
              >
                <span className="text-xl md:text-2xl font-black uppercase italic tracking-tighter leading-tight">
                  {faq.question}
                </span>
                <div className={`shrink-0 ml-4 p-2 border-2 ${openIndex === index ? "bg-black text-white border-black" : "bg-white/10 border-white/10 text-white"} transition-all`}>
                  {openIndex === index ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                </div>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-8 pt-0 border-t-4 border-black text-lg font-bold uppercase tracking-tight leading-relaxed opacity-80">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 p-12 bg-primary border-4 border-black shadow-[12px_12px_0_#000] text-black text-center relative overflow-hidden group">
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter mb-4">Still have questions?</h2>
            <p className="text-black/60 font-black uppercase text-xs tracking-widest mb-8">Direct line to our engineering team active 24/7.</p>
            <button className="px-10 py-4 bg-black text-white font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-xl">
              Initiate Contact
            </button>
          </div>
          <div className="absolute top-0 right-0 -mr-12 -mt-12 w-64 h-64 bg-black/5 rounded-full blur-3xl group-hover:bg-white/10 transition-all" />
        </div>
      </div>
    </div>
  );
}
