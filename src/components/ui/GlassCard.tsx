"use client";

import React from "react";
import { motion } from "framer-motion";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = "",
  delay = 0 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -5, borderColor: "rgba(255, 107, 53, 0.3)" }}
      className={`relative glass-card p-6 border border-white/5 bg-white/5 backdrop-blur-xl ${className}`}
    >
      {/* Accent Glow Top Right */}
      <div className="absolute -top-10 -right-10 w-20 h-20 bg-primary/20 blur-[50px] pointer-events-none" />
      
      {/* Technical Corner Marking */}
      <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-primary/30" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-primary/30" />
      
      <div className="relative z-10 font-inter">
        {children}
      </div>
    </motion.div>
  );
};
