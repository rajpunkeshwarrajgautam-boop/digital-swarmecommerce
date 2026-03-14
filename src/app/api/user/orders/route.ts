import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { currentUser } from "@clerk/nextjs/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    const user = await currentUser();
    
    if (!user || (!user.primaryEmailAddress && !user.emailAddresses[0])) {
      return NextResponse.json({ error: "Unauthorized or missing email" }, { status: 401 });
    }

    const email = user.primaryEmailAddress?.emailAddress || user.emailAddresses[0]?.emailAddress;

    // Fetch orders with their items from Supabase
    const { data: dbOrders, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('customer_email', email)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("[SUPABASE ERROR] Failed to fetch orders:", error);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    return NextResponse.json(dbOrders || []);

  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
