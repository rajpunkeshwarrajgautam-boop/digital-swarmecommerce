import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { products as staticProducts } from '@/lib/data';
import { Product } from "@/lib/types";
import { GoogleGenerativeAI, Content } from "@google/generative-ai";
import { rateLimit } from "@/lib/rate-limit";

export const maxDuration = 60; // Allow sufficient time for cold-start 
export const runtime = "nodejs";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const limiter = rateLimit({
  interval: 60 * 1000, // 60 seconds
  uniqueTokenPerInterval: 500, // Max 500 users per interval
});

function detectPurchaseIntent(message: string, products: Array<{ id: string; name: string }>) {
  const text = message.toLowerCase();
  const wantsToBuy =
    text.includes("buy") ||
    text.includes("purchase") ||
    text.includes("order") ||
    text.includes("get this") ||
    text.includes("get me");

  if (!wantsToBuy) return null;

  const exactMatch = products.find((p) => {
    const idToken = p.id.toLowerCase().replace(/-/g, " ");
    const nameToken = p.name.toLowerCase();
    return text.includes(idToken) || text.includes(nameToken);
  });

  if (exactMatch) return exactMatch;

  const messageTokens = new Set(normalizeName(message).split(" ").filter(Boolean));
  let best: { id: string; name: string } | null = null;
  let bestScore = 0;
  for (const p of products) {
    const productTokens = new Set(
      `${normalizeName(p.name)} ${p.id.replace(/-/g, " ")}`
        .split(" ")
        .filter(Boolean)
    );
    let overlap = 0;
    for (const t of productTokens) if (messageTokens.has(t)) overlap += 1;
    const score = overlap / Math.max(1, productTokens.size);
    if (overlap >= 2 && score > bestScore) {
      best = p;
      bestScore = score;
    }
  }

  return best;
}

function normalizeName(value: string) {
  return value
    .toLowerCase()
    .replace(/\([^)]*\)/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export async function POST(request: Request) {
  try {
    // --- RATE LIMITING ---
    const ip = request.headers.get("x-forwarded-for") || "anonymous";
    try {
      await limiter.check(10, ip); // 10 requests per minute per IP
    } catch {
      return NextResponse.json({ 
        message: "RATE LIMIT EXCEEDED: The swarm is cooling down. Try again in 60 seconds." 
      }, { status: 429 });
    }

    const { message, history = [] } = await request.json();

    const apiKey = process.env.NVIDIA_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ message: "UPLINK FAILURE: NVIDIA API Key not detected." }, { status: 500 });
    }

    // --- LIVE DATA FETCHING ---
    // ... (rest of the data fetching logic remains same)

    // Map history for OpenAI/NVIDIA format
    const messages = [
      { role: "system", content: systemPrompt },
      ...history.map((h: any) => ({
        role: h.role === "model" || h.role === "assistant" ? "assistant" : "user",
        content: h.parts?.[0]?.text || h.text || ""
      })),
      { role: "user", content: message }
    ];

    try {
      const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "meta/llama-3.1-70b-instruct",
          messages: messages,
          max_tokens: 1024,
          temperature: 0.7,
          top_p: 1,
          stream: false
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("NVIDIA API Error:", errorData);
        throw new Error("NVIDIA Uplink Failure");
      }

      const result = await response.json();
      const aiMessage = result.choices[0].message.content;
      return NextResponse.json({ message: aiMessage });
    } catch (aiError) {
      console.error("Chat model invocation failed:", aiError);
      return NextResponse.json({
        message:
          "Uplink interference detected. I can still assist with direct checkout commands - tell me which product to buy.",
      });
    }

  } catch (error) {
    console.error("Chat Error:", error);
    return NextResponse.json({ message: "HIVE-MIND CRITICAL ERROR: Connection lost." }, { status: 500 });
  }
}
