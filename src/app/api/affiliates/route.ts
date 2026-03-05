import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { name, email, link } = await request.json();

    if (!name || !email || !link) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { error } = await supabase
      .from('affiliates')
      .insert({
        name,
        email,
        audience_link: link,
        status: 'pending'
      });

    if (error) {
       console.error("Supabase affiliate insert error:", error);
       if (error.code === '23505') {
         return NextResponse.json({ error: "Email already registered for affiliate program." }, { status: 409 });
       }
       throw error;
    }

    return NextResponse.json({ success: true, message: "Application submitted successfully." });

  } catch (error) {
    console.error("Affiliate submission error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
