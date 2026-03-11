"use client";

import { useState, useEffect } from "react";
import { Star, User, ShieldCheck, Image as ImageIcon, Send } from "lucide-react";
import { Button } from "../ui/Button";
import { motion, AnimatePresence } from "framer-motion";

interface Review {
  id: string;
  user_name: string;
  rating: number;
  comment: string;
  verified: boolean;
  created_at: string;
  images?: string[];
}

export function ReviewSystem({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadReviews() {
      // Load deployment reports
      setReviews([
        {
          id: "1",
          user_name: "Alex Dev",
          rating: 5,
          comment: "The codebase is exceptionally clean. Saved me at least 40 hours of boilerplate setup.",
          verified: true,
          created_at: new Date().toISOString(),
        },
        {
          id: "2",
          user_name: "Sarah K.",
          rating: 4,
          comment: "Solid stack, though I had to tweak the Tailwind config for my specific needs.",
          verified: true,
          created_at: new Date().toISOString(),
        }
      ]);
    }
    loadReviews();
  }, [productId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const review: Review = {
        id: Math.random().toString(),
        user_name: "You",
        rating: newReview.rating,
        comment: newReview.comment,
        verified: false,
        created_at: new Date().toISOString(),
      };
      setReviews([review, ...reviews]);
      setLoading(false);
      setShowForm(false);
      setNewReview({ rating: 5, comment: "" });
    }, 1000);
  };

  return (
    <div className="mt-16 border-t border-border pt-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-titan tracking-tight mb-2">DEVELOPER FEEDBACK</h2>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="flex text-yellow-500">
              {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
            </div>
            <span>Based on {reviews.length} deployment reports</span>
          </div>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)} variant="outline">Write a Review</Button>
        )}
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-12"
          >
            <form onSubmit={handleSubmit} className="bg-secondary/20 p-8 rounded-3xl border border-primary/20 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-widest opacity-50">Overall Rating</label>
                <div className="flex gap-2">
                  {[1,2,3,4,5].map(i => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setNewReview({ ...newReview, rating: i })}
                      className={`p-2 rounded-lg transition-colors ${newReview.rating >= i ? "text-yellow-500" : "text-zinc-700"}`}
                    >
                      <Star className={`w-8 h-8 ${newReview.rating >= i ? "fill-current" : ""}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-widest opacity-50">Technical Feedback</label>
                <textarea
                  required
                  rows={4}
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  placeholder="Share your experience with this codebase..."
                  className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 focus:outline-none focus:border-primary transition-colors text-white"
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" isLoading={loading} className="gap-2">
                  <Send className="w-4 h-4" /> Submit Report
                </Button>
                <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="bg-secondary/10 border border-border/50 p-6 rounded-3xl group">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center border border-white/10">
                  <User className="w-5 h-5 text-zinc-500" />
                </div>
                <div>
                  <h4 className="font-bold flex items-center gap-2">
                    {review.user_name}
                    {review.verified && (
                      <span className="text-[10px] bg-green-500/10 text-green-500 px-2 py-0.5 rounded-full flex items-center gap-1 border border-green-500/20">
                        <ShieldCheck className="w-3 h-3" /> VERIFIED DEPLOYER
                      </span>
                    )}
                  </h4>
                  <div className="flex text-yellow-500 mt-0.5">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">{new Date(review.created_at).toLocaleDateString()}</span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              {review.comment}
            </p>
            {review.images && review.images.length > 0 && (
              <div className="flex gap-2 mt-4">
                {review.images.map((img, i) => (
                  <div key={i} className="w-16 h-16 rounded-lg bg-zinc-800 border border-white/10 flex items-center justify-center">
                    <ImageIcon className="w-4 h-4 text-zinc-600" />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
