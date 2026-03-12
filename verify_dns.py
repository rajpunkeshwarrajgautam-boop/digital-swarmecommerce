import subprocess

domains = [
    "clerk.digitalswarm.in",
    "accounts.digitalswarm.in",
    "clkmail.digitalswarm.in",
    "clk._domainkey.digitalswarm.in",
    "clk2._domainkey.digitalswarm.in",
]

print("--- DNS VERIFICATION ---")
for domain in domains:
    result = subprocess.run(["nslookup", domain], capture_output=True, text=True)
    if "canonical name" in result.stdout.lower() or "answer" in result.stdout.lower():
        print(f"[OK] {domain}")
        # Extract the line containing the record
        lines = result.stdout.splitlines()
        for line in lines:
            if (
                "name:" in line.lower()
                or "aliases:" in line.lower()
                or "canonical" in line.lower()
            ):
                print(f"     {line.strip()}")
    else:
        print(f"[FAIL] {domain}")
print("--- END ---")
