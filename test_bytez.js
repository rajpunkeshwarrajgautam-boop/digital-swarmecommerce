require('dotenv').config();

async function test() {
  const apiKey = process.env.BYTEZ_API_KEY;
  console.log("Key:", apiKey ? "EXISTS" : "MISSING");
  
  try {
    const res = await fetch("https://api.bytez.com/models/v2/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "unsloth/gemma-2b-it",
        messages: [{ role: "user", content: "hello" }]
      })
    });
    
    console.log("Status:", res.status);
    const data = await res.json();
    console.log("Data:", data);
  } catch (e) {
    console.error("Error:", e);
  }
}

test();
