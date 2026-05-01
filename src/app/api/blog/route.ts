import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database not connected' }, { status: 500 });
    }

    // Check if table exists (simple query)
    const { data, error } = await supabaseAdmin
      .from('blog_posts')
      .select('*')
      .order('published_at', { ascending: false });

    if (error) {
      if (error.code === '42P01') { // Table not found
        console.warn('[Blog API] Table blog_posts does not exist yet.');
        return NextResponse.json([]);
      }
      throw error;
    }

    // Map database fields to the UI schema
    const uiPosts = (data || []).map((post) => ({
      title: post.title,
      excerpt: post.excerpt,
      category: post.tags && post.tags.length > 0 ? post.tags[0] : "Engineering",
      date: new Date(post.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase(),
      readTime: `${post.reading_time_minutes || 5} MIN READ`,
      image: post.image_url?.includes('photo-1620712943543-bcc4628c6827') || post.image_url?.includes('photo-1620825937374-87fc1d6aaffa')
        ? 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=60'
        : post.image_url,
      slug: post.slug,
    }));

    return NextResponse.json(uiPosts);
  } catch (error: any) {
    console.error('[Blog API Error]', error);
    return NextResponse.json({ error: 'Failed to fetch blog posts', details: error.message }, { status: 500 });
  }
}
