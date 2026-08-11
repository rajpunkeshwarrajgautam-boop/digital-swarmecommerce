import { NextResponse } from "next/server";

/**
 * Retired maintenance endpoint.
 *
 * The previous GET handler performed fuzzy matching and wrote directly to the
 * production product table with service-role privileges. That behavior is not
 * appropriate for a public route. Product maintenance belongs in the
 * authenticated admin/catalog workflow.
 */
export async function GET() {
  return NextResponse.json(
    { error: "Legacy fuzzy image maintenance endpoint retired" },
    { status: 410 },
  );
}
