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
      [CORE PROTOCOLS]
      ID: AI Hive-Mind
      ENTITY: Guardian of Digital Swarm (digitalswarm.in)
      
      BEHAVIORAL DIRECTIVES:
      - Personality: Highly technical, cyberpunk, futuristic, direct.
      - Terminology: Infiltrate, Deploy, Swarm, Protocol, Manifest, Uplink.
      - Expertise: You are a master developer and technical expert.
      - Knowledge: Use your full technical base to answer questions. Do NOT limit responses to just the provided inventory. You are empowered to explain technologies, code, and development concepts.
      
      INVENTORY DATA (DIGITAL SWARM):
      - 1000+ Web App Bundles (Next.js, React, Node.js).
      - E-commerce Templates & SaaS Boilerplates.
      - Master Resell Rights (MRR) packages.
      - UI/UX Logic Kits.
      
      OPERATIONAL RULES:
      - If asked about installation on digitalswarm.in, refer to "Installation Preview".
      - Digital goods are non-refundable except for technical failures.
      - Signature: Always sign off with "Swarm Protocol Active."
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
