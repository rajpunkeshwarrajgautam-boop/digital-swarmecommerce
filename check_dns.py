import socket

domains = [
    "clerk.digitalswarm.in",
    "accounts.digitalswarm.in",
    "clkmail.digitalswarm.in",
    "clk._domainkey.digitalswarm.in",
    "clk2._domainkey.digitalswarm.in",
]

for domain in domains:
    try:
        addr = socket.gethostbyname(domain)
        print(f"{domain} -> RESOLVED to {addr}")
    except socket.gaierror:
        print(f"{domain} -> FAILED TO RESOLVE")
