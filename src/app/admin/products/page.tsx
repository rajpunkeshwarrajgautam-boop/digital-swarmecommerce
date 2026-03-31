"use client";

import { motion } from "framer-motion";
import { Package, Plus, Trash2, Eye, EyeOff, Edit3, ShieldCheck } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { getAdminProducts, deleteAdminProduct, updateAdminProduct } from "@/app/actions/admin";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import Image from "next/image";
import { useToastStore } from "@/components/ui/ForgeToast";
import { AdminProduct } from "@/lib/types";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToast } = useToastStore();

  const fetchData = useCallback(async () => {
    try {
      const data = await getAdminProducts();
      setProducts(data as AdminProduct[]);
    } catch (e) {
      addToast("ERROR", "UPLINK_CRITICAL_FAULT", "FAILED TO RETRIEVE ASSET LEDGER");
    } finally {
      setIsLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  async function toggleVisibility(product: AdminProduct) {
    try {
      await updateAdminProduct(product.id, { is_visible: !product.is_visible });
      addToast("SUCCESS", "PROTOCOL_MODIFIED", "ASSET VISIBILITY UPDATED");
      fetchData();
    } catch (e) {
      addToast("ERROR", "UPLINK_FAILURE", "MANIFEST UPDATE REJECTED");
    }
  }

  async function toggleVerification(product: AdminProduct) {
    try {
      await updateAdminProduct(product.id, { is_verified: !product.is_verified });
      addToast("SUCCESS", "TRUST_PROTOCOL_UPDATED", "ASSET VERIFICATION TOGGLED");
      fetchData();
    } catch (e) {
      addToast("ERROR", "UPLINK_FAILURE", "VERIFICATION SYNC ERROR");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("DETONATE PRODUCT PROTOCOL? THIS ACTION IS IRREVERSIBLE.")) return;
    try {
      await deleteAdminProduct(id);
      addToast("SUCCESS", "ASSET_REMOVED", "PROTOCOL DELETED FROM CORE STORAGE");
      fetchData();
    } catch (e) {
      addToast("ERROR", "DETONATION_FAILED", "REMOVAL_SEQUENCE ERROR");
    }
  }

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/5">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[#CCFF00] text-[10px] font-black uppercase tracking-widest italic">
            <Package className="w-3 h-3" /> Asset_Management_v4
          </div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white">Inventory_Log</h1>
        </div>
        
        <Link href="/admin/products/add">
          <Button className="bg-[#CCFF00] text-black font-black uppercase italic tracking-widest px-8 py-6 rounded-none shadow-[6px_6px_0_#000] hover:translate-x-1 hover:-translate-y-1 transition-all active:shadow-none active:translate-x-1.5 active:-translate-y-1.5">
            <Plus className="w-5 h-5 mr-2" /> Inject_New_Protocol
          </Button>
        </Link>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {isLoading ? (
          <div className="text-white/20 italic font-black uppercase text-xs tracking-widest animate-pulse">Querying core_inventory...</div>
        ) : products.length === 0 ? (
          <div className="text-white/20 italic font-black uppercase text-xs tracking-widest border-2 border-dashed border-white/5 p-12 text-center">No active protocols detected.</div>
        ) : products.map((product, i) => (
          <motion.div 
            key={product.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`group flex flex-col md:flex-row items-center gap-8 p-6 bg-black/40 border-2 transition-all ${product.is_visible ? "border-white/5 hover:border-[#CCFF00]/40" : "border-red-500/20 opacity-60"}`}
          >
            <div className="w-20 h-20 bg-black border-2 border-white/10 shrink-0 relative overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500">
               <Image 
                 src={product.image || "/placeholder.jpg"} 
                 alt={product.name} 
                 fill 
                 className="object-cover" 
               />
            </div>

            <div className="flex-1 space-y-1 w-full text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-4">
                <span className="text-[10px] font-black text-white/30 uppercase tracking-[.2em]">VER_{product.version || "1.0"}</span>
                <span className={`text-[8px] font-black px-2 py-0.5 italic ${product.category === 'saas' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-purple-500/20 text-purple-400'}`}>
                   {product.category || "GENERAL"}
                </span>
              </div>
              <h3 className="text-xl font-black italic uppercase tracking-tighter text-white">{product.name}</h3>
              <p className="text-[10px] font-black text-white/20 uppercase tracking-widest italic truncate max-w-[400px]">ID_{product.id}</p>
            </div>

            <div className="flex flex-col items-center md:items-end gap-1 px-8 border-x-2 border-white/5 space-y-1">
               <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Ownership_Node</span>
               <span className="text-sm font-black italic text-[#CCFF00] font-mono tracking-tighter uppercase">{product.merchant_id || "SYSTEM"}</span>
            </div>

            <div className="flex flex-col items-center md:items-end gap-1 px-8 border-r-2 border-white/5 space-y-1">
               <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Market_Value</span>
               <span className="text-2xl font-black italic text-white">₹{product.price}</span>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto justify-center">
               <button 
                 onClick={() => toggleVerification(product)}
                 title="Toggle Verification"
                 className={`p-4 border-2 transition-all ${product.is_verified ? "border-[#CCFF00]/20 text-[#CCFF00] hover:bg-[#CCFF00]/10" : "border-yellow-500/40 text-yellow-500 hover:bg-yellow-500/10"}`}
               >
                 <ShieldCheck className="w-5 h-5" />
               </button>
               <button 
                 onClick={() => toggleVisibility(product)}
                 title="Toggle Visibility"
                 className={`p-4 border-2 transition-all ${product.is_visible ? "border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/10" : "border-red-500/40 text-red-400 hover:bg-red-500/10"}`}
               >
                 {product.is_visible ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
               </button>
               <button className="p-4 border-2 border-white/10 text-white/40 hover:text-white hover:bg-white/5 transition-all">
                 <Edit3 className="w-5 h-5" />
               </button>
               <button 
                 onClick={() => handleDelete(product.id)}
                 className="p-4 border-2 border-red-500/20 text-red-500/40 hover:text-red-500 hover:bg-red-500/5 transition-all"
               >
                 <Trash2 className="w-5 h-5" />
               </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
