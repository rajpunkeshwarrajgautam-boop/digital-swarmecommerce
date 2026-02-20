import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { products as staticProducts } from '@/lib/data';

export async function GET() {
  try {
    // Attempt to fetch from Supabase
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('[products/route] Supabase error, falling back to static data:', error.message);
      return NextResponse.json(staticProducts);
    }

    // If DB is empty, fall back to static data
    if (!data || data.length === 0) {
      console.info('[products/route] DB empty, falling back to static data');
      return NextResponse.json(staticProducts);
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error('[products/route] Unexpected error:', err);
    // Graceful degradation — always serve something
    return NextResponse.json(staticProducts);
  }
}
