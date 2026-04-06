import { supabaseAdmin, supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Tag, Share2 } from "lucide-react";

// Force dynamic rendering — no ISR cache that can serve stale 404s
export const dynamic = "force-dynamic";

/**
 * Fetch a blog post by slug.
 * Tries supabaseAdmin first (bypasses RLS), falls back to public client.
 */
async function fetchPost(slug: string) {
  const client = supabaseAdmin ?? supabase;

  const { data, error } = await client
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error(`[Blog] Query error for slug "${slug}":`, error.message);
  }

  return { post: data, error };
}

// ─── Next.js 15/16 — params is a Promise, must be awaited ────────────────────
type BlogParams = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: BlogParams }) {
  const { slug } = await params;
  const { post } = await fetchPost(slug);

  if (!post) return { title: "Post Not Found | Digital Swarm" };

  return {
    title: `${post.title} | Digital Swarm`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.image_url ? [post.image_url] : [],
    },
  };
}

export default async function BlogPostPage({ params }: { params: BlogParams }) {
  // ⚠️ Must await params in Next.js 15+ — accessing synchronously gives undefined
  const { slug } = await params;
  const { post, error } = await fetchPost(slug);

  if (error && !post) {
    console.error(`[Blog] Fatal: slug="${slug}" db-error="${error.message}"`);
    notFound();
  }

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white pt-32 pb-24 font-mono">
      <div className="max-w-4xl mx-auto px-6">

        {/* Back Navigation */}
        <Link
          href="/blog"
          className="inline-flex items-center text-white/50 hover:text-primary transition-colors text-xs font-black uppercase tracking-widest mb-10"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Intelligence
        </Link>

        {/* Post Metadata Header */}
        <header className="mb-12">
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-primary shadow-[2px_2px_0_#CCFF00]"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter leading-[1.1] mb-6">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-[10px] font-black uppercase tracking-widest text-white/40 pb-8 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              {new Date(post.published_at).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              {post.reading_time_minutes ?? 5} MIN READ
            </div>
            {post.author && (
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-primary" />
                AUTHOR: {post.author}
              </div>
            )}
            <button className="ml-auto flex items-center gap-2 hover:text-white transition-colors">
              <Share2 className="w-4 h-4" /> Share Protocol
            </button>
          </div>
        </header>

        {/* Hero Image */}
        {post.image_url && (
          <div className="relative w-full aspect-video bg-black border-4 border-black mb-16 shadow-[12px_12px_0_rgba(255,255,255,0.05)] overflow-hidden">
            <Image
              src={post.image_url}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Content Body */}
        <div className="prose prose-invert prose-p:text-white/70 prose-headings:font-black prose-headings:italic prose-headings:uppercase prose-a:text-primary max-w-none pb-20 border-b border-white/10">
          <div
            dangerouslySetInnerHTML={{
              __html: (post.content ?? "")
                .replaceAll(/^# (.*$)/gim, '<h1 class="text-3xl mt-8 mb-4 text-white">$1</h1>')
                .replaceAll(/^## (.*$)/gim, '<h2 class="text-2xl mt-6 mb-3 text-white/90">$1</h2>')
                .replaceAll(/^### (.*$)/gim, '<h3 class="text-xl mt-4 mb-2 text-white/80">$1</h3>')
                .replaceAll(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                .replaceAll(/\*(.*?)\*/g, "<em>$1</em>")
                .replaceAll(/\n\n/g, "<br/><br/>"),
            }}
          />
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-3 px-10 py-5 bg-primary text-black font-black uppercase italic tracking-widest text-sm border-4 border-black shadow-[8px_8px_0_#000] hover:-translate-y-1 hover:shadow-[10px_10px_0_#000] transition-all"
          >
            Explore the Arsenal →
          </Link>
        </div>

      </div>
    </div>
  );
}
