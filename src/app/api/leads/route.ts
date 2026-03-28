import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database configuration missing' }, { status: 500 });
    }

    const { error } = await supabaseAdmin.from('leads').insert({ 
      email: email.toLowerCase().trim(),
      source: 'prompt_generator_utility'
    });
    
    // Ignore unique constraint errors (if they generate a prompt 2x)
    if (error && error.code !== '23505') {
       console.error('[Leads Insert Error]', error);
       return NextResponse.json({ error: 'Failed to record lead' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Email securely recorded. Payload unlocked.' 
    });
  } catch (err: any) {
    console.error('[Leads API Error]', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
