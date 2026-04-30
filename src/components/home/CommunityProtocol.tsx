"use client";

import { useEffect, useState } from "react";
import { CreditCard, Download, Mail, Package } from "lucide-react";
import { motion } from "framer-motion";

interface StatItem {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
}

export function CommunityProtocol() {
  const [productCount, setProductCount] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data: unknown[]) => setProductCount(Array.isArray(data) ? data.length : null))
      .catch(() => setProductCount(null));
  }, []);

  const stats: StatItem[] = [
    {
      icon: Package,
      label: "Products Available",
      value: productCount !== null ? String(productCount) : "—",
      sub: "Instant download after payment",
    },
    {
      icon: CreditCard,
      label: "Payment Methods",
      value: "UPI · Cards · Net Banking",
      sub: "Secured via Cashfree gateway",
    },
    {
      icon: Download,
      label: "Download Type",
      value: "Instant",
      sub: "Link delivered post-checkout",
    },
    {
      icon: Mail,
      label: "Support",
      value: "Email",
      sub: "support@digitalswarm.in",
    },
  ];

  return (
    <section className="border-t border-white/5 bg-[#07070a] py-24 relative overflow-hidden">
      {/* Subtle grid backdrop */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-4 mb-16"
        >
          <div className="h-px flex-1 bg-white/5" />
          <span className="text-[10px] font-mono font-black uppercase tracking-[0.5em] text-white/20 italic">
            Honest_Store_Facts
          </span>
          <div className="h-px flex-1 bg-white/5" />
        </motion.div>

        {/* Stats grid */}
        <motion.div
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.08 },
            },
          }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5"
        >
          {stats.map(({ icon: Icon, label, value, sub }, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: { opacity: 0, y: 16 },
                show: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="group bg-[#07070a] p-10 flex flex-col gap-6 relative overflow-hidden hover:bg-white/[0.02] transition-colors duration-300"
            >
              {/* Gold reveal line on hover */}
              <div className="absolute top-0 left-0 right-0 h-px bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

              {/* Icon */}
              <div className="w-10 h-10 border border-white/8 flex items-center justify-center bg-white/3 group-hover:border-primary/30 transition-colors duration-300">
                <Icon className="w-4 h-4 text-primary" />
              </div>

              {/* Label */}
              <div className="flex flex-col gap-2">
                <span className="text-[9px] font-mono font-black uppercase tracking-[0.4em] text-white/25">
                  {label}
                </span>
                <span className="text-xl font-outfit font-black italic uppercase tracking-tighter text-white leading-tight">
                  {value}
                </span>
                {sub && (
                  <span className="text-[10px] font-mono text-white/20 leading-relaxed">
                    {sub}
                  </span>
                )}
              </div>

              {/* Corner accent */}
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-white/5 opacity-50" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
