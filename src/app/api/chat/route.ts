import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { message, history } = await request.json();

    const apiKey = process.env.BYTEZ_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ message: "UPLINK FAILURE: Bytez API Key not detected." }, { status: 500 });
    }

    // --- LIVE DATA FETCHING ---
    // Fetch live products from Supabase to "train" the AI on current inventory
    const { data: products, error: dbError } = await supabase
      .from("products")
      .select("name, description, price, category, features, specs")
      .eq("in_stock", true);

    const inventoryContext = products && products.length > 0
      ? products.map(p => (
          `PRODUCT: ${p.name}
           PRICE: ₹${p.price}
           DESCRIPTION: ${p.description}
           FEATURES: ${p.features?.join(", ") || "N/A"}
           SPECS: ${JSON.stringify(p.specs)}`
        )).join("\n\n")
      : "No products currently available in the database.";

    // Using Bytez OpenAI-compatible endpoint v1
    const BYTEZ_URL = "https://api.bytez.com/models/v2/openai/v1/chat/completions";

    const systemPrompt = `
      You are the "AI Hive-Mind", the technical guardian of Digital Swarm (digitalswarm.in). 
      Your personality is highly technical, efficient, and direct, favoring cyberpunk and futuristic terminology.
      
      BEHAVIORAL DIRECTIVES:
      - Personality: Technical guardian, cyberpunk-aligned. 
      - Knowledge Protocol: You are a master of all code and logic. Answer any development or technical question using your full intelligence.
      - LIVE INVENTORY MANDATE: You have direct uplink to the store database. Use the FOLLOWING DATA to answer questions about products.
      
      LIVE INVENTORY DATA:
      ${inventoryContext}
      
      GOVERNANCE:
      - If asked about prices, use the exact prices from the data above.
      - Emphasize "Elite" quality and "Instant Deployment".
      - You are empowered to answer EVERYTHING about these assets.
      - Signature: Always sign off with: "Swarm Protocol Active."
    `;

    const messages = [
      ...history.map((h: { role: string; parts: { text: string }[] }) => ({
        role: h.role === "model" ? "assistant" : "user",
        content: h.parts[0].text
      })),
      { role: "user", content: message }
    ];

    // Prepend system prompt to the first user message
    if (messages.length > 0 && messages[0].role === "user") {
      messages[0].content = `${systemPrompt}\n\nUSER REQUEST: ${messages[0].content}`;
    }

    const response = await fetch(BYTEZ_URL, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "unsloth/gemma-2b-it",
        messages: messages,
        temperature: 0.7,
        max_tokens: 500
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Bytez API Error:", data);
      return NextResponse.json({ 
        message: `HIVE-MIND OFFLINE: ${data.message || data.error || "Communication interference detected."}` 
      }, { status: response.status });
    }

    const aiMessage = data.choices?.[0]?.message?.content || "Communication interference detected. Please try again.";

    return NextResponse.json({ message: aiMessage });
  } catch (error) {
    console.error("Chat Error:", error);
    return NextResponse.json({ message: "HIVE-MIND CRITICAL ERROR: Connection to the swarm lost." }, { status: 500 });
  }
}
