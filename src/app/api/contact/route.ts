import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { rateLimit } from '@/lib/rate-limit';

const limiter = rateLimit({
  interval: 10 * 60 * 1000,
  uniqueTokenPerInterval: 500,
});

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'anonymous';
    try {
      await limiter.check(3, ip);
    } catch {
      return NextResponse.json({ error: 'Too many messages. Please try again later.' }, { status: 429 });
    }

    const body = await request.json();
    const { firstName, lastName, email, message } = body;

    if (!firstName?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json({ error: 'Name, email, and message are required.' }, { status: 400 });
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Support database is temporarily unavailable.' }, { status: 503 });
    }

    const { error } = await supabaseAdmin
      .from('contact_messages')
      .insert({
        first_name: firstName.trim().slice(0, 120),
        last_name: lastName?.trim().slice(0, 120) || '',
        email: email.trim().toLowerCase().slice(0, 254),
        message: message.trim().slice(0, 10_000),
      });

    if (error) {
      console.error('[contact] Supabase insert failed:', error.message);
      return NextResponse.json(
        { error: 'We could not store your message right now. Please email support@digitalswarm.in or try again shortly.' },
        { status: 503 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[contact] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
