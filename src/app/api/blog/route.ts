import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database not connected' }, { status: 500 });
    }

    const { data, error } = await supabaseAdmin
      .from('blog_posts')
      .select('*')
      .order('published_at', { ascending: false });

    if (error) throw error;

    // Map database fields to the UI schema
    const uiPosts = data.map((post) => ({
      title: post.title,
      excerpt: post.excerpt,
      category: post.tags && post.tags.length > 0 ? post.tags[0] : "Engineering",
      date: new Date(post.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase(),
      readTime: `${post.reading_time_minutes || 5} MIN READ`,
      image: post.image_url,
      slug: post.slug,
    }));

    return NextResponse.json(uiPosts);
  } catch (error: any) {
    console.error('[Blog API Error]', error);
    return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 });
  }
}
