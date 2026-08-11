"use client";

import { motion } from "framer-motion";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";
import { useState } from "react";

export function EmailCapture() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || 'Subscription failed');
      setStatus('success');
      setMessage(data.message || 'Subscription confirmed.');
      setEmail('');
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Subscription failed');
    }
  };

  return (
    <section className="py-28 bg-secondary relative overflow-hidden">
      <div className="container px-6 mx-auto relative z-10 w-full max-w-5xl">
        <div className="bg-white rounded-[2rem] p-10 md:p-16 shadow-2xl">
          <div className="max-w-2xl mx-auto flex flex-col items-center text-center">
            <h2 className="text-4xl md:text-6xl font-black text-secondary tracking-tighter uppercase leading-none mb-6">
              Product <span className="text-primary">updates</span>
            </h2>
            <p className="text-secondary/55 text-base leading-7 mb-10">
              New releases, practical implementation notes, and material store updates. The form succeeds only when the backend saves the contact.
            </p>

            <form onSubmit={handleSubmit} className="w-full flex flex-col sm:flex-row gap-4">
              <label htmlFor="legacy-newsletter-email" className="sr-only">Email address</label>
              <input
                id="legacy-newsletter-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="flex-1 h-16 bg-secondary/5 border border-secondary/15 focus:border-primary px-6 rounded-2xl font-semibold text-secondary outline-none transition-all"
              />
              <button
                disabled={status === "loading"}
                className="h-16 px-8 bg-primary text-black font-black uppercase rounded-2xl border border-primary/20 hover:bg-black hover:text-white transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {status === "loading" ? "Saving..." : "Subscribe"}
                <Send className="w-5 h-5" />
              </button>
            </form>

            {message && (
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className={`mt-6 flex items-center gap-2 text-sm font-semibold ${status === 'success' ? 'text-green-700' : 'text-red-700'}`}>
                {status === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                {message}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
