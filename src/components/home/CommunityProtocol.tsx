"use client";

import { motion } from "framer-motion";
import { MessageSquare, Users, Zap, ExternalLink, Globe } from "lucide-react";

const communityPosts = [
  {
    author: "Protocol_Zero",
    platform: "Reddit",
    content: "The new SaaS kit from Digital Swarm is legitimately insane. 0.2s LCP out of the box. Highly recommend for any dev starting a new project.",
    stats: "412 Upvotes // 52 Comments",
    link: "https://reddit.com"
  },
  {
    author: "NodeExplorer",
    platform: "X / Twitter",
    content: "Just shipped my MVP using the AI Agent boilerplate. The modular architecture is pure art. Moving to production 2 weeks ahead of schedule.",
    stats: "1.2k Likes // 89 Retweets",
    link: "https://x.com"
  },
  {
    author: "CyberStacker",
    platform: "Discord",
    content: "Integrated the payment protocol today. Cashfree sync was seamless. The industrial ONO UI is a massive vibe shift for my users.",
    stats: "Online Status: Active",
    link: "https://discord.com"
  }
];

export function CommunityProtocol() {
  return (
    <section className="bg-black py-32 border-b-8 border-black overflow-hidden relative">
      {/* Decorative Matrix-style background */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none font-mono text-[8px] text-[#CCFF00] leading-none overflow-hidden select-none">
        {Array(50).fill(0).map((_, i) => (
          <div key={i} className="whitespace-nowrap">
            {Array(100).fill("SWARM_PROTOCOL_ACTIVE_").join("")}
          </div>
        ))}
      </div>

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-24">
          <div className="max-w-2xl">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-[#CCFF00] text-black text-[10px] font-black uppercase tracking-[0.3em] mb-6 italic"
            >
              <Users className="w-3 h-3" />
              Community Intelligence
            </motion.div>
            <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic leading-[0.85]">
              Swarm <br />
              <span className="text-[#CCFF00]">Transmissions</span>
            </h2>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Global Status</p>
              <p className="text-sm font-black text-white italic uppercase tracking-tighter">14,281 Protocols Deployed</p>
            </div>
            <Globe className="w-12 h-12 text-white/10 animate-spin-slow" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-1 shadow-2xl shadow-black overflow-hidden border-4 border-white/5">
          {communityPosts.map((post, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-[#0a0a0f] p-10 border border-white/5 flex flex-col justify-between group hover:bg-[#11111a] transition-all relative overflow-hidden"
            >
              {/* Corner Accent */}
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#CCFF00] opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div>
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center">
                      <MessageSquare className="w-4 h-4 text-white/40 group-hover:text-[#CCFF00] transition-colors" />
                    </div>
                    <div>
                      <h4 className="text-white text-[10px] font-black tracking-widest uppercase">{post.author}</h4>
                      <p className="text-white/20 text-[9px] font-black uppercase tracking-widest">{post.platform}</p>
                    </div>
                  </div>
                  <Zap className="w-4 h-4 text-[#CCFF00] opacity-0 group-hover:opacity-100 transition-all group-hover:scale-110" />
                </div>

                <p className="text-white/70 text-base font-bold uppercase italic tracking-tight leading-relaxed mb-12">
                  &quot;{post.content}&quot;
                </p>
              </div>

              <div className="flex items-center justify-between pt-8 border-t border-white/5">
                <span className="text-[9px] font-black uppercase tracking-widest text-white/20 group-hover:text-[#CCFF00]/50 transition-colors">
                  {post.stats}
                </span>
                <a href={post.link} target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors">
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
           initial={{ opacity: 0 }}
           whileInView={{ opacity: 1 }}
           viewport={{ once: true }}
           transition={{ delay: 0.5 }}
           className="mt-20 flex flex-col items-center gap-6"
        >
          <div className="h-[2px] w-24 bg-white/10" />
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 italic">Join the frequency // Worldwide verified</p>
        </motion.div>
      </div>
    </section>
  );
}
