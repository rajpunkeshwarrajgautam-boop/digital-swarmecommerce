"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AssetCard } from '@/components/vault/AssetCard';
import { VaultStats } from '@/components/vault/VaultStats';
import { Loader2, ShieldCheck, Box, ArrowRight } from 'lucide-react';
import { ForgeButton } from '@/components/ui/ForgeButton';
import Link from 'next/link';

type VaultToken = {
  id: string;
  product_id: string;
  mint_node?: string;
  created_at: string;
  metadata?: Record<string, unknown>;
  product: {
    name: string;
    category: string;
    image: string;
  };
};

type VaultStatsPayload = {
  total: number;
  nodes: number;
  rank: string;
};

export default function DigitalVault() {
  const [tokens, setTokens] = useState<VaultToken[]>([]);
  const [stats, setStats] = useState<VaultStatsPayload | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchVault() {
      try {
        const res = await fetch('/api/vault');
        const data = await res.json();
        setTokens(data.tokens || []);
        setStats(data.stats);
      } catch (err) {
        console.error('Failed to sync vault:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchVault();
  }, []);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-black pt-32 pb-24 px-6 relative overflow-hidden">
        {/* Background Atmosphere */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-accent/5 blur-[150px] rounded-full translate-x-1/3 translate-y-1/3" />

        <div className="max-w-7xl mx-auto space-y-16 relative z-10">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="px-3 py-1 bg-primary/10 border border-primary/30 rounded-full text-[10px] font-black text-primary uppercase tracking-widest italic">
                  Digital_Vault_V2.4
                </div>
                <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-mono text-white/40 uppercase tracking-widest italic">
                  Uplink: STABLE
                </div>
              </div>
              <h1 className="text-7xl font-black italic uppercase tracking-tighter text-white leading-none">Your_Assets</h1>
              <p className="text-gray-500 max-w-lg font-inter">
                Cryptographically secured ownership of the world&apos;s most advanced digital artifacts. Access and verify your collection across the swarm network.
              </p>
            </div>
            
            <Link href="/products">
              <ForgeButton variant="ghost" className="h-14 px-8 group">
                Acquire_New_Artifacts <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </ForgeButton>
            </Link>
          </div>

          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-[60vh] flex flex-col items-center justify-center gap-4 text-center"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-primary blur-2xl opacity-20 animate-pulse" />
                  <Loader2 className="w-12 h-12 text-primary animate-spin relative z-10" />
                </div>
                <span className="text-[10px] font-mono font-black uppercase tracking-[0.4em] text-primary italic">Syncing_Distributed_Ownership_Ledger...</span>
              </motion.div>
            ) : tokens.length > 0 ? (
              <motion.div 
                key="content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-16"
              >
                {stats && <VaultStats stats={stats} />}

                <div className="space-y-8">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <h2 className="text-sm font-black uppercase tracking-[0.3em] text-white/60 italic flex items-center gap-2">
                        <Box className="w-4 h-4 text-primary" /> Tokenized_Artifact_Repository
                    </h2>
                    <span className="text-[10px] font-mono font-black text-white/20 italic uppercase tracking-widest">{tokens.length} Assets_Found</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {tokens.map((token) => (
                      <AssetCard key={token.id} token={token} />
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-[60vh] flex flex-col items-center justify-center text-center gap-8"
              >
                <div className="relative">
                    <div className="absolute inset-0 bg-white/5 blur-3xl opacity-50 h-32 w-32 rounded-full mx-auto" />
                    <ShieldCheck className="w-24 h-24 text-white/10 relative z-10 mx-auto" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white">Vault_Inventory_Null</h2>
                    <p className="text-gray-500 max-w-sm mx-auto font-inter">Your ownership ledger is currently unpopulated. Acquire high-fidelity assets to populate your Swarm Repository.</p>
                </div>
                <Link href="/products">
                    <ForgeButton variant="primary" className="h-14 px-10">Start_Acquisition_Protocol</ForgeButton>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </>
  );
}
