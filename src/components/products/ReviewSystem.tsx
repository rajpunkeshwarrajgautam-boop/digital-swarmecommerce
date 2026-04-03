"use client";

import { useState, useEffect, useRef } from "react";
import { Star, User, ShieldCheck, Image as ImageIcon, Send, X, Loader2 } from "lucide-react";
import { Button } from "../ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import NextImage from "next/image";
import { useUser } from "@clerk/nextjs";

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
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, isSignedIn } = useUser();

  useEffect(() => {
    async function loadReviews() {
      try {
        const res = await fetch(`/api/reviews?productId=${productId}`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setReviews(data);
        }
      } catch (err) {
        console.error("Failed to load reviews:", err);
      }
    }
    loadReviews();
  }, [productId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...files]);
      
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  /**
   * Uploads review images through the server-side API route.
   * Using a server route ensures the service role key is used for storage,
   * bypassing RLS policies that would block client-side direct uploads.
   */
  const uploadImages = async (): Promise<string[]> => {
    if (selectedFiles.length === 0) return [];

    const uploadPromises = selectedFiles.map(async (file) => {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/reviews/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Upload failed");
      }

      const { url } = await res.json();
      return url as string;
    });

    return Promise.all(uploadPromises);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const imageUrls = await uploadImages();
      
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: productId,
          user_name: user?.fullName || user?.username || "Anonymous Developer",
          rating: newReview.rating,
          comment: newReview.comment,
          verified: isSignedIn || false,
          images: imageUrls
        })
      });

      if (res.ok) {
        const addedReview = await res.json();
        setReviews([addedReview, ...reviews]);
        setShowForm(false);
        setNewReview({ rating: 5, comment: "" });
        setSelectedFiles([]);
        setPreviews([]);
      }
    } catch (err) {
      console.error("Failed to submit review:", err);
    } finally {
      setLoading(false);
    }
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

              <div className="space-y-4">
                <label className="text-sm font-bold uppercase tracking-widest opacity-50">Visual Proof (Optional)</label>
                <div className="flex flex-wrap gap-4">
                  {previews.map((url, i) => (
                    <div key={url} className="relative w-24 h-24 border-2 border-primary/40 rounded-xl overflow-hidden group">
                      {/* eslint-disable-next-line @next/next/no-img-element -- blob: URLs are not supported by next/image */}
                      <img src={url} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeFile(i)}
                        className="absolute top-1 right-1 bg-black/60 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-24 h-24 border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-primary/40 hover:bg-primary/5 transition-all group"
                  >
                    <ImageIcon className="w-6 h-6 text-zinc-500 group-hover:text-primary transition-colors" />
                    <span className="text-[10px] uppercase font-bold text-zinc-500 group-hover:text-primary transition-colors">Add Image</span>
                  </button>
                </div>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" isLoading={loading} className="gap-2 px-8">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  Submit Report
                </Button>
                <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="bg-secondary/10 border border-border/50 p-8 rounded-none group hover:border-primary/30 transition-colors">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-none bg-zinc-900 flex items-center justify-center border border-white/10 group-hover:border-primary/40 transition-colors">
                  <User className="w-6 h-6 text-zinc-500" />
                </div>
                <div>
                  <h4 className="font-titan text-lg flex items-center gap-2">
                    {review.user_name}
                    {review.verified && (
                      <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-none flex items-center gap-1 border border-primary/20">
                        <ShieldCheck className="w-3 h-3" /> VERIFIED DEPLOYER
                      </span>
                    )}
                  </h4>
                  <div className="flex text-primary mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? "fill-current" : "text-zinc-800"}`} />
                    ))}
                  </div>
                </div>
              </div>
              <span className="text-xs text-muted-foreground font-mono">{new Date(review.created_at).toLocaleDateString()}</span>
            </div>
            <p className="text-muted-foreground leading-relaxed text-lg mb-6">
              {review.comment}
            </p>
            {review.images && review.images.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {review.images.map((img, i) => (
                  <motion.div 
                    key={i} 
                    whileHover={{ scale: 1.05 }}
                    className="w-24 h-24 bg-zinc-900 border border-white/10 overflow-hidden cursor-zoom-in"
                  >
                    <NextImage
                      src={img}
                      alt={`Review screenshot ${i + 1}`}
                      width={96}
                      height={96}
                      unoptimized
                      className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all"
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
