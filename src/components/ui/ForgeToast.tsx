"use client";

import { create } from "zustand";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, CheckCircle2, Info, XCircle, X } from "lucide-react";

type ToastType = "SUCCESS" | "ERROR" | "WARNING" | "INFO";

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message: string;
}

interface ToastStore {
  toasts: Toast[];
  addToast: (type: ToastType, title: string, message: string) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (type, title, message) => {
    const id = Math.random().toString(36).substring(2, 9);
    set((state) => ({
      toasts: [...state.toasts, { id, type, title, message }],
    }));
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, 5000);
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));

export function ForgeToast() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-4 w-full max-w-sm">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 20, filter: "blur(10px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
            className={`relative p-1 overflow-hidden border ${
              toast.type === "SUCCESS" ? "border-accent/40 bg-accent/5" :
              toast.type === "ERROR" ? "border-primary/40 bg-primary/5" :
              toast.type === "WARNING" ? "border-yellow-500/40 bg-yellow-500/5" :
              "border-white/20 bg-white/5"
            } backdrop-blur-xl group`}
          >
            {/* Corner Accent */}
            <div className={`absolute top-0 right-0 w-2 h-2 ${
              toast.type === "SUCCESS" ? "bg-accent" :
              toast.type === "ERROR" ? "bg-primary" :
              toast.type === "WARNING" ? "bg-yellow-500" :
              "bg-white"
            }`} />
            
            <div className="flex gap-4 p-5">
              <div className={`shrink-0 ${
                toast.type === "SUCCESS" ? "text-accent" :
                toast.type === "ERROR" ? "text-primary" :
                toast.type === "WARNING" ? "text-yellow-500" :
                "text-white"
              }`}>
                {toast.type === "SUCCESS" && <CheckCircle2 className="w-5 h-5" />}
                {toast.type === "ERROR" && <XCircle className="w-5 h-5" />}
                {toast.type === "WARNING" && <AlertTriangle className="w-5 h-5" />}
                {toast.type === "INFO" && <Info className="w-5 h-5" />}
              </div>

              <div className="flex-1 min-w-0 flex flex-col gap-1">
                <header className="flex items-center gap-3">
                  <span className={`text-[9px] font-mono font-black uppercase tracking-[0.3em] ${
                    toast.type === "SUCCESS" ? "text-accent" :
                    toast.type === "ERROR" ? "text-primary" :
                    toast.type === "WARNING" ? "text-yellow-500" :
                    "text-white/40"
                  }`}>
                    {toast.type}_LOG.v2
                  </span>
                  <div className="h-px flex-1 bg-white/5" />
                </header>
                <h4 className="text-xs font-outfit font-black uppercase italic tracking-tight text-white">{toast.title}</h4>
                <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest leading-relaxed">
                  {toast.message}
                </p>
              </div>

              <button 
                onClick={() => removeToast(toast.id)}
                className="shrink-0 text-white/10 hover:text-white transition-colors self-start"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scanline Effect */}
            <div className="absolute inset-x-0 bottom-0 h-px bg-white/10 overflow-hidden">
               <motion.div 
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ duration: 5, ease: "linear" }}
                  className={`h-full w-full ${
                    toast.type === "SUCCESS" ? "bg-accent" :
                    toast.type === "ERROR" ? "bg-primary" :
                    toast.type === "WARNING" ? "bg-yellow-500" :
                    "bg-white"
                  }`}
               />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
