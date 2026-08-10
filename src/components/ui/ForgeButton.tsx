"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";

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
  const reduceMotion = useReducedMotion();
  const baseStyles = "relative inline-flex items-center justify-center rounded-xl font-outfit font-black uppercase tracking-[0.08em] transition-colors duration-300 cursor-pointer overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#050509]";

  const sizeStyles = {
    sm: "px-4 py-2 text-[10px]",
    md: "px-7 py-3 text-xs",
    lg: "px-9 py-4 text-xs md:text-sm",
    xl: "px-12 py-5 text-base",
  };

  const variantStyles = {
    primary: "border border-[#f0d89b]/35 bg-[linear-gradient(110deg,#b8914a,#e4c77d_48%,#b28a43)] text-[#09090d] shadow-[0_14px_40px_rgba(224,191,117,.14)] hover:brightness-110",
    accent: "border border-accent/30 bg-accent text-black hover:bg-white",
    outline: "border border-white/12 bg-white/[0.035] text-[#f6f1e8] backdrop-blur-xl hover:border-primary/45 hover:bg-primary/[0.07] hover:text-primary",
    ghost: "border border-transparent bg-transparent text-white/45 hover:text-primary",
  };

  return (
    <motion.button
      whileHover={reduceMotion ? undefined : { y: -2, scale: 1.015 }}
      whileTap={reduceMotion ? undefined : { scale: 0.985 }}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...(props as React.ComponentPropsWithoutRef<typeof motion.button>)}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      {variant === "primary" && (
        <span className="pointer-events-none absolute inset-x-8 top-0 h-px bg-white/70 blur-[.2px]" />
      )}
    </motion.button>
  );
};
