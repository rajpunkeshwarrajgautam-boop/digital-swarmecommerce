"use client";

import { motion } from "framer-motion";
import { Star, CheckCircle2, Quote } from "lucide-react";
import Image from "next/image";

const testimonials = [
  {
    name: "Alex Davydov",
    role: "Senior AI Engineer",
    avatar: "https://i.pravatar.cc/150?img=12",
    content: "The components are incredibly well-architected. I literally bought the AI agent boilerplate on Friday and launched my SaaS by Monday. Crazy ROI for the price.",
    rating: 5,
  },
  {
    name: "Sarah Jenkins",
    role: "Frontend Architect",
    avatar: "https://i.pravatar.cc/150?img=5",
    content: "Digital Swarm saved me over 3 weeks of miserable API integration work. The documentation is pristine and the codebase is completely type-safe. Highly recommend.",
    rating: 5,
  },
  {
    name: "Marcus Thorne",
    role: "SaaS Founder",
    avatar: "https://i.pravatar.cc/150?img=11",
    content: "Best UI kits I have ever purchased. Period. Better than most subscriptions that charge $100/month. The pricing strategy here is wildly generous.",
    rating: 5,
  },
  {
    name: "Elena Rodriguez",
    role: "Solution Architect",
    avatar: "https://i.pravatar.cc/150?img=19",
    content: "I've purchased templates before that were spaghetti code. These are different. The code looks like it was written by an elite engineering team at a top-tier tech firm.",
    rating: 5,
  }
];

const stats = [
  { value: "50k+", label: "Uplinks Established" },
  { value: "₹1.2Cr", label: "Value Transferred" },
  { value: "99.9%", label: "Uptime Sync" },
  { value: "2.4k", label: "Elite Members" },
];

export function FieldReports() {
  return (
    <section className="py-32 bg-[#0a0c10] border-y border-white/5 overflow-hidden relative">
      <div className="container mx-auto px-6 w-full max-w-7xl relative z-10">
        
        {/* Trusted By strip - Industrial Style */}
        <div className="mb-24 text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400 opacity-40 mb-12 italic">Architectural_Vetting_Verified</p>
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-20 hover:opacity-100 transition-opacity duration-500">
                {["ALPHATECH", "SWARM_LOG", "NEON_NODE", "CYBER_RETAIL", "NEXUS_FIN"].map((brand, i) => (
                    <span key={i} className="text-2xl md:text-3xl font-black tracking-tighter text-white italic">
                        {brand}
                    </span>
                ))}
            </div>
        </div>

        {/* Stats Matrix */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-32 max-w-5xl mx-auto">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="bg-white/5 border border-white/5 p-8 rounded-3xl text-center backdrop-blur-3xl"
            >
              <p className="text-4xl md:text-5xl font-black text-white italic tracking-tighter mb-2">{stat.value}</p>
              <p className="text-[9px] font-black uppercase tracking-widest text-cyan-400 opacity-60">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Section title */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 shadow-sm mb-6">
            <Quote className="w-4 h-4 text-cyan-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400 italic">Peer_Validation_Stream</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic">
            Field <span className="text-cyan-500">Reports</span>
          </h2>
          <p className="text-gray-400 font-bold mt-4 text-lg uppercase tracking-tight">Vetted Intelligence from the Collective</p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="group relative bg-white/5 rounded-[2.5rem] p-8 border border-white/5 flex flex-col h-full hover:border-cyan-500/30 transition-all shadow-2xl"
            >
                <div className="flex gap-1 mb-6">
                    {[...Array(t.rating)].map((_, idx) => (
                        <Star key={idx} className="w-3.5 h-3.5 fill-cyan-500 text-cyan-500" />
                    ))}
                </div>
                
                <p className="text-gray-300 text-base font-medium mb-10 grow leading-relaxed uppercase tracking-tight italic">
                    &ldquo;{t.content}&rdquo;
                </p>
                
                <div className="mt-auto pt-6 border-t border-white/10 flex items-center gap-4">
                    <div className="relative">
                      <div className="relative w-12 h-12 rounded-2xl overflow-hidden border border-white/10 bg-black/40 group-hover:scale-105 transition-transform">
                        <Image src={t.avatar} alt={t.name} width={48} height={48} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="absolute -bottom-2 -right-2 bg-black border border-white/10 rounded-full p-1 shadow-2xl">
                        <CheckCircle2 className="w-3 h-3 text-cyan-500" />
                      </div>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-black text-white text-[10px] uppercase tracking-widest">
                          {t.name}
                        </span>
                        <span className="text-[8px] text-cyan-400 font-black uppercase tracking-widest italic">{t.role}</span>
                    </div>
                </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
