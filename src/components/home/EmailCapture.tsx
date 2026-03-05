"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, ArrowRight } from "lucide-react";
import Link from "next/link";

export function EmailCapture() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) return;
    setLoading(true);
    // Simulate subscription (replace with your email provider API call)
    await new Promise((r) => setTimeout(r, 800));
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <section className="py-28 bg-background border-t border-border/40">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          {/* Final CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Ready to Ship Faster?
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Browse our full catalogue of production-ready digital products.
            </p>
            <Link href="/products">
              <button className="group inline-flex items-center gap-2 bg-primary text-black font-black text-lg px-10 py-4 rounded-full border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all duration-200">
                Browse Products
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </motion.div>

          {/* Email capture divider */}
          <div className="relative flex items-center gap-4 my-12">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground uppercase tracking-widest">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Email form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <h3 className="text-2xl font-bold mb-2">Get Free Delivery Guides</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Join 1,500+ developers who get our free monthly newsletter — new products, discounts, and tutorials.
            </p>

            {submitted ? (
              <div className="flex items-center justify-center gap-2 text-green-500 font-semibold py-4">
                <Send className="w-5 h-5" />
                You&apos;re in! Check your inbox for a welcome email.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="flex-1 px-5 py-3 rounded-full border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center gap-2 bg-primary text-black font-bold px-6 py-3 rounded-full border border-black hover:opacity-90 disabled:opacity-60 transition-opacity text-sm"
                >
                  {loading ? "..." : (
                    <>
                      Subscribe <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
            <p className="text-xs text-muted-foreground mt-3">No spam. Unsubscribe anytime.</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
