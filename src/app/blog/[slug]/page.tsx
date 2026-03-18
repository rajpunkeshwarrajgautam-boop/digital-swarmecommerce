"use client";

import { motion } from "framer-motion";
import { blogPosts } from "@/lib/blog";
import { notFound } from "next/navigation";
import { use } from "react";
import { ArrowLeft, User, Calendar, Tag } from "lucide-react";
import Link from "next/link";

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
     notFound();
  }

  return (
    <div className="min-h-screen bg-background text-white pb-32">
       {/* Breadcrumb / Back */}
       <div className="container mx-auto px-6 pt-24 pb-12">
          <Link href="/blog" className="group inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.4em] text-white/40 hover:text-primary transition-colors italic">
             <ArrowLeft className="w-4 h-4 group-hover:-translate-x-2 transition-transform" />
             [ BACK_TO_LOGS ]
          </Link>
       </div>

       <article className="container mx-auto px-6 max-w-4xl">
          {/* Post Header */}
          <div className="space-y-12">
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.8 }}
              className="bg-primary text-black px-4 py-1 text-[10px] font-black uppercase tracking-[0.5em] origin-left w-fit italic"
            >
              [ Strategic_Performance ]
            </motion.div>

            <h1 className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter leading-[0.9]">
              {post.title}
            </h1>

            <div className="flex flex-wrap gap-x-12 gap-y-6 pt-8 border-y border-white/5 py-8 text-[10px] font-black uppercase tracking-[0.4em] text-white/30 italic">
               <span className="flex items-center gap-3"><User className="w-4 h-4 text-primary" /> {post.author}</span>
               <span className="flex items-center gap-3"><Calendar className="w-4 h-4 text-primary" /> {post.date}</span>
               <span className="flex items-center gap-3"><Tag className="w-4 h-4 text-primary" /> {post.category.replace('_', ' ')}</span>
            </div>

            <p className="text-2xl md:text-3xl text-primary font-black italic tracking-tighter leading-tight max-w-3xl opacity-80">
              {post.excerpt}
            </p>
          </div>

          {/* Post Content */}
          <div className="mt-24 prose prose-invert prose-headings:font-black prose-headings:italic prose-headings:uppercase prose-headings:tracking-tighter prose-p:text-xl prose-p:text-white/50 prose-p:font-bold prose-p:uppercase prose-p:italic prose-p:tracking-tighter prose-p:leading-relaxed prose-strong:text-white prose-strong:font-black max-w-none">
             <div dangerouslySetInnerHTML={{ __html: post.content.replace(/\n\n/g, '<br/><br/>').replace(/### (.*)/g, '<h3 class="text-3xl mt-12 mb-6">$1</h3>').replace(/#### (.*)/g, '<h4 class="text-xl mt-8 mb-4 text-primary">$1</h4>') }} />
          </div>

          {/* Final Message */}
          <div className="mt-32 p-12 bg-primary/5 border border-primary/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 blur-3xl bg-primary w-64 h-64 rounded-none translate-x-1/2 -translate-y-1/2 transition-all group-hover:scale-150 duration-700" />
            <div className="relative z-10 space-y-6">
                <h2 className="text-3xl font-black italic uppercase tracking-tighter text-primary leading-none">Transmission_End</h2>
                <p className="text-lg text-white/50 font-bold uppercase italic tracking-tighter leading-tight max-w-xl">
                  Ready to deploy these protocols in your mainframe? <br/>
                  Our agents are standing by for tactical consultation.
                </p>
                <div className="pt-6">
                  <Link href="/contact">
                    <button className="bg-primary text-black font-black px-12 py-5 uppercase italic tracking-[0.3em] hover:bg-white transition-all text-xs border-none shadow-[15px_15px_0px_rgba(var(--primary-rgb),0.1)] active:shadow-none">
                      Initiate_Consultation
                    </button>
                  </Link>
                </div>
            </div>
          </div>
       </article>
    </div>
  );
}
