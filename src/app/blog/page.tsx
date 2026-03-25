"use client";

import { motion } from "framer-motion";
import { Search, Calendar, Clock, ArrowRight, Rss } from "lucide-react";
import Image from "next/image";
import { useState } from "react";


const blogPosts = [
  {
    title: "The Architecture of Speed: Next.js 14 Parallel Routes",
    excerpt: "How we achieved 100/100 Lighthouse scores using parallel routing and edge computing.",
    category: "Engineering",
    date: "MAR 22, 2026",
    readTime: "5 MIN READ",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800",
    slug: "architecture-of-speed"
  },
  {
    title: "Securing Digital Assets: HMAC Signature Verification",
    excerpt: "Deep dive into our standard security protocol for digital marketplace fulfillment.",
    category: "Security",
    date: "MAR 18, 2026",
    readTime: "8 MIN READ",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800",
    slug: "securing-digital-assets"
  },
  {
    title: "Atomic Design in the ONO Industrial Aesthetic",
    excerpt: "Why we chose high-contrast, sharp-edged UI for the modern developer experience.",
    category: "Design",
    date: "MAR 12, 2026",
    readTime: "4 MIN READ",
    image: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?auto=format&fit=crop&q=80&w=800",
    slug: "atomic-design-ono"
  },
  {
    title: "Scaling to 10k Users: Supabase vs Traditional SQL",
    excerpt: "The truth about serverless databases in rapid deployment environments.",
    category: "DevOps",
    date: "MAR 05, 2026",
    readTime: "6 MIN READ",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800",
    slug: "scaling-supabase"
  }
];

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const categories = ["All", "Engineering", "Security", "Design", "DevOps"];

  const filteredPosts = activeCategory === "All" 
    ? blogPosts 
    : blogPosts.filter(post => post.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white pt-32 pb-20 font-mono">
      <div className="container mx-auto px-6 max-w-7xl">
        
        <header className="mb-20">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="p-2 bg-primary/10 border border-primary/20 rounded-lg">
              <Rss className="w-5 h-5 text-primary" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary italic">Field Reports</span>
          </motion.div>
          
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-none"
            >
              Engineering <br />
              <span className="text-white/20 italic">Intelligence</span>
            </motion.h1>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="relative max-w-md w-full"
            >
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
              <input 
                type="text" 
                placeholder="Search Intelligence..."
                className="w-full bg-white/5 border-2 border-white/10 p-5 pl-12 focus:border-primary outline-none transition-all font-black uppercase tracking-widest text-xs"
              />
            </motion.div>
          </div>
        </header>

        {/* Categories */}
        <div className="flex flex-wrap gap-4 mb-16">
          {categories.map((cat, i) => (
            <button 
              key={i}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 border-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all ${activeCategory === cat ? "bg-primary border-primary text-white italic shadow-[6px_6px_0_#fff]" : "bg-white/5 border-white/10 text-white/40 hover:border-white/20"}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {filteredPosts.map((post, i) => (
            <motion.article 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="relative aspect-video rounded-4xl bg-black overflow-hidden border-b-4 border-black mb-8">
                  <Image 
                    src={post.image} 
                    alt={post.title} 
                    fill 
                    className="object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                <div className="absolute top-6 left-6 px-4 py-1.5 bg-black text-white text-[10px] font-black uppercase italic tracking-widest border border-white/10">
                  {post.category}
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-white/30">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5" /> {post.date}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5" /> {post.readTime}
                  </div>
                </div>
                
                <h3 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter leading-none group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                
                <p className="text-white/40 font-medium uppercase text-xs leading-relaxed max-w-xl">
                  {post.excerpt}
                </p>
                
                <div className="pt-4 flex items-center gap-2 text-primary font-black uppercase italic text-xs tracking-widest opacity-0 group-hover:opacity-100 transition-all">
                  Read Report <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Newsletter Hook */}
        <div className="mt-32 p-16 bg-white border-8 border-black text-black text-center shadow-[32px_32px_0_#ff6b35] relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto">
             <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter mb-6 leading-none">
                Subscribe to <br />
                The <span className="underline decoration-[#ff6b35]">Protocol</span>.
             </h2>
             <p className="text-black/40 font-black uppercase text-[10px] tracking-widest mb-10 max-w-sm mx-auto">
                No spam. Just hardened engineering architectures delivered directly to your inbox.
             </p>
             <div className="flex flex-col sm:flex-row gap-4">
                <input 
                  type="email" 
                  placeholder="Enter Operation Email" 
                  className="flex-1 bg-black/5 border-4 border-black p-5 font-black uppercase italic tracking-tighter text-lg focus:bg-[#CCFF00] focus:ring-0 outline-none transition-all shadow-[6px_6px_0_#000]"
                />
                <button className="px-12 py-5 bg-black text-white font-black uppercase tracking-widest hover:bg-primary transition-all">
                   Join Swarm
                </button>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}
