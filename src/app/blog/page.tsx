"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { blogPosts, BlogPost } from "@/lib/blog";
import { ArrowRight, BookOpen, Clock, User } from "lucide-react";

export default function BlogListingPage() {
  return (
    <div className="container mx-auto px-6 py-24 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-16"
      >
        {/* Header */}
        <div className="flex flex-col gap-6">
          <div className="bg-primary text-black px-4 py-1 text-[10px] font-black uppercase tracking-[0.5em] w-fit italic">
            [ INTEL_HUB_v1.0 ]
          </div>
          <h1 className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter leading-none">
            Strategic_ <br/> <span className="text-primary italic">Intelligence_Logs</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/40 font-bold uppercase italic tracking-tighter max-w-2xl leading-tight">
            Advanced blueprints and performance protocols for the high-velocity developer ecosystem.
          </p>
        </div>

        {/* Featured Post (Latest) */}
        <FeaturedPost post={blogPosts[0]} />

        {/* Post Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 border-t border-white/5 pt-16">
          {blogPosts.slice(1).map((post, i) => (
            <PostCard key={i} post={post} index={i} />
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function FeaturedPost({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`}>
      <motion.div 
        whileHover={{ x: 10 }}
        className="group relative overflow-hidden bg-black/40 border border-white/5 p-8 md:p-12 border-l-4 border-l-primary flex flex-col md:flex-row gap-12 transition-all"
      >
        <div className="flex-1 space-y-6">
           <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.3em] text-white/30 italic">
              <span className="text-primary border border-primary/20 px-3 py-1 bg-primary/5">{post.category}</span>
              <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> {post.date}</span>
           </div>
           <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter leading-none group-hover:text-primary transition-colors">
             {post.title}
           </h2>
           <p className="text-lg text-white/50 font-bold uppercase italic tracking-tighter leading-relaxed max-w-2xl">
              {post.excerpt}
           </p>
           <div className="flex items-center gap-4 text-xs font-black uppercase italic tracking-widest text-primary pt-4 group-hover:gap-8 transition-all">
              ACCESS_LOG <ArrowRight className="w-5 h-5" />
           </div>
        </div>
        <div className="w-full md:w-1/3 aspect-video md:aspect-square bg-primary/10 border border-primary/20 flex items-center justify-center relative overflow-hidden">
            <BookOpen className="w-24 h-24 text-primary/20 absolute group-hover:scale-150 group-hover:rotate-12 transition-all duration-700" />
            <div className="text-[10px] font-black uppercase tracking-[0.8em] text-primary rotate-90 transform opacity-20 group-hover:opacity-100 transition-opacity">INTEL_POD_{post.slug[0].toUpperCase()}</div>
        </div>
      </motion.div>
    </Link>
  );
}

function PostCard({ post, index }: { post: BlogPost; index: number }) {
  return (
    <Link href={`/blog/${post.slug}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.1 }}
        whileHover={{ y: -10 }}
        className="group h-full bg-black/40 border border-white/5 p-8 flex flex-col gap-6 hover:border-primary/40 transition-all border-b-4 border-b-transparent hover:border-b-primary"
      >
        <div className="text-[9px] font-black uppercase tracking-[0.4em] text-primary/50 group-hover:text-primary transition-colors italic">
          {post.category} // {post.date}
        </div>
        <h3 className="text-2xl font-black italic uppercase tracking-tighter leading-none group-hover:text-white transition-colors">
          {post.title}
        </h3>
        <p className="text-sm text-white/40 font-bold uppercase italic tracking-tighter leading-relaxed grow">
          {post.excerpt}
        </p>
        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-white/20 mt-4 border-t border-white/5 pt-6">
          <span className="flex items-center gap-2"><User className="w-3 h-3 text-primary" /> {post.author}</span>
          <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
        </div>
      </motion.div>
    </Link>
  );
}
