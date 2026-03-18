"use client";

import { motion } from "framer-motion";
import { Download, Lightbulb, Users, Clock } from "lucide-react";
import Link from "next/link";

const values = [
  {
    icon: <Download className="w-8 h-8 text-primary" />,
    title: "Quality Over Quantity",
    description:
      "Every product in our store is hand-selected and tested before listing. We'd rather have 50 excellent products than 500 mediocre ones.",
  },
  {
    icon: <Clock className="w-8 h-8 text-primary" />,
    title: "Your Time Is Valuable",
    description:
      "Every product ships with a setup guide so you can go from download to running code in under 5 minutes — not 5 hours.",
  },
  {
    icon: <Users className="w-8 h-8 text-primary" />,
    title: "Built by Developers, for Developers",
    description:
      "We're builders ourselves. We know what clean architecture looks like, and we won't list anything we wouldn't use in our own production apps.",
  },
  {
    icon: <Lightbulb className="w-8 h-8 text-primary" />,
    title: "Constantly Updated",
    description:
      "We update products when major frameworks release new versions. Buy once, benefit forever — you'll always get the latest version.",
  },
];

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-20 max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-16"
      >
        {/* Hero Section */}
        <div className="flex flex-col gap-6">
          <div className="bg-primary text-black px-4 py-1 text-[10px] font-black uppercase tracking-[0.5em] w-fit">
            [ MISSION_PROFILE_v4.2 ]
          </div>
          <h1 className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter leading-none">
            Architects of <br/> <span className="text-primary italic">Digital Dominance</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/40 font-bold uppercase italic tracking-tighter max-w-2xl leading-tight">
            Digital Swarm isn&apos;t just a store — it&apos;s an elite engineering hub building high-performance growth infrastructure for the high-velocity Indian market.
          </p>
        </div>

        {/* Our Story / The Why */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 py-24 border-y border-white/5">
          <div className="md:col-span-4">
             <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-primary italic mb-6">Origins_Log</h2>
             <p className="text-4xl font-black italic tracking-tighter uppercase leading-none">Why We <br/> Exist_</p>
          </div>
          <div className="md:col-span-8 space-y-8 text-white/50 font-bold uppercase italic tracking-tighter text-lg leading-relaxed">
            <p>
              In an era of generic marketing and slow-loading bloatware, your business deserves an unfair technical advantage. We founded Digital Swarm to eliminate the gap between &quot;having a website&quot; and &quot;owning a market.&quot;
            </p>
            <p>
              Our code isn&apos;t just lines — it&apos;s a tactical deployment. We package the multi-agent AI protocols, high-conversion frameworks, and performance-tuned blueprints that we use to scale brands from ₹10L to ₹10Cr+ monthly.
            </p>
          </div>
        </div>

        {/* The Team / The Faces */}
        <div className="py-24 space-y-16">
          <div className="flex flex-col gap-2">
            <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-white">The_Architects</h2>
            <p className="text-primary font-black uppercase tracking-[0.4em] text-[10px] italic">Strategic_Level_Clearance</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { name: "RAJ_GAUTAM", role: "Chief_Growth_Architect", skill: "Performance_Marketing" },
              { name: "SAM_X", role: "Lead_Software_Oracle", skill: "Next.js_Specialist" },
              { name: "SARA_K", role: "Visual_Logic_Designer", skill: "UX_Engineering" }
            ].map((member, i) => (
              <div key={i} className="group relative overflow-hidden border border-white/5 p-8 bg-black/40 hover:border-primary transition-all">
                <div className="w-24 h-24 bg-primary/10 border border-primary/20 mb-8 flex items-center justify-center font-black italic text-4xl text-primary/30 group-hover:text-primary transition-colors">
                  {member.name[0]}
                </div>
                <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-2 group-hover:text-primary transition-colors">{member.name}</h3>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-4 italic">{member.role}</p>
                <div className="w-full h-px bg-white/5 group-hover:w-full transition-all duration-700 mb-4" />
                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-primary transition-all italic opacity-0 group-hover:opacity-100">{member.skill}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Values Grid */}
        <div className="py-24 border-t border-white/5">
          <h2 className="text-3xl font-black italic text-center uppercase tracking-tighter mb-16">Core_Value_Network</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="p-10 bg-black/40 border border-white/5 hover:border-primary/50 transition-all group"
              >
                <div className="mb-6 opacity-40 group-hover:opacity-100 transition-all">{v.icon}</div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-primary italic mb-4">{v.title}</h3>
                <p className="text-lg text-white/50 font-bold uppercase italic tracking-tighter leading-tight">{v.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-16">
          <Link href="/contact">
            <button className="bg-primary text-black font-black px-12 py-5 uppercase italic tracking-[0.3em] hover:bg-white transition-all text-xs border-none shadow-[20px_20px_0px_rgba(var(--primary-rgb),0.1)] active:shadow-none">
              Infiltrate_Our_Network
            </button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
