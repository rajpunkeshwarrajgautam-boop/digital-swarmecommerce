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
    color: "hsl(250,84%,60%)",
  },
  {
    quote: "I downloaded the AI agent boilerplate and had my first customer within 48 hours. The code quality is production-grade.",
    name: "Priya Sharma",
    title: "Freelance Developer",
    rating: 5,
    initials: "PS",
    color: "hsl(160,60%,45%)",
  },
  {
    quote: "Been going through 4 UI kits and this one is by far the cleanest. Dark mode just works, no fixes needed.",
    name: "Rahul Gupta",
    title: "Senior Frontend Engineer",
    rating: 5,
    initials: "RG",
    color: "hsl(30,90%,55%)",
  },
];

const stats = [
  { value: "2,000+", label: "Happy Customers" },
  { value: "98%", label: "5-Star Reviews" },
  { value: "50+", label: "Products" },
  { value: "< 5 min", label: "Avg. Setup Time" },
];

export function SocialProof() {
  return (
    <section className="py-24 bg-secondary/20 border-t border-border/40">
      <div className="container mx-auto px-4">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20 max-w-3xl mx-auto">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="text-center"
            >
              <p className="text-3xl md:text-4xl font-black text-primary">{stat.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Section title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">
            What Our Customers Say
          </h2>
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="bg-card border border-border rounded-2xl p-6 flex flex-col gap-4 hover:border-primary/40 transition-colors"
            >
              {/* Stars */}
              <div className="flex gap-0.5">
                {Array.from({ length: t.rating }).map((_, s) => (
                  <Star key={s} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                ))}
              </div>
              {/* Quote */}
              <p className="text-sm text-muted-foreground leading-relaxed grow">
                &quot;{t.quote}&quot;
              </p>
              {/* Author */}
              <div className="flex items-center gap-3 mt-2 border-t border-border pt-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                  style={{ background: t.color }}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="font-semibold text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.title}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
