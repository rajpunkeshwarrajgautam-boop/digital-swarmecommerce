"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Cpu, Zap, Terminal, ShoppingCart, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/store";
import { useMemoryStore } from "@/lib/memory/MemoryStore";
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
  const { userPreferences, logs, addLog } = useMemoryStore();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isMemoryLoaded, setIsMemoryLoaded] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { addItem, clearCart } = useCartStore();

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && chatRef.current && !chatRef.current.contains(event.target as Node)) {
        // Only close if we're not clicking the toggle button
        const toggleButton = document.getElementById('chat-toggle-btn');
        if (toggleButton && !toggleButton.contains(event.target as Node)) {
          setIsOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Initial scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: isOpen ? "smooth" : "auto"
      });
    }
  }, [history, loading, isOpen]);

  // Load history from MemoryStore on mount
  useEffect(() => {
    if (!isMemoryLoaded && logs.length > 0) {
      const chatHistory: Message[] = logs
        .filter(log => log.type === 'interaction' || log.type === 'ai')
        .reverse()
        .map(log => ({
          role: log.type === 'ai' ? 'model' : 'user',
          text: log.content,
          metadata: log.metadata
        }));
      setHistory(chatHistory);
      setIsMemoryLoaded(true);
    }
  }, [logs, isMemoryLoaded]);

  // Initial discoverability timer: Fade to translucent after 12 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasInteracted(true);
    }, 12000);
    return () => clearTimeout(timer);
  }, []);

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
    addLog(userMsg, 'interaction');
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
      addLog(aiText, 'ai', { trigger });
    } catch {
      setHistory(prev => [...prev, { role: "model", text: "CONNECTION TERMINATED. RE-ESTABLISHING UPLINK..." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button Container */}
      <div 
        className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 pointer-events-none"
        onMouseEnter={() => setHasInteracted(true)}
      >
        <AnimatePresence>
          {!isOpen && !hasInteracted && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              transition={{ delay: 2, duration: 0.5 }}
              className="bg-primary text-white text-xs font-bold py-2 px-4 rounded-full rounded-br-sm shadow-xl pointer-events-auto cursor-pointer"
              onClick={() => {
                setIsOpen(true);
                setHasInteracted(true);
              }}
            >
              Need help? Ask AI Zero! 👋
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          id="chat-toggle-btn"
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            setIsOpen(!isOpen);
            setHasInteracted(true);
          }}
          className={`pointer-events-auto p-3 sm:p-4 rounded-full shadow-lg border border-border/50 transition-all duration-500 relative z-[60] ${
            isOpen
              ? "bg-primary text-white opacity-100"
              : !hasInteracted
                ? "bg-white text-foreground opacity-100 shadow-[0_0_20px_rgba(59,130,246,0.3)] animate-pulse"
                : "bg-white/60 backdrop-blur-md text-foreground opacity-30 hover:opacity-100"
          }`}
        >
          {isOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Cpu className="w-5 h-5 sm:w-6 sm:h-6" />}
        </motion.button>
      </div>

      {/* Backdrop for outside click detection (Full screen overlay) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[45]"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={chatRef}
            drag
            dragMomentum={false}
            initial={{ opacity: 0, y: 100, scale: 0.9, x: 50 }}
            animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
            exit={{ opacity: 0, y: 100, scale: 0.9, x: 50 }}
            className="fixed bottom-24 right-6 w-[90vw] md:w-[400px] h-[60vh] md:h-[500px] bg-[#050505] border-4 border-[#CCFF00] shadow-[10px_10px_0_#CCFF00] z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-[#111] p-4 border-b-4 border-[#CCFF00] flex items-center justify-between gap-3 cursor-grab active:cursor-grabbing shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#CCFF00] text-black">
                  <Terminal className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black italic text-sm tracking-widest text-[#CCFF00]">AI ASSISTANT</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#CCFF00] animate-pulse" />
                    <span className="text-[10px] text-white font-bold uppercase">Online</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 text-white/50 hover:text-[#CCFF00] transition-colors"
                title="Minimize Uplink"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages - Fixed scroll container */}
            <div 
              ref={scrollRef} 
              className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth scrollbar-thin scrollbar-thumb-[#CCFF00] scrollbar-track-black"
              style={{ overflowY: 'auto', maxHeight: '100%' }}
            >
              {history.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
                  <Zap className="w-12 h-12 text-[#CCFF00]" />
                  <p className="text-sm text-white font-bold italic uppercase tracking-widest bg-black border-2 border-[#CCFF00] p-4 shadow-[4px_4px_0_#CCFF00] chat-helper-text">
                    Ask me anything about our products, or just say &ldquo;buy&rdquo; to get started!
                  </p>
                </div>
              )}
              {history.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] space-y-3 ${msg.role === "user" ? "flex flex-col items-end" : "flex flex-col items-start"}`}>
                    <div className={`p-3 border-2 text-sm font-bold ${
                      msg.role === "user" 
                        ? "bg-[#CCFF00] text-black border-black shadow-[4px_4px_0_#fff]" 
                        : "bg-black text-[#CCFF00] border-[#CCFF00] shadow-[4px_4px_0_#CCFF00]"
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
                  <div className="bg-gray-100 p-3 rounded-2xl border border-border/50 flex gap-1">
                    <span className="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1 h-1 bg-primary rounded-full animate-bounce" />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <form onSubmit={handleChat} className="p-4 bg-black border-t-4 border-[#CCFF00]">
              <div className="relative">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask me anything..."
                  className="w-full bg-[#111] border-2 border-[#CCFF00] py-3 pl-4 pr-12 text-sm focus:outline-none focus:bg-[#222] transition-all text-[#CCFF00] font-bold placeholder:text-[#CCFF00]/40"
                />
                <button 
                  type="submit"
                  disabled={loading || !message.trim()}
                  className="absolute right-2 top-2 p-1.5 bg-[#CCFF00] text-black hover:bg-white transition-all disabled:opacity-50"
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
