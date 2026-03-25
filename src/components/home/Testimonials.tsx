"use client";

import { motion } from "framer-motion";
import { Quote, Star, User, ShieldCheck } from "lucide-react";

const testimonials = [
  {
    name: "ALEX RIVERA",
    role: "Lead Architect @ CipherStream",
    content: "The Digital Swarm Next.js kit saved us 150+ hours of groundwork. The architectural patterns are elite and production-hardened.",
    rating: 5,
    avatar: "AR"
  },
  {
    name: "SARAH CHEN",
    role: "Founding Engineer @ NexusAI",
    content: "Absolute best-in-class AI agent templates. Clean, modular, and performant. This is how modern software should be built.",
    rating: 5,
    avatar: "SC"
  },
  {
    name: "DAVID HOFFMAN",
    role: "CTO @ BlackBox Lab",
    content: "We've integrated four different protocols from the Swarm. The consistency and visual quality are unmatched in the marketplace.",
    rating: 5,
    avatar: "DH"
  }
];

export function Testimonials() {
  return (
    <section className="bg-[#0a0a0f] py-32 border-t border-white/5 overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col items-center text-center mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#CCFF00]/10 border border-[#CCFF00]/20 mb-6"
          >
            <ShieldCheck className="w-4 h-4 text-[#CCFF00]" />
            <span className="text-[10px] font-black uppercase tracking-widest text-[#CCFF00]">Signature Protocols Verified</span>
          </motion.div>
          <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic leading-none">
            Transmission <br />
            <span className="text-white/20">Feedback</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-10 bg-white/5 border-4 border-black group hover:bg-white/10 transition-all shadow-[8px_8px_0_#000] hover:shadow-[12px_12px_0_#ff6b35] relative"
            >
              <Quote className="absolute top-6 right-6 w-10 h-10 text-white/5 group-hover:text-[#ff6b35]/20 transition-colors" />
              
              <div className="flex gap-1 mb-8">
                {[...Array(t.rating)].map((_, idx) => (
                  <Star key={idx} className="w-4 h-4 fill-[#CCFF00] text-[#CCFF00]" />
                ))}
              </div>

              <p className="text-lg font-black uppercase italic tracking-tight text-white/80 mb-12 leading-relaxed">
                "{t.content}"
              </p>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-black border-2 border-white/10 flex items-center justify-center text-xs font-black italic">
                  {t.avatar}
                </div>
                <div>
                  <h4 className="text-sm font-black uppercase tracking-widest text-white">{t.name}</h4>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/30">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
