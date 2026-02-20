"use client";

import { motion } from "framer-motion";
import React, { useState } from "react";

export function Accordion({ children }: { children: React.ReactNode }) {
  return <div className="space-y-4">{children}</div>;
}

export function AccordionItem({ title, content }: { title: string, content: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-card">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-secondary/50 transition-colors"
      >
        <span className="font-medium">{title}</span>
        <span className={`transform transition-transform ${isOpen ? "rotate-180" : ""}`}>▼</span>
      </button>
      <motion.div 
        initial={false}
        animate={{ height: isOpen ? "auto" : 0 }}
        className="overflow-hidden"
      >
        <div className="px-6 py-4 text-muted-foreground border-t border-border bg-secondary/10">
          {content}
        </div>
      </motion.div>
    </div>
  );
}
