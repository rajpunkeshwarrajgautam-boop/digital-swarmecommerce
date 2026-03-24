"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "How do I receive my files after purchasing?",
    a: "You'll get an instant download link via email as soon as payment confirms — usually within seconds. You can also access it on the order confirmation page. Links are valid for lifetime re-download.",
  },
  {
    q: "What file formats do products come in?",
    a: "Source code bundles ship as .ZIP files with the full codebase and a README. UI kits come as Figma files + exported assets. Ebooks are high-quality PDFs. Each product page lists exactly what you'll receive.",
  },
  {
    q: "Do I need to know how to code to use these products?",
    a: "For source code bundles, basic to intermediate knowledge is helpful but every product includes a plain-English setup guide. UI kits and template packs are beginner-friendly — just drag, drop, and customise.",
  },
  {
    q: "Can I get a refund?",
    a: "Because digital files can't be 'returned,' all sales are final. However, if your file is corrupted or broken and we can't fix it, we'll issue a full refund within 7 days of purchase. Your satisfaction is our priority.",
  },
  {
    q: "Can I use these in client projects or commercial work?",
    a: "Yes — every product includes a standard commercial licence. You can use it in your own client projects, SaaS products, or internal tools. Reselling the raw files is not permitted unless the listing says 'Master Resell Rights'.",
  },
];

export function HomeFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-24 bg-[#0a0c10] border-t border-white/5">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-black text-white italic uppercase tracking-tighter mb-4">Common <span className="text-cyan-400">Questions</span></h2>
          <p className="text-gray-400 font-bold uppercase tracking-tight text-sm">
            Everything you need to know before joining the swarm.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="border border-white/5 rounded-2xl overflow-hidden hover:border-cyan-500/20 transition-all bg-white/5"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 px-8 py-6 text-left"
              >
                <span className="font-bold text-white uppercase italic tracking-tighter text-sm md:text-base">{faq.q}</span>
                <motion.span animate={{ rotate: openIndex === i ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" />
                </motion.span>
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-5 text-sm text-muted-foreground leading-relaxed border-t border-border pt-4">
                      {faq.a}
                    </p>
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
