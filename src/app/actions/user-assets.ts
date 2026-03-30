"use server";

import { currentUser } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function getUserAssets() {
  try {
    const user = await currentUser();
    if (!user || user.emailAddresses.length === 0) {
      return { success: false, error: "Unauthorized" };
    }

    const email = user.emailAddresses[0].emailAddress;

    // Fetch licenses with product details
    if (!supabaseAdmin) throw new Error("Database not available");

    const { data: licenses, error } = await supabaseAdmin
      .from("customer_licenses")
      .select(`
        id, 
        created_at, 
        license_key, 
        status,
        product_id,
        products:product_id (
          name, 
          image, 
          download_url, 
          install_guide,
          version
        )
      `)
      .eq("user_email", email)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[getUserAssets] Supabase Query Error:", error);
      return { success: false, error: "Database error" };
    }

    return { success: true, assets: licenses || [] };
  } catch (err) {
    console.error("[getUserAssets] Server Action Error:", err);
    return { success: false, error: "Internal error" };
  }
}

export async function getUserOrders() {
  try {
    const user = await currentUser();
    if (!user || user.emailAddresses.length === 0) {
      return { success: false, error: "Unauthorized" };
    }

    const email = user.emailAddresses[0].emailAddress;

    if (!supabaseAdmin) throw new Error("Database not available");

    const { data: orders, error } = await supabaseAdmin
      .from("orders")
      .select(`
        id, 
        created_at, 
        status, 
        total_amount,
        cashfree_order_id,
        order_items (
          price,
          quantity,
          products (name)
        )
      `)
      .eq("customer_email", email)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[getUserOrders] Supabase Query Error:", error);
      return { success: false, error: "Database error" };
    }

    return { success: true, orders: orders || [] };
  } catch (err) {
    console.error("[getUserOrders] Server Action Error:", err);
    return { success: false, error: "Internal error" };
  }
}
