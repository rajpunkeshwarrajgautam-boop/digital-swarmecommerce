"use server";

import { supabaseAdmin } from "@/lib/supabase";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

// 🚨 ADMIN WHITELIST 🚨
const MASTER_ADMIN_EMAILS = [
  "admin@digitalswarm.in",
  "rajpunkeshwarrajgautam@gmail.com",
  "test@example.com"
];

async function verifyAdmin() {
  const user = await currentUser();
  const primaryEmail = user?.emailAddresses[0]?.emailAddress;
  
  if (!primaryEmail || !MASTER_ADMIN_EMAILS.includes(primaryEmail.toLowerCase())) {
    throw new Error("UNAUTHORIZED_ACCESS_DENIED");
  }
}

/**
 * PRODUCT MANAGEMENT PROTOCOLS
 */
export async function getAdminProducts() {
  await verifyAdmin();
  const { data, error } = await supabaseAdmin!
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });
    
  if (error) throw error;
  return data;
}

export interface ProductInput {
  name: string;
  description: string;
  price: number;
  image: string;
  category?: string;
  stock?: number;
  is_visible?: boolean;
}

export async function createAdminProduct(data: ProductInput) {
  await verifyAdmin();
  const { error } = await supabaseAdmin!
    .from("products")
    .insert(data);
    
  if (error) throw error;
  revalidatePath("/admin/products");
  revalidatePath("/");
  return { success: true };
}

export async function updateAdminProduct(id: string, data: Partial<ProductInput>) {
  await verifyAdmin();
  const { error } = await supabaseAdmin!
    .from("products")
    .update(data)
    .eq("id", id);
    
  if (error) throw error;
  revalidatePath("/admin/products");
  revalidatePath("/");
  return { success: true };
}

export async function deleteAdminProduct(id: string) {
  await verifyAdmin();
  const { error } = await supabaseAdmin!
    .from("products")
    .delete()
    .eq("id", id);
    
  if (error) throw error;
  revalidatePath("/admin/products");
  revalidatePath("/");
  return { success: true };
}

/**
 * LOGISTICS AUDIT PROTOCOLS
 */
export async function getAdminOrders() {
  await verifyAdmin();
  const { data, error } = await supabaseAdmin!
    .from("orders")
    .select(`
      *,
      order_items (
        price,
        quantity,
        products (name)
      )
    `)
    .order("created_at", { ascending: false });
    
  if (error) throw error;
  return data;
}

/**
 * TELEMETRY AGGREGATION
 */
export async function getAdminStats() {
  await verifyAdmin();
  
  const [
    { data: orders },
    { count: leads },
    { count: affiliates },
    { data: recentCarts },
    { data: recentAffiliates }
  ] = await Promise.all([
    supabaseAdmin!.from("orders").select("total, status").eq("status", "paid"),
    supabaseAdmin!.from("leads").select("*", { count: "exact", head: true }),
    supabaseAdmin!.from("affiliates").select("*", { count: "exact", head: true }),
    supabaseAdmin!.from("abandoned_carts").select("email, created_at, recovered").order("created_at", { ascending: false }).limit(5),
    supabaseAdmin!.from("affiliates").select("id, user_id, total_earnings").order("created_at", { ascending: false }).limit(5)
  ]);

  const grossVolume = orders?.reduce((acc, curr) => acc + (curr.total || 0), 0) || 0;
  const mrr = grossVolume * 0.15; 

  return {
    grossVolume,
    mrr,
    leadsCount: leads || 0,
    affiliatesCount: affiliates || 0,
    recentCarts: recentCarts || [],
    recentAffiliates: recentAffiliates || []
  };
}
