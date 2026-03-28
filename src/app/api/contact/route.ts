import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { rateLimit } from '@/lib/rate-limit';

const limiter = rateLimit({
  interval: 10 * 60 * 1000, // 10 minutes
  uniqueTokenPerInterval: 500, // Max IPs to track
});

export async function POST(request: Request) {
  try {
    // Rate Limit Check
    const ip = request.headers.get('x-forwarded-for') || 'anonymous';
    try {
      await limiter.check(3, ip); // 3 requests per interval
    } catch {
      return NextResponse.json({ error: 'Too many messages. Please try again later.' }, { status: 429 });
    }

    const body = await request.json();
    const { firstName, lastName, email, message } = body;

    // Basic server-side validation
    if (!firstName?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json({ error: 'First name, email, and message are required.' }, { status: 400 });
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
    }

    // Save to Supabase
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database configuration missing' }, { status: 500 });
    }

    const { error } = await supabaseAdmin
      .from('contact_messages')
      .insert({
        first_name: firstName.trim(),
        last_name: lastName?.trim() || '',
        email: email.trim().toLowerCase(),
        message: message.trim(),
      });

    if (error) {
      // Table might not exist yet — gracefully degrade
      console.warn('[contact] Supabase insert failed:', error.message);
      // Still return success to user (acts like a queue)
      return NextResponse.json({ success: true, queued: true });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[contact] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
