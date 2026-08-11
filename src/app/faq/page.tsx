"use client";

import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, Plus, Minus } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

const faqs = [
  {
    question: "What exactly do I get after purchase?",
    answer: "Each product page states its exact deliverable. Paid items are fulfilled from private Digital Swarm storage with a signed, expiring download link and a license record after Cashfree confirms payment. We do not promise a private GitHub repository, source code, or future updates unless that specific product page says so."
  },
  {
    question: "Are all products source-code templates?",
    answer: "No. The catalog can include ZIP packages, HTML playbooks, Markdown or text resources, and other digital assets. Check the delivery type, features, dependencies, and setup notes on the individual product page before buying."
  },
  {
    question: "Can I use a product commercially?",
    answer: "License scope varies by product and selected license tier. The product page and checkout tier describe the intended scope. You may not assume resale, redistribution, white-label, or unlimited-use rights unless those rights are explicitly included."
  },
  {
    question: "What is the refund policy?",
    answer: "You may request review within 30 days for a materially defective, unavailable, duplicated-charge, or materially misdescribed purchase. Change-of-mind refunds are not automatic for delivered digital goods. The full policy is available on the Refund Policy page."
  },
  {
    question: "How does support work?",
    answer: "Support is handled by email at support@digitalswarm.in. We do not publish a 24/7 response guarantee, fixed response time, Discord entitlement, or six-month support promise unless a specific product or written agreement explicitly includes it."
  },
  {
    question: "Why are some products unavailable?",
    answer: "Digital Swarm hides or quarantines a SKU when its real deliverable, licensing, database mapping, or fulfillment path cannot be verified. A product is preferable to being temporarily unavailable rather than being sold with a dummy or placeholder delivery."
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white pt-32 pb-20 font-mono">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <div className="container mx-auto px-6 max-w-4xl">
        <header className="mb-20 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <HelpCircle className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-black uppercase tracking-widest text-primary">Customer information</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter mb-6 leading-none">
            Frequently Asked <span className="text-primary italic">Questions</span>
          </motion.h1>
          <p className="text-white/40 text-sm max-w-xl mx-auto leading-relaxed">Delivery, licensing, refunds, product availability and support—without invented guarantees.</p>
        </header>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div key={faq.question} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.04 }} className={`border transition-all rounded-2xl overflow-hidden ${openIndex === index ? "bg-white text-black border-white" : "bg-white/[0.03] border-white/10"}`}>
              <button onClick={() => setOpenIndex(openIndex === index ? null : index)} className="w-full flex items-center justify-between p-7 text-left group">
                <span className="text-lg md:text-xl font-black tracking-tight leading-tight">{faq.question}</span>
                <div className={`shrink-0 ml-4 p-2 rounded-full border ${openIndex === index ? "bg-black text-white border-black" : "border-white/10 text-white"}`}>
                  {openIndex === index ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </div>
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="px-7 pb-7 pt-0 border-t border-black/10 text-sm md:text-base font-sans leading-relaxed opacity-75">{faq.answer}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 p-10 bg-primary rounded-3xl text-black text-center">
          <h2 className="text-3xl md:text-4xl font-black tracking-tighter mb-4">Need help with a specific order?</h2>
          <p className="text-black/60 font-medium text-sm mb-8">Use the contact form or email support@digitalswarm.in with your order ID.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/contact" className="inline-block px-8 py-4 bg-black text-white font-black rounded-full">Contact support</Link>
            <Link href="/refund" className="inline-block px-8 py-4 border border-black/20 text-black font-black rounded-full">Refund policy</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
