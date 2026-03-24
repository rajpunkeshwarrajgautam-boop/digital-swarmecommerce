"use client";

import { motion } from "framer-motion";

export function TrustLogos() {
  const logos = [
    { name: "Stripe", url: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" },
    { name: "Vercel", url: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Vercel_logo_black.svg" },
    { name: "Google", url: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" },
    { name: "Meta", url: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg" },
    { name: "Netflix", url: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" },
    { name: "Airbnb", url: "https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg" }
  ];

  return (
    <div className="py-24 bg-background border-y border-secondary/5">
      <div className="container mx-auto px-6">
        <p className="text-center text-[11px] font-black uppercase tracking-[0.4em] text-secondary/40 mb-16 italic mix-blend-multiply">Trusted by developers at global leaders</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 items-center justify-center gap-12 md:gap-20">
          {logos.map((logo, i) => (
            <motion.img
              key={logo.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 0.5, y: 0 }}
              whileHover={{ opacity: 1, scale: 1.1 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              src={logo.url}
              alt={logo.name}
              className="h-6 md:h-8 mx-auto grayscale hover:grayscale-0 transition-all cursor-pointer invert-0"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
