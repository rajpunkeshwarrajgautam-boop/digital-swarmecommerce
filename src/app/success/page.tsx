"use client";

import { useSearchParams } from "next/navigation";
import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { motion } from "framer-motion";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  return (
    <motion.div 
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="relative z-10 max-w-md w-full p-8 rounded-2xl bg-zinc-900/50 border border-green-500/20 backdrop-blur-xl text-center"
    >
      <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/20 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
        <Check className="w-10 h-10 text-green-500" />
      </div>
      
      <h1 className="text-3xl font-bold mb-2">Order Confirmed</h1>
      <p className="text-muted-foreground mb-8">
        Thank you for your purchase. Your digital assets have been dispatched to your neural link (email).
      </p>

      {sessionId && (
          <div className="bg-black/40 p-3 rounded-lg mb-8 font-mono text-xs text-muted-foreground break-all border border-white/5">
              SESSION: {sessionId}
          </div>
      )}

      <div className="space-y-4">
           <Link href="/products">
              <Button className="w-full" size="lg">
                  Continue Shopping <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
          </Link>
           <Link href="/">
              <Button variant="ghost" className="w-full">
                  Return to Home
              </Button>
          </Link>
      </div>
    </motion.div>
  );
}

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-green-500/10 via-black to-black" />
      
      <Suspense fallback={<div className="text-white">Verifying transaction...</div>}>
         <SuccessContent />
      </Suspense>
    </div>
  );
}
