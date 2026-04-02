"use client";

import { useEffect, useState, use } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Globe, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getAdminProduct, updateAdminProduct } from "@/app/actions/admin";
import { Button } from "@/components/ui/Button";
import { useToastStore } from "@/components/ui/ForgeToast";
import { AdminProduct } from "@/lib/types";

/**
 * Edit Product Interface (Full Completion Milestone)
 * Part of the Admin Intelligence Hub.
 */
export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { addToast } = useToastStore();
  
  const [product, setProduct] = useState<AdminProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
            try {
        const data = await getAdminProduct(id);
        setProduct(data as AdminProduct);
      } catch {
        addToast("ERROR", "UPLINK_FAILURE", "FAILED TO RETRIEVE ASSET DATA");
      } finally {
        setIsLoading(false);
      }
    }
    fetchProduct();
  }, [id, addToast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    setIsSaving(true);
    try {
      await updateAdminProduct(id, product);
      addToast("SUCCESS", "PROTOCOL_UPDATED", "CORE ASSET DATA REWRITTEN");
      router.push("/admin/products");
    } catch {
      addToast("ERROR", "UPLINK_CRITICAL_FAULT", "FAILED TO SYNC PROTOCOL");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="p-20 text-white/20 italic animate-pulse">Scanning core_storage...</div>;
  if (!product) return <div className="p-20 text-red-500 italic">404: PROTOCOL_NOT_FOUND</div>;

  return (
    <div className="max-w-4xl space-y-12 pb-20">
      <header className="flex items-center gap-6">
        <Link href="/admin/products" className="p-3 border border-white/5 hover:bg-white/5 transition-all">
          <ChevronLeft className="w-5 h-5 text-white/40" />
        </Link>
        <div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white">Edit_Protocol</h1>
          <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mt-1">ID_{id}</p>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-[#CCFF00]">Asset_Name</label>
            <input 
              value={product.name} 
              onChange={(e) => setProduct({ ...product, name: e.target.value })}
              className="w-full bg-white/2 border-b-2 border-white/10 p-4 focus:border-[#CCFF00] outline-none text-white italic font-black uppercase" 
            />
          </div>
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Market_Value (INR)</label>
            <input 
              type="number"
              value={product.price} 
              onChange={(e) => setProduct({ ...product, price: parseFloat(e.target.value) })}
              className="w-full bg-white/2 border-b-2 border-white/10 p-4 focus:border-[#CCFF00] outline-none text-white font-mono font-black" 
            />
          </div>
          <div className="md:col-span-2 space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Manifest_Description</label>
            <textarea 
              value={product.description || ""} 
              onChange={(e) => setProduct({ ...product, description: e.target.value })}
              className="w-full bg-white/2 border-b-2 border-white/10 p-4 focus:border-[#CCFF00] outline-none text-white min-h-[120px] italic"
            />
          </div>
          <div className="space-y-4">
             <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Status_Controls</label>
             <div className="flex gap-4">
                <button 
                  type="button"
                  onClick={() => setProduct({ ...product, is_visible: !product.is_visible })}
                  className={`flex-1 p-4 border-2 flex items-center justify-center gap-3 transition-all ${product.is_visible ? "border-[#CCFF00]/40 text-[#CCFF00]" : "border-white/5 text-white/20"}`}
                >
                  <Globe className="w-4 h-4" /> {product.is_visible ? "ONLINE" : "OFFLINE"}
                </button>
                <button 
                   type="button"
                   onClick={() => setProduct({ ...product, is_verified: !product.is_verified })}
                   className={`flex-1 p-4 border-2 flex items-center justify-center gap-3 transition-all ${product.is_verified ? "border-cyan-500/40 text-cyan-400" : "border-white/5 text-white/20"}`}
                >
                  <ShieldCheck className="w-4 h-4" /> {product.is_verified ? "VERIFIED" : "UNSTATED"}
                </button>
             </div>
          </div>
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Asset_Category</label>
            <select 
              value={product.category || "saas"} 
              onChange={(e) => setProduct({ ...product, category: e.target.value })}
              className="w-full bg-white/5 border-b-2 border-white/10 p-4 focus:border-[#CCFF00] outline-none text-white font-black uppercase italic appearance-none cursor-pointer"
            >
              <option value="saas">SaaS / Framework</option>
              <option value="legal">Legal / Compliance</option>
              <option value="finance">Finance / Crypto</option>
              <option value="marketing">Marketing / SEO</option>
            </select>
          </div>
        </div>

        <div className="pt-10 border-t border-white/5">
           <Button type="submit" disabled={isSaving} className="w-full py-8 text-xl bg-[#CCFF00] text-black font-black uppercase italic shadow-[10px_10px_0_#000] hover:translate-x-1 hover:-translate-y-1 transition-all active:shadow-none">
              {isSaving ? "SYNCHRONIZING..." : "STORE CHANGES & REWRITE_LEADGER"}
           </Button>
        </div>
      </form>
    </div>
  );
}
