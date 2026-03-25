"use client";

import Link from "next/link";
import { CheckCircle2, Download, Home, ArrowRight, Github } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useCartStore } from "@/lib/store";

export default function SuccessPage() {
  const { clearCart } = useCartStore();
  const [confirmationId] = useState(() => `DS-ACQU-00${Math.floor(Date.now() / 1000)}`);

  useEffect(() => {
    // 1. Clear cart
    clearCart();
    
    // 2. Log Tracking Event for Analytics (Marketing Infiltration)
    console.log("MARKETING_PROTOCOL_SUCCESS: Order acquired. Signaling partners...");
  }, [clearCart]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 pt-32 pb-20 overflow-hidden relative">
      {/* Decorative Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-full max-h-[600px] opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-primary/20 blur-[120px] rounded-full" />
      </div>

      <div className="container max-w-2xl relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white border border-secondary/5 rounded-[3rem] p-12 text-center shadow-2xl shadow-secondary/5"
        >
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.2 }}
            className="w-24 h-24 bg-primary rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-primary/40 rotate-12"
          >
            <CheckCircle2 className="w-12 h-12 text-white -rotate-12" />
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter mb-4 text-secondary">
            Deployment Successful
          </h1>
          <p className="text-secondary/50 font-medium mb-10 max-w-sm mx-auto uppercase tracking-widest text-[10px]">
            Your digital assets have been provisioned. Access the source code below.
          </p>

          <div className="bg-secondary/5 border border-secondary/5 rounded-3xl p-8 mb-10 group hover:border-primary/20 transition-all">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white">
                  <Github className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-black uppercase tracking-widest text-secondary/40">Resource Linked</p>
                  <p className="text-sm font-black italic uppercase text-secondary">Github Private Invite</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase rounded-full">Active</span>
            </div>

            <Button className="w-full py-6 bg-secondary text-white hover:bg-black gap-2 group-hover:bg-primary transition-all">
              <Download className="w-5 h-5" /> Download Source (.zip)
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/" className="flex-1">
              <Button variant="outline" className="w-full py-6 border-secondary/10 hover:border-secondary text-secondary gap-2">
                <Home className="w-4 h-4" /> Back to Base
              </Button>
            </Link>
            <Link href="/products" className="flex-1">
              <Button className="w-full py-6 gap-2">
                Explore More <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          
          <div className="mt-12 pt-8 border-t border-secondary/5">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary/30 text-center w-full">
              Confirmation ID: {confirmationId}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
