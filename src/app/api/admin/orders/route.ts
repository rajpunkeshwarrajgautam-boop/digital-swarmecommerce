
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { currentUser } from '@clerk/nextjs/server';

export async function GET() {
  try {
    // Admin check
    const user = await currentUser();
    const adminEmail = process.env.ADMIN_EMAIL;
    const userEmail = user?.emailAddresses[0]?.emailAddress;

    if (!user || !adminEmail || userEmail !== adminEmail) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    if (!supabaseAdmin) {
        return NextResponse.json({ error: 'Database service unavailable' }, { status: 500 });
    }

    // Fetch orders with items and product names
    const { data, error } = await supabaseAdmin
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          products (name)
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Admin orders fetch error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
