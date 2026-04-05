"use client";

import { motion } from 'framer-motion';
import { ShieldCheck, ArrowRight, Clock } from 'lucide-react';
import Link from 'next/link';

interface AssetPreviewProps {
  token: {
    id: string;
    product_id: string;
    created_at: string;
    product: {
      name: string;
      category: string;
      image: string;
    }
  }
}

export function AssetPreview({ token }: AssetPreviewProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative"
    >
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
      
      <div className="relative glass-panel rounded-2xl overflow-hidden border border-white/5 group-hover:border-white/20 transition-all">
        {/* Asset Image */}
        <div className="relative h-40 overflow-hidden bg-white/5">
          <img 
            src={token.product.image} 
            alt={token.product.name} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          
          <div className="absolute top-3 left-3">
            <div className="px-2 py-0.5 bg-primary/20 backdrop-blur-md border border-primary/40 rounded-full flex items-center gap-1.5">
              <ShieldCheck className="w-2.5 h-2.5 text-primary" />
              <span className="text-[8px] font-mono font-black text-white/80 tracking-widest">{token.id}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3">
          <div className="space-y-0.5">
            <h3 className="text-lg font-black italic uppercase tracking-tighter text-white/90 group-hover:text-primary transition-colors">
              {token.product.name}
            </h3>
            <p className="text-[9px] font-mono font-black uppercase tracking-[0.2em] text-white/20">{token.product.category}</p>
          </div>

          <div className="flex items-center justify-between text-[8px] font-mono text-white/30 uppercase tracking-widest border-t border-white/5 pt-3">
            <div className="flex items-center gap-1">
              <Clock className="w-2.5 h-2.5" />
              {new Date(token.created_at).toLocaleDateString()}
            </div>
            <Link href={`/product/${token.product_id}`} className="hover:text-primary transition-colors flex items-center gap-1 group/link">
              View_Artifact <ArrowRight className="w-2.5 h-2.5 group-hover/link:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
