import re

with open("lottie_page.html", "r", encoding="utf-8") as f:
    content = f.read()

# Regular expressions for Lottie/JSON URLs
json_pattern = r"https?://[^\s\"" "]+\.json"
lottie_pattern = r"https?://[^\s\"" "]+\.lottie"

json_links = re.findall(json_pattern, content)
lottie_links = re.findall(lottie_pattern, content)

# Narrow down to likely candidates (assets, lottie.host, etc.)
candidates = [l for l in (json_links + lottie_links) if "assets" in l or "lottie" in l]

with open("extracted_links.txt", "w") as f:
    for link in set(candidates):
        f.write(link + "\n")
