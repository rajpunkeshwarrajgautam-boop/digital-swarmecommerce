"use client";

import { motion } from "framer-motion";
import { Search, Calendar, Clock, ArrowRight, Rss } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

interface BlogPost {
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  slug: string;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    fetch('/api/blog')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setPosts(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch blog posts', err);
        setIsLoading(false);
      });
  }, []);

  // Dynamically extract unique categories from actual posts
  const dynamicCategories = ["All", ...Array.from(new Set(posts.map(p => p.category)))];

  const filteredPosts = activeCategory === "All" 
    ? posts 
    : posts.filter(post => post.category === activeCategory);

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
          {isLoading ? (
             <div className="text-primary text-sm font-bold animate-pulse">SYNCING WITH SWARM...</div>
          ) : (
            dynamicCategories.map((cat: string, i: number) => (
              <button 
                key={i}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 border-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all ${activeCategory === cat ? "bg-primary border-primary text-white italic shadow-[6px_6px_0_#fff]" : "bg-white/5 border-white/10 text-white/40 hover:border-white/20"}`}
              >
                {cat}
              </button>
            ))
          )}
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {filteredPosts.map((post, i) => (
            <Link key={i} href={`/blog/${post.slug}`} className="group cursor-pointer block">
              <motion.article 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
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
            </Link>
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
