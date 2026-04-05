import { supabaseAdmin } from "@/lib/supabase";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Tag, Share2 } from "lucide-react";

export const revalidate = 3600; // ISR every hour

export async function generateMetadata({ params }: { params: { slug: string } }) {
  if (!supabaseAdmin) return {};
  
  const { data } = await supabaseAdmin
    .from("blog_posts")
    .select("title, excerpt, image_url")
    .eq("slug", params.slug)
    .single();

  if (!data) return {};

  return {
    title: `${data.title} | Digital Swarm`,
    description: data.excerpt,
    openGraph: {
      title: data.title,
      description: data.excerpt,
      images: [data.image_url],
    },
  };
}

export default async function BlogPostPage({ params }: Readonly<{ params: { slug: string } }>) {
  if (!supabaseAdmin) {
    return <div className="min-h-screen text-white pt-40 px-6 text-center">Database not configured.</div>;
  }

  const { data: post, error } = await supabaseAdmin
    .from("blog_posts")
    .select("*")
    .eq("slug", params.slug)
    .single();

  if (error || !post) {
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
            <div className="flex gap-2 mb-6">
              {post.tags.map((tag: string) => (
                <span key={tag} className="px-3 py-1 bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-primary shadow-[2px_2px_0_#CCFF00]">
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
              {new Date(post.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              {post.reading_time_minutes} MIN READ
            </div>
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-primary" />
              AUTHOR: {post.author}
            </div>
            <button className="ml-auto flex items-center gap-2 hover:text-white transition-colors">
              <Share2 className="w-4 h-4" /> Share Protocol
            </button>
          </div>
        </header>

        {/* Hero Image */}
        <div className="relative aspect-21/9 w-full bg-black border-4 border-black mb-16 shadow-[12px_12px_0_rgba(255,255,255,0.05)] overflow-hidden">
          <Image 
            src={post.image_url}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Content Body - Markdown Rendered */}
        <div className="prose prose-invert prose-p:text-white/70 prose-headings:font-black prose-headings:italic prose-headings:uppercase prose-a:text-primary max-w-none pb-20 border-b border-white/10">
          <div dangerouslySetInnerHTML={{ __html: post.content.replaceAll(/\n\n/g, '<br/><br/>').replaceAll(/^# (.*$)/gim, '<h1 class="text-3xl mt-8 mb-4 text-white">$1</h1>').replaceAll(/^## (.*$)/gim, '<h2 class="text-2xl mt-8 mb-4 tracking-tighter text-white/90">$1</h2>') }} />
        </div>

      </div>
    </div>
  );
}
