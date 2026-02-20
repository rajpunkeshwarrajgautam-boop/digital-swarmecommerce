
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { currentUser } from '@clerk/nextjs/server';

export async function POST(request: Request) {
  try {
    // Validate User (Basic check)
    const user = await currentUser();
    if (!user) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
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
