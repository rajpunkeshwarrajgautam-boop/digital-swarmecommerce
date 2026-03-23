"use client";

import { useSearchParams } from "next/navigation";
import { Check, ArrowRight, Download, BookOpen, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { motion } from "framer-motion";
import { Suspense, useEffect, useState } from "react";
import { products as allProducts } from "@/lib/data";
import { Product } from "@/lib/types";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id") || (typeof window !== 'undefined' ? localStorage.getItem('pending_order_id') : null);
  const [isVerifying, setIsVerifying] = useState(!!orderId);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [purchasedItems] = useState<Product[]>(() => {
    if (typeof window !== 'undefined') {
      const lastItems = JSON.parse(localStorage.getItem('last_purchase') || '[]');
      return lastItems.length > 0 ? lastItems : allProducts.slice(0, 2);
    }
    return [];
  });

  useEffect(() => {
    async function verifyPayment() {
      if (orderId) {
        // Bypass Cashfree Ping for $0 Freemium Trojan Products
        if (orderId.startsWith("FREE-") || searchParams.get("status") === "free") {
            setPaymentStatus('paid');
            setIsVerifying(false);
            return;
        }

        try {
          const res = await fetch('/api/cashfree/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId }),
          });
          const data = await res.json();
          if (data.isPaid) {
            setPaymentStatus('paid');
          } else {
            setPaymentStatus(data.status?.toLowerCase() || 'failed');
          }
        } catch (err) {
          console.error('Verification error:', err);
          setPaymentStatus('error');
        } finally {
          setIsVerifying(false);
        }
      }
    }
    verifyPayment();
  }, [orderId, searchParams]);

  // Track Purchase Event on success
  useEffect(() => {
    if (paymentStatus === 'paid' && orderId) {
      if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'Purchase', {
          value: purchasedItems.reduce((acc, item) => acc + item.price, 0),
          currency: 'INR',
          content_ids: purchasedItems.map(item => item.id),
          content_type: 'product',
          order_id: orderId
        });
      }
    }
  }, [paymentStatus, orderId, purchasedItems]);

  if (isVerifying) {
    return (
      <div className="flex flex-col items-center gap-6">
        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="font-mono text-sm tracking-widest text-primary animate-pulse uppercase">
          Verifying_Neural_Transaction...
        </p>
      </div>
    );
  }

  if (paymentStatus && paymentStatus !== 'paid') {
    return (
      <div className="flex flex-col items-center max-w-md w-full gap-8 p-8 rounded-2xl bg-zinc-900/50 border border-red-500/20 text-center">
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.3)]">
          <Check className="w-10 h-10 text-red-500 rotate-45" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Payment {paymentStatus.toUpperCase()}</h1>
        <p className="text-muted-foreground mb-8">
          The transaction could not be verified. Please contact support or try again.
        </p>
        <Link href="/checkout" className="w-full">
            <Button className="w-full" variant="outline">Back to Checkout</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center max-w-4xl w-full gap-8">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative z-10 w-full max-w-md p-8 rounded-2xl bg-zinc-900/50 border border-green-500/20 backdrop-blur-xl text-center"
      >
        <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/20 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
          <Check className="w-10 h-10 text-green-500" />
        </div>
        
        <h1 className="text-3xl font-bold mb-2">Order Confirmed</h1>
        <p className="text-muted-foreground mb-4">
          Verification successful. Your neural assets are now unlocked and ready for deployment.
        </p>

        {orderId && (
            <div className="bg-black/40 p-3 rounded-lg mb-6 font-mono text-[10px] text-muted-foreground break-all border border-white/5 flex items-center justify-center gap-2">
                <ShieldCheck className="w-3 h-3 text-green-500" />
                TXN_ID: {orderId.substring(0, 24)}...
            </div>
        )}

        <div className="space-y-4">
             <Link href="/products">
                <Button className="w-full" size="lg">
                    Back to Marketplace <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
            </Link>
        </div>
      </motion.div>

      {/* Download Section */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10"
      >
        <div className="md:col-span-2">
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-primary mb-4 flex items-center gap-2">
                <Download className="w-4 h-4" /> Available Downloads
            </h2>
        </div>
        
        {purchasedItems.map((product) => (
            <div key={product.id} className="bg-zinc-900/80 border border-white/10 rounded-xl p-5 hover:border-primary/50 transition-all group overflow-hidden relative">
                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Download className="w-16 h-16 -mr-4 -mt-4 text-white" />
                </div>
                
                <h3 className="font-bold text-lg mb-1">{product.name}</h3>
                <p className="text-xs text-muted-foreground mb-4 line-clamp-2">ID: {product.id} • Verified Digital Asset</p>
                
                <div className="flex flex-wrap gap-3">
                    <a 
                        href={product.downloadUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-blue-400 text-white text-xs font-bold py-3 px-4 rounded-lg transition-all shadow-lg shadow-blue-500/20"
                    >
                        <Download className="w-4 h-4" /> DOWNLOAD ZIP
                    </a>
                    <a 
                        href={product.installGuide} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold py-3 px-4 rounded-lg transition-all"
                    >
                        <BookOpen className="w-4 h-4" /> DOCS
                    </a>
                </div>
            </div>
        ))}

        <div className="md:col-span-2 p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl flex items-start gap-4 mt-4">
            <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
                <strong className="text-white block mb-1 uppercase tracking-wider">Storage Protocol:</strong>
                Links are valid for 24 hours. After expiration, please authenticate through your user dashboard to regenerate the keys. For enterprise support, contact our AI architect team.
            </p>
        </div>
      </motion.div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 relative overflow-hidden scanline">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-blue-500/10 via-black to-black" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
      
      <Suspense fallback={<div className="text-white font-mono animate-pulse">VERIFYING_DECRYPTION_KEYS...</div>}>
         <SuccessContent />
      </Suspense>

      <footer className="mt-12 relative z-10 text-[10px] text-muted-foreground uppercase tracking-widest opacity-50">
        Digital Swarm Marketplace • Secure Neural Transaction
      </footer>
    </div>
  );
}
