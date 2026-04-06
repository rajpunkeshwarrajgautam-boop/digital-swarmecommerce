import { NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';

/**
 * Diagnostic endpoint — REMOVE AFTER DEBUGGING.
 * Exposes slug inventory and client availability.
 * Access: GET /api/debug/blog
 */
export async function GET() {
  const adminAvailable = !!supabaseAdmin;
  const publicAvailable = !!supabase;

  // Try admin first, fallback to public
  const client = supabaseAdmin ?? supabase;

  let posts: unknown[] = [];
  let queryError: unknown = null;

  if (client) {
    const { data, error } = await client
      .from('blog_posts')
      .select('id, slug, title, status, published_at')
      .order('published_at', { ascending: false })
      .limit(30);

    posts = data ?? [];
    queryError = error;
  }

  return NextResponse.json({
    status: 'ok',
    clients: { adminAvailable, publicAvailable },
    env: {
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      hasServiceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    },
    queryError,
    posts,
    total: posts.length,
  });
}
