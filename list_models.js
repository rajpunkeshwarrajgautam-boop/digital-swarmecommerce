require('dotenv').config();

async function listModels() {
  const apiKey = process.env.BYTEZ_API_KEY;
  try {
    const res = await fetch("https://api.bytez.com/models/v2/list", {
      headers: { "Authorization": `Bearer ${apiKey}` }
    });
    const data = await res.json();
    console.log("Models:", data.slice ? data.slice(0, 5) : data);
  } catch (e) {
    console.error(e);
  }
}
listModels();
