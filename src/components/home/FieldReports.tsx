"use client";

import { motion } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

const REPORTS = [
  {
    name: "Alex Davydov",
    role: "Senior Frontend Lead",
    company: "Vercel / Next.js",
    content: "The Next.js SaaS Kit saved us 4 weeks of boilerplate heavy lifting. The architectural patterns are elite. Best investment for our dev pod this year.",
    avatar: "https://i.pravatar.cc/150?u=alex",
    product: "SaaS Starter Kit",
    rating: 5
  },
  {
    name: "Sarah Jenkins",
    role: "CTO",
    company: "FlowState AI",
    content: "We built our entire MVP on top of the AI Agent Boilerplate. The LangChain integration is seamless and the Tokyo Night UI is absolutely stunning.",
    avatar: "https://i.pravatar.cc/150?u=sarah",
    product: "AI Agent Boilerplate",
    rating: 5
  },
  {
    name: "Marcus Thorne",
    role: "Fullstack Engineer",
    company: "Independent",
    content: "Digital Swarm is the absolute standard. The TypeScript Dashboard template is strictly typed and production-ready out of the box. No fluff.",
    avatar: "https://i.pravatar.cc/150?u=marcus",
    product: "TS Dashboard",
    rating: 5
  },
  {
    name: "Elena Rossi",
    role: "Product Designer",
    company: "DesignCo",
    content: "The React UI Kit Pro components are a dream to work with. Perfect balance of accessibility and high-end aesthetics. Highly recommended.",
    avatar: "https://i.pravatar.cc/150?u=elena",
    product: "UI Kit Pro",
    rating: 5
  },
  {
    name: "David Chen",
    role: "Mobile Lead",
    company: "AppLaunch",
    content: "Fast-tracked our cross-platform deployment with the React Native starter. The Expo configuration is flawless. Truly built for developers.",
    avatar: "https://i.pravatar.cc/150?u=david",
    product: "Mobile App Starter",
    rating: 4.9
  },
  {
    name: "Sophie Bennett",
    role: "Open Source Contributor",
    company: "GitHub",
    content: "The Chrome Extension template is the most MV3-compliant kit I've found. Clean, modular, and easy to extend. Total game changer.",
    avatar: "https://i.pravatar.cc/150?u=sophie",
    product: "Chrome Ext Kit",
    rating: 5
  }
];

export function FieldReports() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % REPORTS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-32 bg-background overflow-hidden relative border-y border-secondary/5">
      <div className="container px-6 mx-auto relative z-10 w-full max-w-7xl">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-black text-secondary tracking-tighter uppercase italic leading-none mb-6">
            What 2,000+ <span className="text-primary italic">Developers</span> Say
          </h2>
          <p className="text-secondary/50 font-bold text-lg uppercase tracking-tight">
            Verified reports from the engineering frontlines.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden bg-white rounded-[3rem] border-4 border-secondary/5 shadow-2xl p-12 md:p-16 relative">
            <Quote className="absolute top-10 right-10 w-20 h-20 text-secondary/5 -z-0" />
            
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="relative z-10"
            >
              <div className="flex items-center gap-6 mb-10">
                <img 
                  src={REPORTS[index].avatar} 
                  className="w-20 h-20 rounded-2xl border-2 border-primary/20 p-1"
                  alt={REPORTS[index].name} 
                />
                <div className="flex flex-col">
                  <h4 className="text-2xl font-black text-secondary italic leading-none uppercase tracking-tighter">{REPORTS[index].name}</h4>
                  <p className="text-sm font-bold text-secondary/40 uppercase tracking-widest mt-1">
                    {REPORTS[index].role} <span className="text-primary">@</span> {REPORTS[index].company}
                  </p>
                </div>
              </div>

              <p className="text-xl md:text-3xl font-black text-secondary italic tracking-tight leading-snug mb-10">
                "{REPORTS[index].content}"
              </p>

              <div className="flex items-center justify-between pt-8 border-t border-secondary/5">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-black uppercase text-secondary/30 tracking-widest">Protocol Purchased</span>
                  <span className="text-xs font-black uppercase text-primary italic tracking-tight">{REPORTS[index].product}</span>
                </div>
                <div className="flex gap-1">
                   {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 text-primary fill-primary" />)}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-center gap-4 mt-12">
            <button 
              onClick={() => setIndex((prev) => (prev - 1 + REPORTS.length) % REPORTS.length)}
              className="w-14 h-14 rounded-2xl bg-white border-2 border-secondary/5 flex items-center justify-center hover:bg-primary/10 hover:border-primary/20 transition-all shadow-xl"
            >
              <ChevronLeft className="w-6 h-6 text-secondary" />
            </button>
            <div className="flex items-center gap-2">
              {REPORTS.map((_, i) => (
                <div 
                  key={i} 
                  className={`h-1.5 transition-all rounded-full ${i === index ? 'w-8 bg-primary' : 'w-2 bg-secondary/10'}`} 
                />
              ))}
            </div>
            <button 
              onClick={() => setIndex((prev) => (prev + 1) % REPORTS.length)}
              className="w-14 h-14 rounded-2xl bg-white border-2 border-secondary/5 flex items-center justify-center hover:bg-primary/10 hover:border-primary/20 transition-all shadow-xl"
            >
              <ChevronRight className="w-6 h-6 text-secondary" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
