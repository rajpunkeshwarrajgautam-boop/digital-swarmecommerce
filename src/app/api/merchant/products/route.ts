import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!supabaseAdmin) return NextResponse.json({ error: 'Database unavailable' }, { status: 503 });

  const { data, error } = await supabaseAdmin
    .from('products')
    .select('id,name,description,price,category,image,in_stock,is_visible,is_verified,created_at')
    .eq('merchant_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[merchant products] query failed:', error.message);
    return NextResponse.json({ error: 'Could not load merchant products' }, { status: 503 });
  }

  return NextResponse.json(data || [], { headers: { 'Cache-Control': 'no-store' } });
}
