require('dotenv').config();

async function test() {
  const apiKey = process.env.BYTEZ_API_KEY;
  
  try {
    const res = await fetch("https://api.bytez.com/models/v2/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "meta-llama/Meta-Llama-3-8B-Instruct",
        messages: [{ role: "system", content: "You are Zero, you sell agents." }, { role: "user", content: "What do you sell?" }]
      })
    });
    
    console.log("Status:", res.status);
    const data = await res.json();
    console.log("Data:", data.choices?.[0]?.message?.content || data);
  } catch (e) {
    console.error("Error:", e);
  }
}

test();
