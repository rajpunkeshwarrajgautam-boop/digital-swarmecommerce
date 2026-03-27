"use client";

import React from "react";
import { motion } from "framer-motion";

interface ForgeButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "accent" | "outline" | "ghost";
  size?: "sm" | "md" | "lg" | "xl";
  children: React.ReactNode;
}

export const ForgeButton: React.FC<ForgeButtonProps> = ({
  variant = "primary",
  size = "md",
  children,
  className = "",
  ...props
}) => {
  const baseStyles = "relative inline-flex items-center justify-center font-outfit font-black uppercase italic tracking-wider transition-all duration-300 cursor-pointer overflow-hidden";
  
  const sizeStyles = {
    sm: "px-4 py-2 text-[10px]",
    md: "px-8 py-3 text-sm",
    lg: "px-12 py-4 text-base",
    xl: "px-16 py-6 text-xl",
  };

  const variantStyles = {
    primary: "bg-primary text-black hover:bg-white shadow-[0_0_20px_rgba(255,107,53,0.1)]",
    accent: "bg-accent text-white hover:bg-white hover:text-black shadow-[0_0_20px_rgba(168,85,247,0.1)]",
    outline: "bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-black",
    ghost: "bg-transparent text-white/40 hover:text-primary",
  };

  // Aggressive Industrial Clip
  const clipPath = "polygon(8% 0, 100% 0, 92% 100%, 0 100%)";

  return (
    <motion.button
      whileHover={{ scale: 1.02, x: 2 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      style={{ clipPath }}
      {...(props as React.ComponentPropsWithoutRef<typeof motion.button>)}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      <motion.div
        className="absolute inset-0 bg-white opacity-0"
        whileHover={{ opacity: 0.1 }}
      />
    </motion.button>
  );
};
