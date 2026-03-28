
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { currentUser } from '@clerk/nextjs/server';

export async function POST(request: Request) {
  try {
    // Validate User (Admin check)
    const user = await currentUser();
    const adminEmail = process.env.ADMIN_EMAIL;
    const userEmail = user?.emailAddresses[0]?.emailAddress;

    if (!user || !adminEmail || userEmail !== adminEmail) {
        return NextResponse.json({ message: 'Unauthorized: Admin access required' }, { status: 401 });
    }

    const body = await request.json();
    
    if (!supabaseAdmin) {
      return NextResponse.json({ message: 'Database service unavailable' }, { status: 500 });
    }

    // Use Admin Client to bypass RLS for insert
    const { data, error } = await supabaseAdmin
      .from('products')
      .insert(body)
      .select()
      .single();

    if (error) {
      console.error('Create product error:', error);
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, product: data });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
