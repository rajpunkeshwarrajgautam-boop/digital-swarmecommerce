"use client";

import { motion } from "framer-motion";
import { Code2, Cpu, Rocket, Users, ShieldCheck, Zap } from "lucide-react";
import Image from "next/image";

const stats = [
  { label: "Developed Protocols", value: "30+", icon: Cpu },
  { label: "Community Builders", value: "2,000+", icon: Users },
  { label: "Average Setup Time", value: "45m", icon: Rocket },
  { label: "Uptime Protocol", value: "99.9%", icon: ShieldCheck }
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white pt-32 pb-20 font-mono">
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-primary/10 border border-primary/20 w-fit">
              <span className="text-[10px] font-black tracking-[0.2em] text-primary uppercase italic">Protocol Alpha</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-[0.85]">
              Built by <span className="text-primary italic">Engineers</span>. <br />
              Driven by <span className="text-primary italic">Efficiency</span>.
            </h1>
            <p className="text-white/60 text-xl font-medium uppercase tracking-tight leading-relaxed max-w-2xl">
              Digital Swarm was forged in the heat of rapid deployment cycles. We identified a recurring failure point in software engineering: the &quot;Blank Screen&quot; latency. We solve it by providing the hardened architecture you normally build in month three, on day zero.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
          >
             <div className="aspect-square bg-white/5 border-8 border-white/5 rounded-[4rem] overflow-hidden rotate-3 hover:rotate-0 transition-transform duration-700 shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1000" 
                  alt="Industrial Engineering" 
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                />
             </div>
             {/* Glowing Orbs */}
             <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 blur-[100px] rounded-full" />
             <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/20 blur-[100px] rounded-full" />
          </motion.div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-32">
          {stats.map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-8 bg-white/5 border-2 border-white/5 rounded-3xl hover:border-primary/20 transition-all group"
            >
              <stat.icon className="w-8 h-8 text-primary mb-6 group-hover:scale-110 transition-transform" />
              <div className="text-4xl font-black italic text-white mb-2">{stat.value}</div>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Vision Statement */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white border-8 border-black p-12 lg:p-24 text-black shadow-[24px_24px_0_#ff6b35] relative mb-32"
        >
          <div className="max-w-4xl mx-auto space-y-12">
            <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter leading-none">
              The <span className="underline decoration-black/10">Architecture</span> of the Future isn&apos;t just code. It&apos;s a Standard.
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-12 border-t-4 border-black/5">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Zap className="w-6 h-6 text-primary fill-primary" />
                  <span className="text-lg font-black uppercase tracking-tighter italic">Hardened Stacks</span>
                </div>
                <p className="text-black/60 font-medium leading-relaxed uppercase text-sm">We don&apos;t ship &quot;Boilerplates&quot;. We ship production environments. Every line is optimized for 100/100 Lighthouse scores and maximum developer joy.</p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Code2 className="w-6 h-6 text-primary fill-primary" />
                  <span className="text-lg font-black uppercase tracking-tighter italic">Developer Experience</span>
                </div>
                <p className="text-black/60 font-medium leading-relaxed uppercase text-sm">Clean code isn&apos;t an option, it&apos;s our baseline. We use atomic design, strictly typed interfaces, and modular logic for infinite scalability.</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Global Network Section */}
        <section className="text-center py-20">
          <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-primary mb-8">Swarm Global Presence</h3>
          <div className="flex flex-wrap justify-center gap-12 opacity-30 grayscale hover:grayscale-0 transition-all">
             <span className="text-2xl font-black uppercase italic tracking-tighter">New York</span>
             <span className="text-2xl font-black uppercase italic tracking-tighter">Bangalore</span>
             <span className="text-2xl font-black uppercase italic tracking-tighter">London</span>
             <span className="text-2xl font-black uppercase italic tracking-tighter">Tokyo</span>
             <span className="text-2xl font-black uppercase italic tracking-tighter">Berlin</span>
          </div>
        </section>

      </div>
    </div>
  );
}
