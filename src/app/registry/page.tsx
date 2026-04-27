"use client";

import { useEffect, useState } from "react";
import { Header } from "@/layout/Header";
import { Footer } from "@/layout/Footer";
import { GlassCard } from "@/components/ui/GlassCard";
import { Search, ShieldCheck, Activity, Users, Filter, ArrowUpRight, Cpu } from "lucide-react";
import { getRegistryNodes, SwarmNode } from "@/app/actions/registry";
import { motion } from "framer-motion";
import Link from "next/link";

export default function SwarmRegistryPage() {
  const [nodes, setNodes] = useState<SwarmNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const data = await getRegistryNodes();
        setNodes(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filteredNodes = nodes.filter(n => 
    n.node_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Header />
      <main className="min-h-screen bg-black pt-32 pb-24 px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4">
              <h1 className="text-7xl font-black italic uppercase tracking-tighter text-white leading-none">Swarm Registry</h1>
              <p className="text-gray-500 max-w-xl text-sm font-inter">
                The authoritative directory of verified nodes operating across the Digital Swarm. 
                Audit cryptographic identities and verify protocol trust scores in real-time.
              </p>
            </div>
            
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input 
                type="text" 
                placeholder="SEARCH_PROTOCOL_NODES..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white/5 border-4 border-white/10 p-4 pl-12 text-[10px] font-black uppercase tracking-widest text-white focus:border-[#CCFF00] outline-none transition-all placeholder:text-gray-700"
              />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-1 border-4 border-white/10 bg-white/10">
            <div className="bg-black p-6 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest italic">Total_Nodes</span>
                <div className="text-3xl font-black italic text-white tracking-tighter">{nodes.length}</div>
              </div>
              <Users className="w-8 h-8 text-white/10" />
            </div>
            <div className="bg-black p-6 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest italic">Verified_Uplinks</span>
                <div className="text-3xl font-black italic text-[#CCFF00] tracking-tighter">{nodes.filter(n => n.is_verified).length}</div>
              </div>
              <ShieldCheck className="w-8 h-8 text-[#CCFF00]/20" />
            </div>
            <div className="bg-black p-6 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest italic">Network_Velocity</span>
                <div className="text-3xl font-black italic text-cyan-400 tracking-tighter">98.4%</div>
              </div>
              <Activity className="w-8 h-8 text-cyan-400/20" />
            </div>
          </div>

          {/* Registry Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              Array(6).fill(0).map((_, i) => (
                <div key={i} className="h-64 bg-white/5 border-4 border-white/10 animate-pulse" />
              ))
            ) : filteredNodes.length === 0 ? (
              <div className="col-span-full py-24 text-center text-gray-700 font-black italic uppercase text-2xl tracking-widest">
                NO_NODES_FOUND_IN_SEARCH_QUERY
              </div>
            ) : (
              filteredNodes.map((node) => (
                <NodeCard key={node.id} node={node} />
              ))
            )}
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}

function NodeCard({ node }: { node: SwarmNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5 }}
    >
      <GlassCard className="relative overflow-hidden group border-4 border-white/10 p-0 rounded-none bg-black/40 hover:border-[#CCFF00]/50 transition-all">
        
        {/* Verification Badge */}
        {node.is_verified && (
          <div className="absolute top-0 right-0 bg-[#CCFF00] text-black px-4 py-1 text-[10px] font-black uppercase tracking-widest italic z-10 shadow-[0_0_15px_rgba(204,255,0,0.5)]">
            VERIFIED
          </div>
        )}

        <div className="p-8 space-y-6">
          <div className="flex items-start justify-between">
            <div className="w-16 h-16 bg-white/5 border border-white/10 flex items-center justify-center relative">
              <Cpu className={`w-8 h-8 ${node.is_verified ? 'text-[#CCFF00]' : 'text-gray-600'}`} />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-black border border-white/20" />
            </div>
            <div className="text-right">
              <div className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Trust_Score:</div>
              <div className="text-4xl font-black italic tracking-tighter text-white">{node.trust_score}</div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-black italic uppercase tracking-tight text-white group-hover:text-[#CCFF00] transition-colors">
              {node.node_name}
            </h3>
            <div className="flex gap-2">
              <span className="text-[9px] font-black uppercase bg-white/5 px-2 py-1 text-gray-400 border border-white/10">
                TYPE: {node.node_type}
              </span>
              <span className="text-[9px] font-black uppercase bg-white/5 px-2 py-1 text-gray-400 border border-white/10">
                UPLINK: {new Date(node.created_at).getFullYear()}
              </span>
            </div>
          </div>

          <p className="text-[11px] text-gray-500 font-inter line-clamp-3 leading-relaxed">
            {node.bio || "No profile transmission received. Node operating in stealth mode within the registry."}
          </p>

          <div className="pt-6 border-t border-white/10 flex items-center justify-between">
            <Link href={`/registry/${node.user_id}`} className="flex items-center gap-2 group/link">
              <span className="text-[10px] font-black uppercase tracking-widest text-white/40 group-hover/link:text-[#CCFF00] transition-colors">
                VIEW_NODE_LEDGER
              </span>
              <ArrowUpRight className="w-3 h-3 text-white/20 group-hover/link:text-[#CCFF00] group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-all" />
            </Link>
            <div className="flex gap-1">
              <div className="w-1 h-1 bg-[#CCFF00]/50" />
              <div className="w-1 h-1 bg-[#CCFF00]/50" />
              <div className="w-1 h-1 bg-[#CCFF00]/50" />
            </div>
          </div>
        </div>

        {/* Scanline Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
      </GlassCard>
    </motion.div>
  );
}
