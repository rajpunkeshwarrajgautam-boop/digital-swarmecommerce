"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function TrustLogos() {
  const logos = [
    { name: "Cashfree", url: "https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg" }, // Placeholder for Cashfree until real SVG found
    { name: "Vercel", url: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Vercel_logo_black.svg" },
    { name: "Supabase", url: "https://upload.wikimedia.org/wikipedia/commons/3/3d/Supabase_logo.svg" },
    { name: "Google", url: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" },
    { name: "Next.js", url: "https://upload.wikimedia.org/wikipedia/commons/8/8e/Nextjs-logo.svg" },
    { name: "Clerk", url: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Clerk_logo.svg" }
  ];

  return (
    <div className="py-24 bg-background border-y border-secondary/5">
      <div className="container mx-auto px-6">
        <p className="text-center text-[11px] font-black uppercase tracking-[0.4em] text-secondary/40 mb-16 italic mix-blend-multiply">Trusted by developers at global leaders</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 items-center justify-center gap-12 md:gap-20">
          {logos.map((logo, i) => (
            <motion.div
              key={logo.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 0.5, y: 0 }}
              whileHover={{ opacity: 1, scale: 1.1 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="relative h-6 md:h-8 w-24 mx-auto"
            >
              <Image
                src={logo.url}
                alt={logo.name}
                fill
                className="object-contain grayscale hover:grayscale-0 transition-all cursor-pointer invert-0"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
