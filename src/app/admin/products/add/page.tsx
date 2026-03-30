"use client";

import { motion } from "framer-motion";
import { Plus, ArrowLeft, Save, Terminal, Globe, Cloud } from "lucide-react";
import { useState } from "react";
import { createAdminProduct } from "@/app/actions/admin";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToastStore } from "@/components/ui/ForgeToast";

export default function AddProductPage() {
  const router = useRouter();
  const { addToast } = useToastStore();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
    price: 0,
    originalPrice: 0,
    category: "Notion Systems",
    image: "",
    inStock: true,
    features: ["Zero Coding Required"],
    specs: { Platform: "Web", Version: "1.0", License: "Personal" },
    downloadUrl: "",
    installGuide: "### Deployment\n1. Download asset.\n2. Execute protocol."
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    try {
      await createAdminProduct(formData);
      addToast("SUCCESS", "UPLINK_SUCCESS", "NEW PROTOCOL INJECTED INTO CORE DATABASE");
      router.push("/admin/products");
    } catch (err) {
      addToast("ERROR", "UPLINK_FAILURE", "MANIFEST REJECTED BY SERVER");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <header className="flex items-center justify-between">
        <Link href="/admin/products" className="flex items-center gap-2 text-white/40 hover:text-[#CCFF00] transition-colors text-[10px] font-black uppercase tracking-widest italic group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back_to_Inventory
        </Link>
        <div className="text-right">
           <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white">Inject_Protocol</h1>
           <p className="text-[9px] font-black uppercase tracking-widest text-white/20">Manifest Creation Sequence</p>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="space-y-8 bg-black/40 border-2 border-white/5 p-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#CCFF00]/5 blur-3xl rounded-full" />
        
        {/* Section 1: Core Identification */}
        <div className="space-y-6">
           <div className="flex items-center gap-4 text-[#CCFF00] mb-4">
              <Terminal className="w-4 h-4" />
              <h2 className="text-xs font-black uppercase tracking-[0.3em]">Core_Identification</h2>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                 <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-1">Asset_Name</label>
                 <input 
                   required
                   type="text" 
                   value={formData.name}
                   onChange={(e) => setFormData({...formData, name: e.target.value})}
                   placeholder="Cyberpunk UI Kit..."
                   className="w-full bg-white/5 border border-white/10 p-4 text-white font-mono text-sm focus:border-[#CCFF00] outline-none transition-all"
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-1">Protocol_Slug (ID)</label>
                 <input 
                   required
                   type="text" 
                   value={formData.id}
                   onChange={(e) => setFormData({...formData, id: e.target.value.toLowerCase().replace(/\s+/g, '-')})}
                   placeholder="cyberpunk-ui-kit..."
                   className="w-full bg-white/5 border border-white/10 p-4 text-[#CCFF00] font-mono text-sm focus:border-[#CCFF00] outline-none transition-all"
                 />
              </div>
           </div>

           <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-1">Manifest_Description</label>
              <textarea 
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Brief technical breakdown of the protocol..."
                className="w-full bg-white/5 border border-white/10 p-4 text-white font-mono text-sm focus:border-[#CCFF00] outline-none transition-all resize-none"
              />
           </div>
        </div>

        {/* Section 2: Financials & Classification */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-white/5">
           <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-1">Market_Value (₹)</label>
              <input 
                required
                type="number" 
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                className="w-full bg-white/5 border border-white/10 p-4 text-[#CCFF00] font-mono text-lg font-bold focus:border-[#CCFF00] outline-none transition-all"
              />
           </div>
           <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-1">MSRP_Value (₹)</label>
              <input 
                required
                type="number" 
                value={formData.originalPrice}
                onChange={(e) => setFormData({...formData, originalPrice: Number(e.target.value)})}
                className="w-full bg-white/5 border border-white/10 p-4 text-white/40 font-mono text-lg focus:border-[#CCFF00] outline-none transition-all"
              />
           </div>
           <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-1">Category_Class</label>
              <select 
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full bg-black border border-white/10 p-4 text-white font-mono text-sm focus:border-[#CCFF00] outline-none transition-all appearance-none"
              >
                 <option>Notion Systems</option>
                 <option>No-Code Automations</option>
                 <option>Design Assets</option>
                 <option>Playbooks</option>
                 <option>Software Tools</option>
              </select>
           </div>
        </div>

        {/* Section 3: Data Uplink */}
        <div className="space-y-6 pt-8 border-t border-white/5">
           <div className="flex items-center gap-4 text-[#CCFF00] mb-4">
              <Cloud className="w-4 h-4" />
              <h2 className="text-xs font-black uppercase tracking-[0.3em]">Data_Uplink_Protocols</h2>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                 <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-1">Asset_Visual_URL</label>
                 <div className="flex gap-2">
                    <input 
                      required
                      type="text" 
                      value={formData.image}
                      onChange={(e) => setFormData({...formData, image: e.target.value})}
                      placeholder="https://images.unsplash.com/..."
                      className="flex-1 bg-white/5 border border-white/10 p-4 text-white font-mono text-[10px] focus:border-[#CCFF00] outline-none transition-all"
                    />
                    <button type="button" className="p-4 bg-white/5 border border-white/10 hover:bg-[#CCFF00] hover:text-black transition-all">
                       <Globe className="w-4 h-4" />
                    </button>
                 </div>
              </div>
              <div className="space-y-2">
                 <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-1">Secure_Download_URL</label>
                 <input 
                   required
                   type="text" 
                   value={formData.downloadUrl}
                   onChange={(e) => setFormData({...formData, downloadUrl: e.target.value})}
                   placeholder="/downloads/v1/asset.zip"
                   className="w-full bg-white/5 border border-white/10 p-4 text-cyan-400 font-mono text-[10px] focus:border-[#CCFF00] outline-none transition-all"
                 />
              </div>
           </div>
        </div>

        <div className="flex justify-end pt-10">
           <Button 
             disabled={isLoading}
             type="submit"
             className="bg-[#CCFF00] text-black font-black uppercase italic tracking-[0.3em] px-12 py-8 rounded-none shadow-[8px_8px_0_#000] hover:translate-x-1 hover:-translate-y-1 transition-all active:shadow-none active:translate-x-2 active:-translate-y-2"
           >
             {isLoading ? "SYNCING..." : <><Save className="w-5 h-5 mr-3" /> Commit_Protocol</>}
           </Button>
        </div>
      </form>
    </div>
  );
}
