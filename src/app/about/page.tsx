"use client";

import { motion } from "framer-motion";
import { Code2, Download, ShieldCheck, Mail, Database } from "lucide-react";

const facts = [
  { label: "Catalog", value: "Digital products", icon: Code2 },
  { label: "Paid delivery", value: "Private links", icon: Download },
  { label: "Checkout", value: "Cashfree", icon: ShieldCheck },
  { label: "Support", value: "Email", icon: Mail },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white pt-32 pb-20 font-mono">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-28">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
            <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-primary/10 border border-primary/20 w-fit">
              <span className="text-[10px] font-black tracking-[0.2em] text-primary uppercase">About Digital Swarm</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.85]">
              Practical digital <span className="text-primary">building blocks</span>.
            </h1>
            <p className="text-white/60 text-lg leading-relaxed max-w-2xl font-sans">
              Digital Swarm sells downloadable AI workflows, playbooks, source-code kits and implementation assets. Each paid listing is intended to state exactly what is included, what tools it requires and how the file is delivered.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} className="relative rounded-[2.5rem] border border-white/10 bg-white/[0.035] p-10 md:p-14 overflow-hidden">
            <Database className="h-12 w-12 text-primary mb-8" />
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-6">Store architecture</h2>
            <p className="text-white/50 font-sans leading-7">
              Product records and orders are backed by Supabase, paid assets are kept in private storage, checkout is handled through Cashfree, and customer access is issued only after a verified payment event.
            </p>
            <div className="absolute -right-20 -bottom-20 h-60 w-60 rounded-full bg-primary/10 blur-[90px]" />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-28">
          {facts.map((fact, i) => (
            <motion.div key={fact.label} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="p-7 bg-white/[0.035] border border-white/8 rounded-2xl">
              <fact.icon className="w-7 h-7 text-primary mb-6" />
              <div className="text-xl font-black text-white mb-2">{fact.value}</div>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">{fact.label}</div>
            </motion.div>
          ))}
        </div>

        <section className="rounded-[2rem] border border-white/8 bg-white/[0.025] p-10 md:p-16">
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight mb-10">What we commit to</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <h3 className="text-lg font-black uppercase text-primary mb-3">No invented social proof</h3>
              <p className="text-white/50 font-sans leading-7">We do not need fabricated user counts, uptime percentages, customer totals or locations to sell a useful product. Product value should come from the deliverable itself.</p>
            </div>
            <div>
              <h3 className="text-lg font-black uppercase text-primary mb-3">Exact scope over hype</h3>
              <p className="text-white/50 font-sans leading-7">A listing should identify the files, format, dependencies and license that a buyer receives. If an item cannot be fulfilled as described, it should not be sold.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
