"use client";

import { useState, useEffect, use } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AssetPreview } from '@/components/profile/AssetPreview';
import { ProfileBadge } from '@/components/profile/ProfileBadge';
import { Loader2, Globe, Box, ShieldCheck, Mail, Share2 } from 'lucide-react';
import { ForgeButton } from '@/components/ui/ForgeButton';
import Link from 'next/link';

interface ProfilePageProps {
  params: Promise<{ userId: string }>;
}

type PublicProfileToken = {
  id: string;
  product_id: string;
  created_at: string;
  product: {
    name: string;
    category: string;
    image: string;
  };
};

type PublicProfile = {
  userId?: string;
  tokens?: PublicProfileToken[];
  stats?: { total: number; rank: string };
  error?: string;
};

export default function PublicProfile({ params }: ProfilePageProps) {
  const { userId } = use(params);
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch(`/api/profile/${userId}`);
        const data = await res.json();
        setProfile(data);
      } catch (err) {
        console.error('Failed to resolve profile uplink:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProfile();
  }, [userId]);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-black pt-32 pb-24 px-6 relative overflow-hidden">
        {/* Visual Pulse Atmosphere */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 blur-[150px] rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 blur-[120px] rounded-full -translate-x-1/3 translate-y-1/3" />

        <div className="max-w-7xl mx-auto space-y-20 relative z-10">
          
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-[60vh] flex flex-col items-center justify-center gap-4 text-center"
              >
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
                <span className="text-[10px] font-mono font-black uppercase tracking-[0.4em] text-primary italic">Decrypting_Profile_Metadata...</span>
              </motion.div>
            ) : profile && profile.tokens && profile.tokens.length > 0 ? (
              <motion.div 
                key="content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-20"
              >
                {/* Profile Header Block */}
                <div className="flex flex-col md:flex-row items-center gap-12 text-center md:text-left">
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary via-accent to-primary rounded-full blur opacity-25 group-hover:opacity-75 transition duration-1000" />
                    <div className="relative w-32 h-32 md:w-48 md:h-48 bg-black rounded-full flex items-center justify-center border border-white/10 group-hover:border-primary/50 transition-colors">
                      <ShieldCheck className="w-16 h-16 md:w-24 md:h-24 text-white/10 group-hover:text-primary transition-colors" />
                    </div>
                  </div>

                  <div className="flex-1 space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-center md:justify-start gap-3">
                         <div className="px-3 py-1 bg-primary/10 border border-primary/30 rounded-full text-[10px] font-black text-primary uppercase tracking-[0.2em] italic">Verified_Swarm_Agent</div>
                         <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] italic flex items-center gap-2">
                           <Globe className="w-3 h-3" /> NODE_0x{userId.substring(0, 4)}
                         </div>
                      </div>
                      <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter text-white leading-none">
                        Agent_{userId.substring(userId.length - 4)}
                      </h1>
                      <p className="text-gray-500 max-w-lg font-inter text-pretty">
                        Specialized in high-fidelity digital acquisitions and distributed artifact management across the global swarm network.
                      </p>
                    </div>

                    <div className="flex items-center justify-center md:justify-start gap-4">
                       <ForgeButton variant="primary" className="h-12 px-8 flex items-center gap-2">
                         Share_Identity <Share2 className="w-3 h-3" />
                       </ForgeButton>
                       <ForgeButton variant="ghost" className="h-12 px-8 flex items-center gap-2">
                         Broadcast_Message <Mail className="w-3 h-3" />
                       </ForgeButton>
                    </div>
                  </div>

                  {profile.stats && <ProfileBadge rank={profile.stats.rank} />}
                </div>

                {/* Artifact Gallery */}
                <div className="space-y-10">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <h2 className="text-sm font-black uppercase tracking-[0.3em] text-white/60 italic flex items-center gap-2">
                      <Box className="w-4 h-4 text-primary" /> Verified_Artifact_Showcase
                    </h2>
                    <span className="text-[10px] font-mono font-black text-white/20 italic uppercase tracking-widest">{profile.tokens.length} Synchronized_Items</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {profile.tokens.map((token) => (
                      <AssetPreview key={token.id} token={token} />
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="not_found"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-[60vh] flex flex-col items-center justify-center text-center gap-10"
              >
                  <ShieldCheck className="w-24 h-24 text-white/5" />
                  <div className="space-y-4">
                    <h2 className="text-5xl font-black italic uppercase tracking-tighter text-white">Identity_Null</h2>
                    <p className="text-gray-500 max-w-sm mx-auto font-inter">No verified artifacts found for the requested Swarm ID in our distributed registries.</p>
                  </div>
                  <Link href="/products">
                    <ForgeButton variant="primary" className="h-14 px-12">Return_to_Nexus</ForgeButton>
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
