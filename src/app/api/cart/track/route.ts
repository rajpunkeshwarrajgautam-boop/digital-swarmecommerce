import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: Request) {
  try {
    const { email, items, total } = await req.json();

    if (!email || !items || items.length === 0) {
      return NextResponse.json({ error: 'Missing required payload' }, { status: 400 });
    }

    // Upsert logic: if email exists with a pending cart in the last 24h, update it. Else insert.
    // To keep it highly performant and simple for the frontend, we just insert a new pending record.
    // The cron job will only pick up the latest one per email.

    const { data, error } = await supabase
      .from('abandoned_carts')
      .insert([
        { 
          email: email.toLowerCase(), 
          cart_data: items, 
          total_amount: total,
          status: 'pending'
        }
      ])
      .select();

    if (error) {
      console.error('Supabase Core Error mapping telemetry:', error);
      return NextResponse.json({ error: 'Matrix logging failed' }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: data[0].id });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
