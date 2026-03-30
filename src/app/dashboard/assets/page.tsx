"use client";

import { motion } from "framer-motion";
import { Package, Download } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { getUserAssets } from "@/app/actions/user-assets";
import { useEffect, useState } from "react";
import Link from "next/link";

type Asset = {
  id: string;
  status: string;
  license_key: string;
  products?: {
    name: string;
    image: string;
    version: string;
    download_url?: string;
  } | {
    name: string;
    image: string;
    version: string;
    download_url?: string;
  }[];
};

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await getUserAssets();
        if (res.success && res.assets) {
          setAssets(res.assets as Asset[]);
        }
      } catch (e) {
        console.error("Assets fetch error", e);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

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
        {isLoading ? (
           <div className="text-white/30 italic font-black uppercase">Querying active protocols...</div>
        ) : assets.length === 0 ? (
           <div className="text-white/30 italic font-black uppercase">No active protocols found.</div>
        ) : assets.map((asset, i) => {
          const product = Array.isArray(asset.products) ? asset.products[0] : asset.products;
          return (
            <motion.div 
              key={asset.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="group relative"
            >
              <div className="aspect-square bg-white/5 border-4 border-black mb-6 overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500 shadow-[8px_8px_0_#000] group-hover:shadow-[12px_12px_0_#ff6b35] relative">
                 <Image 
                   src={product?.image || "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=300"} 
                   alt={product?.name || "Asset"} 
                   fill 
                   className="object-cover group-hover:scale-110 transition-transform duration-700" 
                 />
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-white/30">
                  <span>VER_{product?.version || '1.0'}</span>
                  <span className="truncate ml-2">ID_{asset.id.split('-')[0]}</span>
                </div>
                <h3 className="text-xl font-black italic uppercase tracking-tighter leading-none truncate">{product?.name || "Unknown"}</h3>
                
                <div className="flex gap-4 pt-4">
                   <Link href={product?.download_url || "#"} target="_blank" className="flex-1">
                     <Button className="w-full bg-white text-black font-black uppercase italic text-[10px] tracking-widest hover:bg-primary hover:text-white transition-all">
                        <Download className="w-3.5 h-3.5 mr-2" /> Extract
                     </Button>
                   </Link>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  );
}
