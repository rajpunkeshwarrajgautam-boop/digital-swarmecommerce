"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Star, ShieldCheck, Image as ImageIcon, Send, X, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import NextImage from "next/image";
import Link from "next/link";
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
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isSignedIn } = useUser();

  const average = useMemo(() => {
    if (!reviews.length) return 0;
    return reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / reviews.length;
  }, [reviews]);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/reviews?productId=${encodeURIComponent(productId)}`)
      .then(async (res) => {
        const data = await res.json();
        if (!cancelled && res.ok && Array.isArray(data)) setReviews(data);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [productId]);

  useEffect(() => () => previews.forEach((url) => URL.revokeObjectURL(url)), [previews]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).slice(0, Math.max(0, 4 - selectedFiles.length));
    const accepted = files.filter((file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type) && file.size <= 5 * 1024 * 1024);
    setSelectedFiles((prev) => [...prev, ...accepted].slice(0, 4));
    setPreviews((prev) => [...prev, ...accepted.map((file) => URL.createObjectURL(file))].slice(0, 4));
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => {
      if (prev[index]) URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const uploadImages = async (): Promise<string[]> => {
    const urls: string[] = [];
    for (const file of selectedFiles) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("product_id", productId);
      const res = await fetch("/api/reviews/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || "Review image upload failed");
      urls.push(data.url);
    }
    return urls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSignedIn) return;
    setLoading(true);
    setError("");

    try {
      const images = await uploadImages();
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id: productId, rating: newReview.rating, comment: newReview.comment, images }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Review could not be saved");

      setReviews((prev) => [data, ...prev.filter((review) => review.id !== data.id)]);
      setShowForm(false);
      setNewReview({ rating: 5, comment: "" });
      previews.forEach((url) => URL.revokeObjectURL(url));
      setSelectedFiles([]);
      setPreviews([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Review could not be saved");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mt-16 border-t border-white/10 pt-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
        <div>
          <p className="text-[10px] font-mono font-black uppercase tracking-[0.4em] text-primary mb-3">Verified purchase reviews</p>
          <h2 className="text-4xl md:text-5xl font-outfit font-black tracking-tighter text-white mb-3">Customer feedback</h2>
          {reviews.length ? (
            <p className="text-sm text-white/45">{average.toFixed(1)} / 5 from {reviews.length} verified purchase{reviews.length === 1 ? "" : "s"}.</p>
          ) : (
            <p className="text-sm text-white/45">No verified-purchase reviews have been published for this product yet.</p>
          )}
        </div>

        {isSignedIn ? (
          !showForm && <button onClick={() => setShowForm(true)} className="px-6 py-3 rounded-full bg-primary text-black font-black text-sm">Write a review</button>
        ) : (
          <Link href={`/sign-in?redirect_url=${encodeURIComponent(`/product/${productId}`)}`} className="px-6 py-3 rounded-full border border-white/10 text-white text-sm hover:border-primary/40">Sign in to review</Link>
        )}
      </div>

      {showForm && (
        <motion.form initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit} className="mb-14 border border-white/10 bg-white/[0.03] rounded-3xl p-6 md:p-8 space-y-7">
          <div>
            <label className="text-xs font-bold text-white/50 block mb-3">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button key={value} type="button" aria-label={`${value} star rating`} onClick={() => setNewReview((prev) => ({ ...prev, rating: value }))} className={`w-11 h-11 rounded-xl border flex items-center justify-center ${newReview.rating >= value ? "border-primary/50 bg-primary/10 text-primary" : "border-white/10 text-white/20"}`}>
                  <Star className={`w-5 h-5 ${newReview.rating >= value ? "fill-current" : ""}`} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="review-comment" className="text-xs font-bold text-white/50 block mb-3">Your experience</label>
            <textarea id="review-comment" required minLength={2} maxLength={5000} rows={5} value={newReview.comment} onChange={(e) => setNewReview((prev) => ({ ...prev, comment: e.target.value }))} className="w-full bg-black/30 border border-white/10 rounded-2xl p-5 focus:outline-none focus:border-primary/50 text-white text-sm" placeholder="Describe what you bought and how it worked for you." />
          </div>

          <div>
            <div className="flex items-center justify-between gap-4 mb-3"><span className="text-xs font-bold text-white/50">Optional screenshots</span><span className="text-[10px] text-white/25">JPEG, PNG, WebP · max 4 · 5 MB each</span></div>
            <div className="flex flex-wrap gap-3">
              {previews.map((url, index) => (
                <div key={url} className="relative w-24 h-24 border border-white/10 rounded-xl overflow-hidden">
                  {/* blob URLs cannot be optimized by next/image */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="Review upload preview" className="w-full h-full object-cover" />
                  <button type="button" aria-label="Remove image" onClick={() => removeFile(index)} className="absolute top-1 right-1 w-7 h-7 rounded-full bg-black/80 text-white flex items-center justify-center"><X className="w-4 h-4" /></button>
                </div>
              ))}
              {selectedFiles.length < 4 && (
                <button type="button" onClick={() => fileInputRef.current?.click()} className="w-24 h-24 border border-dashed border-white/15 rounded-xl flex flex-col items-center justify-center gap-2 text-white/30 hover:text-primary hover:border-primary/30"><ImageIcon className="w-5 h-5" /><span className="text-[9px]">Add</span></button>
              )}
            </div>
            <input ref={fileInputRef} type="file" multiple accept="image/jpeg,image/png,image/webp" onChange={handleFileChange} className="hidden" />
          </div>

          {error && <p className="text-sm text-red-300 border border-red-500/20 bg-red-500/10 rounded-xl p-4">{error}</p>}
          <p className="text-xs text-white/30 flex items-start gap-2"><ShieldCheck className="w-4 h-4 text-primary shrink-0" />The server accepts a review only when your signed-in email has a license record for this product.</p>

          <div className="flex flex-wrap gap-3">
            <button type="submit" disabled={loading} className="px-6 py-3 rounded-full bg-primary text-black font-black text-sm flex items-center gap-2 disabled:opacity-50">{loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} Save review</button>
            <button type="button" onClick={() => { setShowForm(false); setError(""); }} className="px-6 py-3 rounded-full border border-white/10 text-white/50 text-sm">Cancel</button>
          </div>
        </motion.form>
      )}

      <div className="space-y-6">
        {reviews.map((review) => (
          <article key={review.id} className="border border-white/10 bg-white/[0.02] rounded-3xl p-6 md:p-8">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5">
              <div>
                <div className="flex flex-wrap items-center gap-3"><h3 className="font-bold text-white">{review.user_name}</h3><span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[9px] font-black uppercase"><ShieldCheck className="w-3 h-3" /> Verified purchase</span></div>
                <div className="flex gap-1 mt-3" aria-label={`${review.rating} out of 5 stars`}>{[1, 2, 3, 4, 5].map((value) => <Star key={value} className={`w-4 h-4 ${value <= review.rating ? "text-primary fill-current" : "text-white/10"}`} />)}</div>
              </div>
              <time className="text-xs text-white/25">{new Date(review.created_at).toLocaleDateString()}</time>
            </div>
            <p className="text-white/55 leading-relaxed">{review.comment}</p>
            {!!review.images?.length && <div className="flex flex-wrap gap-3 mt-6">{review.images.map((image, index) => <NextImage key={image} src={image} alt={`Customer review image ${index + 1}`} width={120} height={120} unoptimized className="w-28 h-28 rounded-xl object-cover border border-white/10" />)}</div>}
          </article>
        ))}
      </div>
    </section>
  );
}
