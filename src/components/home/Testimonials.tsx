"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Alex Dev",
    role: "Indie Hacker",
    content: "The components are incredibly well-architected. I literally bought the AI agent boilerplate on Friday and launched my SaaS by Monday. Crazy ROI.",
    rating: 5,
  },
  {
    name: "Sarah Chen",
    role: "Frontend Engineer",
    content: "Digital Swarm saved me over 3 weeks of miserable API integration work. The documentation is pristine and the codebase is completely type-safe.",
    rating: 5,
  },
  {
    name: "Marcus Thorne",
    role: "Startup Founder",
    content: "Best UI kits I have ever purchased. period. Better than most subscriptions that charge $40/month. The pricing strategy here is wildly generous.",
    rating: 5,
  },
  {
    name: "Elena Rodriguez",
    role: "Full-Stack Developer",
    content: "I've purchased templates before that were spaghetti code. These are different. The code looks like it was written by an elite engineering team.",
    rating: 5,
  }
];

export function Testimonials() {
  return (
    <section className="py-24 bg-background border-t border-border/40 overflow-hidden relative">
      <div className="container mx-auto px-4">
        
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold font-titan mb-4 text-foreground">
            Trusted by 2,000+ <span className="text-gradient">Developers</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Don&apos;t just take our word for it. Here is what indie hackers and senior engineers are saying.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="uiverse-glass-container h-full"
            >
                <div className="uiverse-glass-inner p-6 flex flex-col h-full bg-card border border-white/5">
                    <div className="flex gap-1 mb-4">
                        {[...Array(t.rating)].map((_, idx) => (
                            <Star key={idx} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                    </div>
                    
                    <p className="text-muted-foreground text-sm italic mb-6 grow leading-relaxed">
                        &quot;{t.content}&quot;
                    </p>
                    
                    <div className="mt-auto border-t border-border/50 pt-4 flex flex-col">
                        <span className="font-bold text-foreground text-sm">{t.name}</span>
                        <span className="text-xs text-primary font-medium">{t.role}</span>
                    </div>
                </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
