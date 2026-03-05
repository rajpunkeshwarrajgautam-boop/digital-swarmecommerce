"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Cpu, Zap, Terminal, ShoppingCart, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/store";
import { products } from "@/lib/data";

interface Message {
  role: "user" | "model";
  text: string;
  trigger?: {
    action: string;
    productId: string;
  };
}

export function HiveMindChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { addItem, clearCart } = useCartStore();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, loading]);

  const handleInitiateOrder = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      clearCart();
      addItem(product);
      router.push("/checkout");
    }
  };

  const handleChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || loading) return;

    const userMsg = message;
    setMessage("");
    setHistory([...history, { role: "user", text: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg,
          history: history.map(m => ({ role: m.role, parts: [{ text: m.text }] }))
        })
      });

      const data = await res.json();
      let aiText = data.message;
      let trigger = undefined;

      // Extract COMMAND_TRIGGER if present
      const triggerMatch = aiText.match(/COMMAND_TRIGGER:\s*(\{.*\})/);
      if (triggerMatch) {
        try {
          trigger = JSON.parse(triggerMatch[1]);
          aiText = aiText.replace(/COMMAND_TRIGGER:\s*\{.*\}/, "").trim();
        } catch (e) {
          console.error("Trigger parse error:", e);
        }
      }

      setHistory(prev => [...prev, { role: "model", text: aiText, trigger }]);
    } catch {
      setHistory(prev => [...prev, { role: "model", text: "CONNECTION TERMINATED. RE-ESTABLISHING UPLINK..." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0, rotate: -45 }}
        animate={{ scale: 1, rotate: 0 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-24 z-50 p-4 rounded-full bg-primary text-black shadow-[0_0_20px_rgba(245,245,220,0.4)] border-4 border-black"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Cpu className="w-6 h-6 animate-pulse" />}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            drag
            dragMomentum={false}
            initial={{ opacity: 0, y: 100, scale: 0.9, x: 50 }}
            animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
            exit={{ opacity: 0, y: 100, scale: 0.9, x: 50 }}
            className="fixed bottom-24 right-6 w-[90vw] md:w-[400px] h-[500px] bg-zinc-950 border-4 border-zinc-900 rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-zinc-900 p-4 border-b-2 border-primary/20 flex items-center gap-3 cursor-grab active:cursor-grabbing">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Terminal className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-titan text-sm tracking-widest text-white">AI ASSISTANT</h3>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] text-zinc-500 font-bold uppercase">Online</span>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
              {history.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4 opacity-50">
                  <Zap className="w-12 h-12 text-primary" />
                  <p className="text-sm">Ask me anything about our products, or just say &ldquo;buy&rdquo; to get started!</p>
                </div>
              )}
              {history.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] space-y-3 ${msg.role === "user" ? "flex flex-col items-end" : "flex flex-col items-start"}`}>
                    <div className={`p-3 rounded-2xl text-sm ${
                      msg.role === "user" 
                        ? "bg-primary text-black font-medium" 
                        : "bg-zinc-900 text-zinc-300 border border-white/5"
                    }`}>
                      {msg.text}
                    </div>
                    {msg.role === "model" && msg.trigger?.action === "INITIATE_ORDER" && (
                      <motion.button
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        onClick={() => handleInitiateOrder(msg.trigger!.productId)}
                        className="bg-primary hover:bg-white text-black text-[10px] font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors shadow-[0_0_15px_rgba(255,201,0,0.3)] animate-pulse"
                      >
                        <ShoppingCart className="w-3 h-3" />
                        PROCURE ASSET
                        <ArrowRight className="w-3 h-3" />
                      </motion.button>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-zinc-900 p-3 rounded-2xl border border-white/5 flex gap-1">
                    <span className="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1 h-1 bg-primary rounded-full animate-bounce" />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <form onSubmit={handleChat} className="p-4 bg-zinc-900/50 border-t border-white/5">
              <div className="relative">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask me anything..."
                  className="w-full bg-black border-2 border-zinc-800 rounded-xl py-3 pl-4 pr-12 text-sm focus:outline-none focus:border-primary transition-all text-white"
                />
                <button 
                  type="submit"
                  disabled={loading || !message.trim()}
                  className="absolute right-2 top-1.5 p-2 rounded-lg bg-zinc-800 text-primary hover:bg-primary hover:text-black transition-all disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
