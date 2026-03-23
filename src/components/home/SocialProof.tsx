"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    quote: "The Next.js SaaS starter kit saved me 3 weeks of setup time. I launched my MVP the same day I bought it.",
    name: "Arjun Mehta",
    title: "Indie Founder, SaaS startup",
    rating: 5,
    initials: "AM",
    color: "#60a5fa", // pastel blue
  },
  {
    quote: "I downloaded the AI agent boilerplate and had my first customer within 48 hours. The code quality is production-grade.",
    name: "Priya Sharma",
    title: "Freelance Developer",
    rating: 5,
    initials: "PS",
    color: "#34d399", // pastel green
  },
  {
    quote: "Been going through 4 UI kits and this one is by far the cleanest. Dark mode just works, no fixes needed.",
    name: "Rahul Gupta",
    title: "Senior Frontend Engineer",
    rating: 5,
    initials: "RG",
    color: "#f472b6", // pastel pink
  },
];

const stats = [
  { value: "50,000+", label: "Leads Generated" },
  { value: "₹1 Cr+", label: "Managed Ad Spend" },
  { value: "300%", label: "Avg. ROAS Increase" },
  { value: "100+", label: "Scaling Partners" },
];

const brands = [
  "AlphaTech", "SwarmLogistics", "NeonClothing", "CyberRetail", "NexusFinance"
];

export function SocialProof() {
  return (
    <section className="py-24 bg-gray-50 border-y border-gray-100 relative overflow-hidden">
      <div className="container mx-auto px-6 w-full max-w-7xl relative z-10">
        
        {/* Trusted By Strip */}
        <div className="mb-20 text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-8">Trusted by visionary teams</p>
            <div className="flex flex-wrap justify-center items-center gap-10 md:gap-20 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                {brands.map((brand, i) => (
                    <span key={i} className="text-xl md:text-3xl font-extrabold tracking-tight text-gray-800 hover:text-blue-600 transition-colors cursor-default">
                        {brand}
                    </span>
                ))}
            </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-24 max-w-5xl mx-auto bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="text-center"
            >
              <p className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2">{stat.value}</p>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Section title */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            Customer <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">Stories</span>
          </h2>
          <p className="text-gray-500 font-medium mt-4 text-lg">See why thousands of developers choose our architecture</p>
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="bg-white border border-gray-100 rounded-3xl p-8 flex flex-col gap-5 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Stars */}
              <div className="flex gap-1">
                {Array.from({ length: t.rating }).map((_, s) => (
                  <Star key={s} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              {/* Quote */}
              <p className="text-base text-gray-600 font-medium leading-relaxed grow">
                "{t.quote}"
              </p>
              {/* Author */}
              <div className="flex items-center gap-4 mt-2">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-inner"
                  style={{ background: t.color }}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="font-bold text-gray-900">{t.name}</p>
                  <p className="text-sm text-gray-500 font-medium">{t.title}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
