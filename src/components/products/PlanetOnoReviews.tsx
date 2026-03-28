"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Star, Terminal, Send, Shield, User, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ForgeButton } from "@/components/ui/ForgeButton";

interface Review {
  id: string;
  product_id: string;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export function PlanetOnoReviews({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await fetch(`/api/reviews?productId=${productId}`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setReviews(data);
        }
      } catch (err) {
        console.error("Error fetching reviews:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchReviews();
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !comment) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: productId,
          user_name: name,
          rating,
          comment,
        }),
      });

      if (!res.ok) throw new Error("Commit Failed");

      setSuccess(true);
      setName("");
      setComment("");
      setRating(5);
      
      // Refresh reviews
      const refreshRes = await fetch(`/api/reviews?productId=${productId}`);
      const data = await refreshRes.json();
      if (Array.isArray(data)) {
        setReviews(data);
      }
      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Encryption Error: Failed to commit review to the forge.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-32 pt-20 border-t border-white/5 font-inter">
      <div className="flex items-center gap-4 mb-16 px-6 py-2 bg-white/2 border border-white/5 max-w-fit italic">
        <MessageSquare className="w-4 h-4 text-primary" />
        <span className="text-[10px] font-mono font-black uppercase tracking-[0.4em] text-white/40">Review_Feed.log</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
        {/* Form Section */}
        <div className="lg:col-span-5 space-y-12">
          <header>
            <h2 className="text-4xl font-outfit font-black italic uppercase tracking-tighter text-white">Commit <span className="text-primary">Review</span></h2>
            <p className="text-[10px] font-mono text-white/20 uppercase tracking-[0.3em] mt-2">Log your technical assessment of this protocol.</p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center text-[9px] font-mono text-white/30 uppercase tracking-widest">
                <span>Authorized_User</span>
                <User className="w-3 h-3" />
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="USER_NAME"
                required
                className="w-full bg-white/2 border border-white/5 p-6 focus:bg-white/5 focus:border-primary/40 outline-none transition-all font-mono uppercase tracking-[0.2em] text-xs italic text-white"
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center text-[9px] font-mono text-white/30 uppercase tracking-widest">
                <span>Trust_Level</span>
                <Star className="w-3 h-3" />
              </div>
              <div className="flex gap-2 bg-white/2 border border-white/5 p-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="transition-transform active:scale-95"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        star <= rating ? "fill-primary text-primary" : "text-white/10"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center text-[9px] font-mono text-white/30 uppercase tracking-widest">
                <span>Analysis_Content</span>
                <Terminal className="w-3 h-3" />
              </div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="ENTER_ASSESSMENT..."
                required
                rows={4}
                className="w-full bg-white/2 border border-white/5 p-6 focus:bg-white/5 focus:border-primary/40 outline-none transition-all font-mono uppercase tracking-[0.1em] text-xs italic text-white resize-none"
              />
            </div>

            <ForgeButton
              type="submit"
              disabled={submitting}
              className="w-full"
              variant="primary"
            >
              {submitting ? "Encrypting..." : "Publish To Chain"}
            </ForgeButton>

            <AnimatePresence>
              {success && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-4 bg-green-500/10 border border-green-500/20 text-green-500 text-[10px] font-mono uppercase tracking-widest flex items-center gap-3"
                >
                  <Shield className="w-4 h-4" /> SUCCESS: Protocol review synced.
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>

        {/* Reviews List */}
        <div className="lg:col-span-7 space-y-8">
          {loading ? (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-white/2 border border-white/5 animate-pulse" />
              ))}
            </div>
          ) : reviews.length > 0 ? (
            <div className="space-y-6">
               {reviews.map((review) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white/2 border-l-2 border-primary border-y border-white/5 p-8 relative group"
                >
                  <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-100 transition-opacity">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                  
                  <div className="flex justify-between items-start mb-6">
                    <div className="space-y-1">
                      <h4 className="text-sm font-mono font-black uppercase tracking-widest text-white">{review.user_name}</h4>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-2.5 h-2.5 ${
                              s <= review.rating ? "fill-primary text-primary" : "text-white/10"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-[9px] font-mono text-white/5 uppercase tracking-widest">
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-sm text-white/50 leading-relaxed font-inter italic">
                    "{review.comment}"
                  </p>
                </motion.div>
               ))}
            </div>
          ) : (
            <div className="h-full border border-white/5 bg-white/1 flex flex-col items-center justify-center p-20 grayscale opacity-30">
              <Terminal className="w-12 h-12 mb-6" />
              <p className="text-[10px] font-mono font-black uppercase tracking-[0.4em]">Node_Empty: No assessments logged.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
