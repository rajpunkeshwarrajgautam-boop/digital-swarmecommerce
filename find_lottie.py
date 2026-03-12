import re
import json

try:
    with open("lottie_page.html", "r", encoding="utf-8") as f:
        content = f.read()

    # Look for the animation URL in scripts
    json_urls = re.findall(r"https?://[^\s\"" "]+\.json", content)
    lottie_urls = re.findall(r"https?://[^\s\"" "]+\.lottie", content)

    print("JSON URLs found:", json_urls)
    print("Lottie URLs found:", lottie_urls)

except Exception as e:
    print(f"Error: {e}")
