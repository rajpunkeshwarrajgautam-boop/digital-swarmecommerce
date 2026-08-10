import { NextResponse } from "next/server";

/**
 * Retired maintenance endpoint.
 *
 * The previous GET handler mutated the production product table with a
 * service-role client and did not require authentication. Catalog image
 * changes now go through the authenticated admin/catalog workflow instead.
 */
export async function GET() {
  return NextResponse.json(
    { error: "Legacy product image maintenance endpoint retired" },
    { status: 410 },
  );
}
