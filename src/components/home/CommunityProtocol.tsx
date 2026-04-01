"use client";

import { motion } from "framer-motion";
import { MessageSquare, Users, Zap, ExternalLink, Globe } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

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
    <section className="bg-[#0a0a0f] py-40 overflow-hidden relative border-t border-white/5">
      {/* Decorative Technical Grid backdrop */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{ 
            backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90 text, #fff 1px, transparent 1px)`,
            backgroundSize: '80px 80px'
        }} 
      />

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-24">
          <div className="max-w-2xl">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-primary text-black text-[10px] font-mono font-black uppercase tracking-[0.3em] mb-6 italic"
            >
              <Users className="w-3 h-3" />
              Community Reviews
            </motion.div>
            <h2 className="text-6xl md:text-8xl font-outfit font-black text-white tracking-tighter uppercase italic leading-[0.8]">
              Global <br />
              <span className="text-primary italic">Feedback</span>
            </h2>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-mono uppercase tracking-widest text-white/20">Active Uplinks</p>
              <p className="text-xl font-outfit font-black text-white italic uppercase tracking-tighter">14,281 Protocols</p>
            </div>
            <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center relative">
                 <Globe className="w-8 h-8 text-primary/40 animate-pulse" />
                 <div className="absolute inset-0 border-2 border-primary/20 border-t-primary rounded-full animate-spin-slow" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {communityPosts.map((post, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="h-full"
            >
              <GlassCard className="p-10 border-white/10 bg-white/2 flex flex-col justify-between h-full group hover:bg-white/5 transition-all relative overflow-hidden">
                {/* Corner Tech Accent */}
                <div className="absolute top-0 right-0 w-10 h-10 border-t border-r border-primary/20 opacity-40" />
                
                <div>
                  <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white/5 flex items-center justify-center border border-white/5">
                        <MessageSquare className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="text-white text-[11px] font-mono font-black tracking-widest uppercase">{post.author}</h4>
                        <p className="text-white/20 text-[9px] font-mono uppercase tracking-widest">{post.platform}</p>
                      </div>
                    </div>
                    <Zap className="w-4 h-4 text-accent animate-pulse" />
                  </div>

                  <p className="text-white/70 text-lg font-inter leading-relaxed mb-12 italic border-l-2 border-primary/10 pl-6">
                    &quot;{post.content}&quot;
                  </p>
                </div>

                <div className="flex items-center justify-between pt-8 border-t border-white/5">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-white/20 group-hover:text-primary transition-colors">
                    {post.stats}
                  </span>
                  <a href={post.link} target="_blank" rel="noopener noreferrer" className="p-2 border border-white/10 hover:border-primary/40 text-white/20 hover:text-primary transition-all rounded-sm">
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        <motion.div 
           initial={{ opacity: 0 }}
           whileInView={{ opacity: 1 }}
           viewport={{ once: true }}
           transition={{ delay: 0.5 }}
           className="mt-24 flex flex-col items-center gap-8"
        >
          <div className="h-px w-24 bg-white/10" />
          <p className="text-[10px] font-mono uppercase tracking-[0.5em] text-white/10 italic text-center">
            Join the Community / Scale Production / Build the Future
          </p>
        </motion.div>
      </div>
    </section>
  );
}
