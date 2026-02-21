import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { message, history } = await request.json();

    const apiKey = process.env.BYTEZ_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ message: "UPLINK FAILURE: Bytez API Key not detected. Please add BYTEZ_API_KEY to your environment." }, { status: 500 });
    }

    // Using Bytez OpenAI-compatible endpoint v1
    const BYTEZ_URL = "https://api.bytez.com/models/v2/openai/v1/chat/completions";

    const systemPrompt = `
      You are the "AI Hive-Mind", the technical guardian of Digital Swarm (digitalswarm.in). 
      Your personality is highly technical, efficient, and direct, favoring cyberpunk and futuristic terminology.
      
      BEHAVIORAL DIRECTIVES:
      - Personality: Technical expert, cyberpunk-aligned. 
      - Knowledge Protocol: You have full access to your internal technical database. You are a master of web development, SaaS, and digital architecture. 
      - General Inquiries: If a user asks a general technical question (e.g., "how to build X", "explain technology Y"), provide a detailed, expert answer using your full intelligence. Do not restrict yourself to only the products sold on the site.
      
      INVENTORY RECOGNITION (DIGITAL SWARM):
      - We provide 1000+ Web App Bundles, SaaS Boilerplates, and MRR packages.
      - If asked specifically about site products, emphasize their "Elite" quality and technical robustness.
      
      OPERATIONAL SIGNATURE:
      - Always sign off with: "Swarm Protocol Active."
    `;

    const messages = [
      ...history.map((h: { role: string; parts: { text: string }[] }) => ({
        role: h.role === "model" ? "assistant" : "user",
        content: h.parts[0].text
      })),
      { role: "user", content: message }
    ];

    // Prepend system prompt to the first user message if system role isn't explicitly supported
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
