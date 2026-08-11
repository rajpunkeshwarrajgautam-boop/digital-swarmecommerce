"use client";

import { motion } from "framer-motion";
import { Package, Download, AlertCircle } from "lucide-react";
import Image from "next/image";
import { getUserAssets } from "@/app/actions/user-assets";
import { useEffect, useState } from "react";
import { useToastStore } from "@/components/ui/ForgeToast";

type Asset = {
  id: string;
  license_key: string;
  license_tier?: string;
  products?: {
    name: string;
    image: string;
    version: string;
    download_url?: string;
  };
};

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const { addToast } = useToastStore();

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await getUserAssets();
        if (res.success && res.assets) {
          setAssets(res.assets as Asset[]);
        } else {
          setLoadError(res.error || "Unable to load your assets.");
        }
      } catch (e) {
        console.error("Assets fetch error", e);
        setLoadError("Unable to load your assets.");
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
          <span className="text-[10px] font-black uppercase tracking-widest text-primary italic">Licensed downloads</span>
        </motion.div>
        <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter leading-none">
          Your <br />
          <span className="text-white/20 italic">Assets</span>
        </h1>
        <p className="max-w-2xl text-sm text-white/40">
          Download links are generated privately for your signed-in account and expire automatically. Refresh this page to issue a fresh link.
        </p>
      </header>

      {loadError && (
        <div className="flex items-start gap-3 border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-200">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{loadError}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {isLoading ? (
          <div className="text-white/30 font-bold uppercase">Loading your assets…</div>
        ) : !loadError && assets.length === 0 ? (
          <div className="text-white/30 font-bold uppercase">No purchased assets found for this account.</div>
        ) : assets.map((asset, i) => {
          const product = asset.products;
          const canDownload = Boolean(product?.download_url);
          return (
            <motion.div
              key={asset.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.06 }}
              className="group relative"
            >
              <div className="aspect-square bg-white/5 border border-white/10 mb-6 overflow-hidden relative rounded-xl">
                <Image
                  src={product?.image || "/icon.svg"}
                  alt={product?.name || "Digital Swarm asset"}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-white/30">
                  <span>{product?.version ? `VER_${product.version}` : "Licensed asset"}</span>
                  <span className="truncate ml-2">ID_{asset.id.split('-')[0]}</span>
                </div>
                <h3 className="text-xl font-black italic uppercase tracking-tighter leading-none truncate">
                  {product?.name || "Legacy Digital Swarm Asset"}
                </h3>

                <div className="flex gap-2 pt-4">
                  {canDownload ? (
                    <a href={product!.download_url} className="flex-1" download>
                      <button className="w-full h-10 border border-white/10 bg-white/5 text-[9px] font-black uppercase tracking-widest text-white hover:bg-white hover:text-black transition-all flex items-center justify-center">
                        <Download className="w-3.5 h-3.5 mr-2" /> Download bundle
                      </button>
                    </a>
                  ) : (
                    <a href="mailto:support@digitalswarm.in?subject=Restore%20Digital%20Swarm%20download" className="flex-1">
                      <button className="w-full h-10 border border-amber-500/20 bg-amber-500/5 text-[9px] font-black uppercase tracking-widest text-amber-200 hover:bg-amber-500/10 transition-all">
                        Request restored link
                      </button>
                    </a>
                  )}
                  <button
                    onClick={() => {
                      if (asset.license_key) {
                        navigator.clipboard.writeText(asset.license_key);
                        addToast("SUCCESS", "LICENSE COPIED", "License key copied to clipboard");
                      }
                    }}
                    className="px-4 h-10 border border-primary/20 bg-white/2 hover:bg-primary/10 text-[9px] font-black uppercase tracking-widest text-primary hover:border-primary transition-all"
                  >
                    Copy key
                  </button>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  );
}
