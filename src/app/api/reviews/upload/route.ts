import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/**
 * Server-side review image upload route.
 * Uses the service role key to bypass RLS — images are validated on the server
 * before being stored, then the public URL is returned to the client.
 * 
 * Security: File type and size are validated. No user-controlled paths.
 */

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const BUCKET = "review-media";

// Service role client bypasses RLS for storage operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // --- VALIDATION ---
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Allowed: JPEG, PNG, WebP, GIF" },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File too large. Maximum size: 5MB" },
        { status: 400 }
      );
    }

    // --- SANITIZE FILENAME ---
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const safeFileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;

    // --- UPLOAD TO SUPABASE STORAGE ---
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { data, error } = await supabaseAdmin.storage
      .from(BUCKET)
      .upload(safeFileName, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error("[Review Upload] Supabase storage error:", error);
      return NextResponse.json(
        { error: "Upload failed. Please try again." },
        { status: 500 }
      );
    }

    // --- GET PUBLIC URL ---
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from(BUCKET)
      .getPublicUrl(data.path);

    return NextResponse.json({ url: publicUrl });
  } catch (error) {
    console.error("[Review Upload] Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
