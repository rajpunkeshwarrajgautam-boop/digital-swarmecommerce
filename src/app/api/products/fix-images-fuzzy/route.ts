import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { products as staticProducts } from '@/lib/data';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database service unavailable.' }, { status: 500 });
    }

    const { data: dbProducts, error: fetchErr } = await supabaseAdmin.from('products').select('id, name');
    
    if (fetchErr || !dbProducts) {
      return NextResponse.json({ error: 'Failed to fetch DB products.' }, { status: 500 });
    }

    let updatedCount = 0;
    const logs: string[] = [];

    for (const dbp of dbProducts) {
      // Basic fuzzy match by checking overlapping words larger than 3 chars (e.g., 'Finance', 'Sales', 'Sentinel')
      const dbpTokens = dbp.name.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/);
      
      let bestMatch = null;
      let highestScore = 0;

      for (const sp of staticProducts) {
        const spTokens = sp.name.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/);
        let score = 0;
        
        for (const token of dbpTokens) {
          if (token.length > 3 && spTokens.includes(token)) {
            score++;
          }
        }
        
        // Boost score for exact category matches like "seo", "1000", "mega", "web"
        if (spTokens.includes('seo') && dbpTokens.includes('seo')) score += 5;
        if (spTokens.includes('1000') && dbpTokens.includes('1000')) score += 5;
        if (spTokens.includes('mega') && dbpTokens.includes('mega')) score += 5;

        if (score > highestScore) {
          highestScore = score;
          bestMatch = sp;
        }
      }

      if (bestMatch && highestScore > 0) {
        if (!bestMatch.image) continue;

        const { error } = await supabaseAdmin
          .from('products')
          .update({ image: bestMatch.image })
          .eq('id', dbp.id);
        
        if (!error) {
          updatedCount++;
          logs.push(`✅ MATCHED DB: "${dbp.name}" -> Static: "${bestMatch.name}" -> Image: ${bestMatch.image}`);
        } else {
          logs.push(`❌ DB ERROR for "${dbp.name}": ${error.message}`);
        }
      } else {
        logs.push(`⚠️ NO MATCH FOUND FOR DB: "${dbp.name}"`);
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `Updated ${updatedCount} product images in Supabase using fuzzy matching.`,
      logs 
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
