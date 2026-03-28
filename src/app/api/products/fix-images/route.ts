import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { products as staticProducts } from '@/lib/data';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    let updatedCount = 0;
    const errors: any[] = [];

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database service unavailable' }, { status: 500 });
    }

    for (const sp of staticProducts) {
      if (!sp.image) continue;
      
      const { error } = await supabaseAdmin
        .from('products')
        .update({ image: sp.image })
        .eq('name', sp.name);
      
      if (!error) {
        updatedCount++;
      } else {
        errors.push({ name: sp.name, error });
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `Updated ${updatedCount} product images in Supabase.`,
      errors 
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
