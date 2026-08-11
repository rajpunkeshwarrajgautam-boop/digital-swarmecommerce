import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  try {
    const user = await currentUser();
    if (!user || (!user.primaryEmailAddress && !user.emailAddresses[0])) {
      return NextResponse.json({ error: "Unauthorized or missing email" }, { status: 401 });
    }
    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Database service unavailable" }, { status: 503 });
    }

    const email = (user.primaryEmailAddress?.emailAddress || user.emailAddresses[0]!.emailAddress)
      .trim()
      .toLowerCase();

    const { data: dbOrders, error } = await supabaseAdmin
      .from('orders')
      .select('id,created_at,status,total_amount,cashfree_order_id,order_items(price,quantity,products(name))')
      .eq('customer_email', email)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("[orders] Failed to fetch orders:", error);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    return NextResponse.json(dbOrders || []);
  } catch (error) {
    console.error("[orders] Unexpected failure:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
