import urllib.request
import json
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

req = urllib.request.Request('https://api.clerk.com/v1/domains')
req.add_header('Authorization', 'Bearer sk_live_4QqIgBi5j3OL165nea5CI8zKFbuY6jFBQ5FaHLqixl')

try:
    response = urllib.request.urlopen(req, context=ctx)
    data = json.loads(response.read().decode())
    print(json.dumps(data, indent=2))
except urllib.error.URLError as e:
    print(e)
