"use client";

import { useSearchParams } from "next/navigation";
import { Check, Download, BookOpen, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import { Product } from "@/lib/types";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");
  const paymentId = searchParams.get("payment_id");
  const sessionId = searchParams.get("session_id");
  const status = searchParams.get("status");

  const [isVerifying, setIsVerifying] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [purchasedItems, setPurchasedItems] = useState<Product[]>([]);

  useEffect(() => {
    const lastItems = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('last_purchase') || '[]') : [];
    setPurchasedItems(lastItems);

    async function verify() {
      try {
        if (status === "free") {
          setPaymentStatus('paid');
          setIsVerifying(false);
          return;
        }

        let endpoint = "";
        let body = {};

        if (sessionId) {
          endpoint = "/api/stripe/verify";
          body = { sessionId };
        } else if (paymentId && orderId) {
          endpoint = "/api/razorpay/verify";
          body = { orderId, paymentId };
        } else if (orderId) {
          endpoint = "/api/cashfree/verify";
          body = { orderId };
        } else {
          setPaymentStatus('error');
          setIsVerifying(false);
          return;
        }

        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        const data = await res.json();
        
        if (data.isPaid || data.success) {
          setPaymentStatus('paid');
        } else {
          setPaymentStatus('failed');
        }
      } catch (error) {
        console.error('[Verification Error]', error);
        setPaymentStatus('error');
      } finally {
        setIsVerifying(false);
      }
    }
    verify();
  }, [orderId, paymentId, sessionId, status]);

  if (isVerifying) {
    return (
      <div className="flex flex-col items-center gap-8 py-20">
        <div className="w-20 h-20 border-8 border-black border-t-[#CCFF00] animate-spin shadow-[6px_6px_0_#000]" />
        <p className="font-black italic uppercase tracking-[0.3em] text-black bg-white border-2 border-black px-4 py-2 shadow-[4px_4px_0_#000]">
          Verifying_Transaction...
        </p>
      </div>
    );
  }

  if (paymentStatus !== 'paid') {
    return (
      <div className="bg-white border-4 border-black shadow-[16px_16px_0_#000] p-12 max-w-xl w-full text-center">
        <div className="w-24 h-24 bg-red-500 border-4 border-black flex items-center justify-center mx-auto mb-8 shadow-[6px_6px_0_#000] rotate-3">
          <Check className="w-12 h-12 text-white rotate-45" />
        </div>
        <h1 className="text-4xl font-black italic uppercase tracking-tighter mb-4">Verification_Failed</h1>
        <p className="font-black uppercase tracking-widest text-xs text-black/50 mb-10 leading-relaxed italic">
          The transaction could not be verified. Please contact support.
        </p>
        <Link href="/checkout">
            <button className="w-full h-16 border-4 border-black bg-black text-white font-black uppercase tracking-widest italic hover:bg-white hover:text-black transition-all shadow-[6px_6px_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none">Back_To_Checkout</button>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl space-y-12">
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white border-4 border-black shadow-[20px_20px_0_#000] p-12 relative overflow-hidden"
      >
        <div className="absolute top-0 right-12 -translate-y-1/2 bg-[#CCFF00] text-black border-4 border-black font-black uppercase px-6 py-2 italic tracking-widest shadow-[6px_6px_0_#000] -rotate-2 z-20">ORDER_READY</div>
        
        <div className="flex flex-col md:flex-row gap-12 items-center md:items-start text-center md:text-left">
          <div className="w-32 h-32 bg-[#CCFF00] border-4 border-black flex items-center justify-center shrink-0 shadow-[8px_8px_0_#000] rotate-3">
            <Check className="w-16 h-16 text-black" />
          </div>
          
          <div className="flex-1">
            <h1 className="text-6xl font-black italic uppercase tracking-tighter leading-none mb-4">Order_Confirmed</h1>
            <p className="text-sm font-black uppercase tracking-widest text-black/60 mb-6 italic leading-relaxed">
              Payment verified. Your premium digital assets have been authorized and are ready for download.
            </p>
            <div className="flex flex-wrap gap-4">
               <div className="bg-black text-[#CCFF00] border-2 border-black px-4 py-2 font-black italic text-xs tracking-tighter shadow-[4px_4px_0_#000]">TXN://{orderId || sessionId || "DIRECT_RELAY"}</div>
               <div className="bg-white border-2 border-black px-4 py-2 font-black italic text-xs tracking-tighter shadow-[4px_4px_0_#000]">STATUS: VERIFIED</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Assets Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {purchasedItems.map((product, idx) => (
          <motion.div 
            key={product.id}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 * idx }}
            className="group bg-[#ffc737] border-4 border-black p-8 shadow-[12px_12px_0_#000] hover:-translate-y-2 transition-all relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-2 h-full bg-black" />
             <div className="mb-6 flex justify-between items-start">
                <div className="h-16 w-16 relative border-2 border-black bg-black">
                   <Image src={product.image} alt={product.name} fill className="object-cover" />
                </div>
                <div className="font-black italic text-[10px] text-black border border-black px-2 py-1 rotate-[-10deg] bg-white">0x{product.id.substring(0,6)}</div>
             </div>
             
             <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-2">{product.name}</h3>
             <p className="text-[10px] font-black uppercase text-black/40 mb-8 italic tracking-widest">Type: Digital_Asset_V1</p>
             
             <div className="flex flex-col gap-6">
                 <div className="bg-black/5 p-4 border border-black italic">
                   <h4 className="font-black text-xs uppercase mb-2 flex items-center gap-2"><BookOpen className="w-3 h-3" /> Quick Start Guide</h4>
                   <div className="text-[10px] font-mono whitespace-pre-wrap leading-relaxed opacity-80">{product.installGuide}</div>
                 </div>
                 <div className="flex gap-4">
                   <a 
                     href={product.downloadUrl} 
                     target="_blank"
                     rel="noopener noreferrer"
                     className="flex-1 h-16 flex items-center justify-center gap-3 bg-black text-[#CCFF00] border-2 border-black font-black uppercase italic tracking-widest text-sm hover:bg-white hover:text-black transition-all shadow-[6px_6px_0_#000] active:translate-x-1 active:translate-y-1"
                   >
                     <Download className="w-5 h-5" /> Access digital asset
                   </a>
                 </div>
             </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-black text-white p-10 border-4 border-black shadow-[16px_16px_0_#ffc737] flex flex-col md:flex-row gap-8 items-center italic">
         <ShieldCheck className="w-20 h-20 text-[#CCFF00] shrink-0" />
         <div>
            <h4 className="text-xl font-black uppercase tracking-widest mb-2 text-[#CCFF00]">Security_Log: Transaction_Secure</h4>
            <p className="text-xs font-black uppercase tracking-widest text-white/40 leading-relaxed">
              Your download links are now active. Please ensure you save your assets in a secure location. If you encounter any issues, contact our support center.
            </p>
         </div>
         <Link href="/" className="ml-auto">
            <button className="h-16 px-8 border-2 border-[#CCFF00] text-[#CCFF00] hover:bg-[#CCFF00] hover:text-black font-black uppercase italic tracking-widest text-xs transition-all">Back_To_Home</button>
         </Link>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-[#ffc737] text-black flex flex-col items-center justify-center p-8 relative overflow-hidden font-inter">
      <div className="absolute inset-0 bg-swarm-pattern opacity-[0.05] pointer-events-none" />
      
      {/* Background glitch elements */}
      <div className="absolute top-10 left-10 w-40 h-1 bg-black/10 rotate-45" />
      <div className="absolute bottom-20 right-20 w-60 h-2 bg-black/10 -rotate-12" />
      
      <Suspense fallback={<div className="font-black italic uppercase animate-pulse">Initializing_Order...</div>}>
         <SuccessContent />
      </Suspense>

      <footer className="mt-20 font-black italic uppercase text-[10px] tracking-[0.5em] text-black/30 border-t-2 border-black/10 pt-8 w-full text-center">
        Digital_Swarm_Systems // All_Assets_Secured
      </footer>
    </div>
  );
}
