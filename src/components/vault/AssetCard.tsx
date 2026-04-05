"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Cpu, ArrowUpRight, Clock, Gift, Loader2, Globe, Copy, Check } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { ForgeButton } from '../ui/ForgeButton';

interface AssetCardProps {
  token: {
    id: string;
    product_id: string;
    mint_node: string;
    created_at: string;
    product: {
      name: string;
      category: string;
      image: string;
    }
  }
}

export function AssetCard({ token }: AssetCardProps) {
  const [isTransferring, setIsTransferring] = useState(false);
  const [isBridging, setIsBridging] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [transferPrice, setTransferPrice] = useState('0');
  const [status, setStatus] = useState<'idle' | 'busy' | 'success' | 'error'>('idle');
  const [bridgeManifest, setBridgeManifest] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleTransfer = async () => {
    if (!recipientEmail) return;
    setStatus('busy');
    try {
      const res = await fetch('/api/vault/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          tokenId: token.id, 
          toEmail: recipientEmail,
          price: parseFloat(transferPrice) || 0
        })
      });
      const data = await res.json();
      if (data.success) {
        setStatus('success');
        setTimeout(() => window.location.reload(), 2000); 
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  const handleBridge = async () => {
    setStatus('busy');
    try {
      const res = await fetch('/api/bridge/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tokenId: token.id })
      });
      const data = await res.json();
      if (data.signature) {
        setBridgeManifest(JSON.stringify(data, null, 2));
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  const copyManifest = () => {
    if (bridgeManifest) {
      navigator.clipboard.writeText(bridgeManifest);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const royalties = {
    total: (parseFloat(transferPrice) || 0) * 0.10,
    creator: (parseFloat(transferPrice) || 0) * 0.05,
    platform: (parseFloat(transferPrice) || 0) * 0.03,
    dao: (parseFloat(transferPrice) || 0) * 0.02
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      className="group relative"
    >
      <div className="absolute -inset-0.5 bg-linear-to-r from-primary/20 via-accent/20 to-primary/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
      
      <div className="relative glass-panel rounded-2xl overflow-hidden border border-white/10 group-hover:border-primary/30 transition-colors">
        <div className="relative h-48 overflow-hidden bg-white/5">
          <Image 
            src={token.product.image} 
            alt={token.product.name} 
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
          
          <div className="absolute top-4 left-4">
            <div className="px-3 py-1 bg-black/60 backdrop-blur-md border border-white/20 rounded-full flex items-center gap-2">
              <ShieldCheck className="w-3 h-3 text-primary shadow-[0_0_8px_#CCFF00]" />
              <span className="text-[10px] font-mono font-black text-white/90 uppercase tracking-widest">{token.id}</span>
            </div>
          </div>

          <div className="absolute top-4 right-4 flex gap-2">
            <button 
              onClick={() => setIsBridging(true)}
              className="w-8 h-8 glass-panel border border-white/20 rounded-full flex items-center justify-center text-white/60 hover:text-accent hover:border-accent transition-all shadow-lg"
              title="Swarm Bridge"
            >
              <Globe className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setIsTransferring(true)}
              className="w-8 h-8 glass-panel border border-white/20 rounded-full flex items-center justify-center text-white/60 hover:text-primary hover:border-primary transition-all shadow-lg"
              title="Gift Asset"
            >
              <Gift className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="space-y-1">
            <h3 className="text-xl font-outfit font-black italic uppercase tracking-tighter text-white transition-colors group-hover:text-primary">
              {token.product.name}
            </h3>
            <p className="text-[10px] font-mono font-black uppercase tracking-widest text-white/30">{token.product.category}</p>
          </div>

          <AnimatePresence>
            {isTransferring && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-50 glass-panel backdrop-blur-xl p-6 flex flex-col justify-center gap-4 overflow-y-auto"
              >
                {status === 'success' ? (
                  <div className="text-center space-y-2">
                    <ShieldCheck className="w-12 h-12 text-primary mx-auto animate-bounce" />
                    <h4 className="text-sm font-black uppercase italic text-white">Transfer_Initiated</h4>
                    <p className="text-[10px] text-white/40">Broadcasting ownership update to swarm...</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-1">
                      <h4 className="text-sm font-black uppercase italic text-white">Gift_Asset</h4>
                      <p className="text-[10px] text-white/40">Enter recipient&apos;s Swarm ID (Email)</p>
                    </div>
                    <input 
                      autoFocus
                      type="email"
                      placeholder="recipient@swarm.in"
                      value={recipientEmail}
                      onChange={(e) => setRecipientEmail(e.target.value)}
                      className="w-full h-10 bg-white/5 border border-white/10 rounded-lg px-4 text-xs text-white placeholder:text-white/10 focus:border-primary outline-none transition-colors"
                    />

                    <div className="space-y-1 pt-2">
                      <p className="text-[10px] text-white/40 uppercase tracking-widest font-black italic">Transfer_Value (USD)</p>
                      <input 
                        type="number"
                        placeholder="0.00"
                        value={transferPrice}
                        onChange={(e) => setTransferPrice(e.target.value)}
                        className="w-full h-10 bg-white/5 border border-white/10 rounded-lg px-4 text-xs text-white placeholder:text-white/10 focus:border-primary outline-none transition-colors"
                      />
                    </div>

                    {royalties.total > 0 && (
                      <div className="bg-white/5 rounded-lg p-3 space-y-2 border border-white/5">
                        <p className="text-[8px] font-black uppercase tracking-[0.2em] text-white/20">Perpetual_Royalties (10%)</p>
                        <div className="flex justify-between text-[9px] font-mono text-white/40">
                          <span>Creator (5%)</span>
                          <span className="text-primary font-black">${royalties.creator.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-[9px] font-mono text-white/40">
                          <span>Platform (3%)</span>
                          <span className="text-white/80">${royalties.platform.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-[9px] font-mono text-white/20 italic border-t border-white/5 pt-1">
                          <span>DAO_Stability (2%)</span>
                          <span>${royalties.dao.toFixed(2)}</span>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      <ForgeButton 
                        disabled={status === 'busy'}
                        onClick={handleTransfer}
                        variant="primary" 
                        className="flex-1 h-10 text-[9px]"
                      >
                        {status === 'busy' ? <Loader2 className="w-3 h-3 animate-spin mx-auto" /> : 'Confirm_Transfer'}
                      </ForgeButton>
                      <button 
                        onClick={() => { setIsTransferring(false); setStatus('idle'); }}
                        className="px-4 h-10 border border-white/10 rounded-xl text-[9px] text-white/40 hover:text-white transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                )}
              </motion.div>
            )}

            {isBridging && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-50 glass-panel backdrop-blur-xl p-6 flex flex-col justify-center gap-4 overflow-y-auto"
              >
                <div className="space-y-1">
                  <h4 className="text-sm font-black uppercase italic text-accent">Artifact_Bridge</h4>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest">Generate signed cross-node manifest</p>
                </div>

                {status === 'busy' ? (
                   <div className="py-10 text-center">
                     <Loader2 className="w-8 h-8 text-accent animate-spin mx-auto" />
                     <p className="text-[8px] font-mono text-white/20 mt-4 uppercase tracking-widest">Signaling_Distributed_Ledger...</p>
                   </div>
                ) : bridgeManifest ? (
                   <div className="space-y-4">
                      <div className="bg-black/40 rounded-lg p-3 border border-white/5 max-h-40 overflow-y-auto">
                        <pre className="text-[7px] font-mono text-accent whitespace-pre-wrap">{bridgeManifest}</pre>
                      </div>
                      <ForgeButton 
                        onClick={copyManifest}
                        variant="primary"
                        className="w-full h-10 text-[9px]"
                      >
                        {copied ? <Check className="w-3 h-3 mr-2" /> : <Copy className="w-3 h-3 mr-2" />}
                        {copied ? 'Manifest_Copied' : 'Copy_Signed_Manifest'}
                      </ForgeButton>
                      <button 
                        onClick={() => { setIsBridging(false); setBridgeManifest(null); setStatus('idle'); }}
                        className="w-full h-10 border border-white/10 rounded-xl text-[9px] text-white/40 hover:text-white transition-colors"
                      >
                        Close_Tunnel
                      </button>
                   </div>
                ) : (
                  <div className="space-y-4 pt-2">
                    <p className="text-[9px] text-white/30 font-mono italic leading-relaxed">
                      Bridging creates a cryptographically signed JSON manifest of your asset, allowing it to be imported into any trusted Swarm node while maintaining reputation.
                    </p>
                    <ForgeButton 
                      onClick={handleBridge}
                      variant="primary" 
                      className="w-full h-12 text-[10px]"
                    >
                      Initialize_Bridge_Upload
                    </ForgeButton>
                    <button 
                      onClick={() => { setIsBridging(false); setStatus('idle'); }}
                      className="w-full h-10 border border-white/10 rounded-xl text-[9px] text-white/40 hover:text-white transition-colors"
                    >
                      Abort
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-2 gap-4 pb-4 border-b border-white/5">
            <div className="space-y-1">
              <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/20">Minting_Node</span>
              <div className="flex items-center gap-1.5 text-xs text-white/60">
                <Cpu className="w-3 h-3" />
                <span className="font-mono">{token.mint_node}</span>
              </div>
            </div>
            <div className="space-y-1 text-right">
              <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/20">Acquisition_Date</span>
              <div className="flex items-center justify-end gap-1.5 text-xs text-white/60">
                <Clock className="w-3 h-3" />
                <span className="font-mono">{new Date(token.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <Link href={`/product/${token.product_id}`} className="block">
            <button className="w-full h-12 glass-panel border border-white/10 rounded-xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-black hover:bg-primary hover:border-primary transition-all group/btn">
              Access_Asset <ArrowUpRight className="w-3 h-3 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
            </button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

