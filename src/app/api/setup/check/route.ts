
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // First try to count
    let { count, error } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });

    // If "head: true" fails or count is returns null (RLS or other issue), try standard select
    if (count === null && !error) {
       const { data, error: selectError } = await supabase.from('products').select('*').limit(1);
       if (!selectError) {
         count = data ? data.length : 0; // At least we know we can select
       } else {
         error = selectError;
       }
    }
    
    if (error) {
      return NextResponse.json({ 
        status: 'error', 
        message: error.message, 
        details: error 
      }); // Return 200 so frontend can handle it without throwing
    }

    return NextResponse.json({ 
      status: 'ok', 
      message: 'Connection successful', 
      count: count || 0
    });
  } catch (err: any) {
    return NextResponse.json({ 
      status: 'error', 
      message: err.message 
    }, { status: 500 });
  }
}
