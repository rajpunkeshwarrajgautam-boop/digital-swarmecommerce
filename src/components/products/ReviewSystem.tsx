"use client";

import { useState, useEffect, useRef } from "react";
import { Star, User, ShieldCheck, Image as ImageIcon, Send, X, Loader2, Terminal } from "lucide-react";
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
    <div className="mt-16 border-t-4 border-white pt-16">
      <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-8">
        <div>
          <h2 className="text-5xl font-outfit font-black italic tracking-tighter uppercase mb-4">
            Protocol <span className="text-primary italic">Reports</span>
          </h2>
          <div className="flex items-center gap-4 text-xs font-mono uppercase tracking-widest text-white/40">
            <div className="flex gap-1">
              {[1,2,3,4,5].map(i => <div key={i} className="w-2 h-4 bg-primary" />)}
            </div>
            <span>Based on {reviews.length} deployment activations</span>
          </div>
        </div>
        {!showForm && (
          <button 
            onClick={() => setShowForm(true)} 
            className="bg-primary text-black font-outfit font-black uppercase italic px-8 py-3 border-4 border-white hover:bg-white transition-all shadow-[8px_8px_0px_rgba(255,255,255,0.1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
          >
            Submit Report
          </button>
        )}
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="overflow-hidden mb-20"
          >
            <form onSubmit={handleSubmit} className="bg-white/5 p-10 border-4 border-white/10 space-y-8 relative">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                 <Terminal className="w-16 h-16" />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-mono font-black uppercase tracking-[0.5em] text-white/30">System_Rating</label>
                <div className="flex gap-3">
                  {[1,2,3,4,5].map(i => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setNewReview({ ...newReview, rating: i })}
                      className={`w-12 h-12 border-2 transition-all flex items-center justify-center ${newReview.rating >= i ? "border-primary bg-primary/10 text-primary" : "border-white/10 bg-white/5 text-white/20"}`}
                    >
                      <Star className={`w-6 h-6 ${newReview.rating >= i ? "fill-current" : ""}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-mono font-black uppercase tracking-[0.5em] text-white/30">Technical_Observation</label>
                <textarea
                  required
                  rows={4}
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  placeholder="Input technical experience log..."
                  className="w-full bg-black border-2 border-white/10 rounded-none p-6 focus:outline-none focus:border-primary transition-all text-white font-mono text-sm placeholder:text-white/10"
                />
              </div>

              <div className="space-y-6">
                <label className="text-[10px] font-mono font-black uppercase tracking-[0.5em] text-white/30">Visual_Proof_Capture</label>
                <div className="flex flex-wrap gap-4">
                  {previews.map((url, i) => (
                    <div key={url} className="relative w-32 h-32 border-4 border-primary/40 rounded-none overflow-hidden group">
                      {/* eslint-disable-next-line @next/next/no-img-element -- blob: URLs are not supported by next/image */}
                      <img src={url} alt="Preview" className="w-full h-full object-cover grayscale" />
                      <button
                        type="button"
                        onClick={() => removeFile(i)}
                        className="absolute inset-0 bg-red-600/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-8 h-8 text-white" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-32 h-32 border-4 border-dashed border-white/10 rounded-none flex flex-col items-center justify-center gap-3 hover:border-primary/40 hover:bg-primary/5 transition-all group"
                  >
                    <ImageIcon className="w-8 h-8 text-white/20 group-hover:text-primary transition-colors" />
                    <span className="text-[9px] uppercase font-mono font-black text-white/20 group-hover:text-primary transition-colors">Add_Capture</span>
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

              <div className="flex gap-6 pt-6">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="bg-white text-black font-outfit font-black uppercase italic px-10 py-4 border-4 border-primary hover:bg-primary transition-all flex items-center gap-3"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                  Finalize_Report
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowForm(false)}
                  className="text-[10px] font-mono font-black uppercase tracking-[0.4em] text-white/20 hover:text-white transition-colors"
                >
                  Cancel_Sequence
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-12">
        {reviews.length === 0 ? (
          <div className="py-20 text-center border-4 border-dashed border-white/5">
             <p className="text-[10px] font-mono font-black uppercase tracking-[0.5em] text-white/10">No protocol reports archived for this node</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="bg-white/2 border-l-8 border-primary p-10 rounded-none group hover:bg-white/5 transition-all">
              <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-6">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-black flex items-center justify-center border-2 border-white/10 group-hover:border-primary/40 transition-colors">
                    <User className="w-8 h-8 text-white/20" />
                  </div>
                  <div>
                    <h4 className="font-outfit font-black text-2xl italic uppercase text-white flex flex-wrap items-center gap-4 tracking-tighter">
                      {review.user_name}
                      {review.verified && (
                        <span className="text-[9px] bg-primary text-black px-3 py-0.5 font-mono font-black uppercase tracking-widest flex items-center gap-2 italic">
                          <ShieldCheck className="w-3.5 h-3.5" /> VERIFIED_NODE
                        </span>
                      )}
                    </h4>
                    <div className="flex gap-1 mt-3">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className={`w-3 h-5 ${i < review.rating ? "bg-primary" : "bg-white/5"}`} />
                      ))}
                    </div>
                  </div>
                </div>
                <span className="text-[10px] text-white/20 font-mono uppercase tracking-widest">{new Date(review.created_at).toLocaleDateString()}</span>
              </div>
              <p className="text-white/60 leading-relaxed text-xl font-inter italic mb-8 border-l-2 border-white/5 pl-8">
                &ldquo;{review.comment}&rdquo;
              </p>
              {review.images && review.images.length > 0 && (
                <div className="flex flex-wrap gap-4 mt-10">
                  {review.images.map((img, i) => (
                    <motion.div 
                      key={i} 
                      whileHover={{ scale: 1.05, rotate: 1 }}
                      className="w-32 h-32 bg-black border-2 border-white/10 overflow-hidden cursor-zoom-in"
                    >
                      <NextImage
                        src={img}
                        alt={`Review screenshot ${i + 1}`}
                        width={128}
                        height={128}
                        unoptimized
                        className="w-full h-full object-cover grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>

  );
}
