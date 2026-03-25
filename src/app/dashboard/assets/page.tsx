"use client";

import { motion } from "framer-motion";
import { Package, Download, ExternalLink } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";

const assets = [
  {
    id: "p1",
    name: "AI Agent Workforce (V1.2)",
    acquired: "2026-03-22",
    version: "1.2.4",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=300"
  },
  {
    id: "p2",
    name: "SaaS Launchpad Pro",
    acquired: "2026-03-25",
    version: "2.0.1",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=300"
  }
];

export default function AssetsPage() {
  return (
    <div className="space-y-12">
      <header className="space-y-4">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 w-fit"
        >
          <Package className="w-4 h-4 text-primary" />
          <span className="text-[10px] font-black uppercase tracking-widest text-primary italic">Protocol Assets</span>
        </motion.div>
        <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter leading-none">
          Active <br />
          <span className="text-white/20 italic">Acquisitions</span>
        </h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {assets.map((asset, i) => (
          <motion.div 
            key={asset.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="group relative"
          >
            <div className="aspect-square bg-white/5 border-4 border-black mb-6 overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500 shadow-[8px_8px_0_#000] group-hover:shadow-[12px_12px_0_#ff6b35] relative">
               <Image 
                 src={asset.image} 
                 alt={asset.name} 
                 fill 
                 className="object-cover group-hover:scale-110 transition-transform duration-700" 
               />
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-white/30">
                <span>VER_{asset.version}</span>
                <span>ID_{asset.id}</span>
              </div>
              <h3 className="text-xl font-black italic uppercase tracking-tighter leading-none truncate">{asset.name}</h3>
              
              <div className="flex gap-4 pt-4">
                 <Button className="flex-1 bg-white text-black font-black uppercase italic text-[10px] tracking-widest hover:bg-primary hover:text-white transition-all">
                    <Download className="w-3.5 h-3.5 mr-2" /> Manifest
                 </Button>
                 <Button variant="outline" className="border-white/10 hover:border-primary group">
                    <ExternalLink className="w-4 h-4 text-white/30 group-hover:text-primary transition-colors" />
                 </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
