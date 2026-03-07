async function testApi() {
  try {
    const res = await fetch("https://digitalswarm.in/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "hello", history: [] })
    });
    console.log("Status:", res.status);
    const data = await res.text();
    console.log("Response:", data);
  } catch(e) {
    console.error("Fetch error", e);
  }
}
testApi();
