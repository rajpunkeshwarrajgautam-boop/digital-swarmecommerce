const base = "https://digitalswarm.in";

async function main() {
  const xml = await (await fetch(`${base}/sitemap.xml`)).text();
  const pageUrls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);

  const internal = new Set();
  for (const url of pageUrls) {
    try {
      const html = await (await fetch(url)).text();
      const hrefs = [...html.matchAll(/href=\"([^\"]+)\"/g)].map((m) => m[1]);
      for (const href of hrefs) {
        if (href.startsWith("/")) internal.add(`${base}${href}`);
        else if (href.startsWith(base)) internal.add(href);
      }
    } catch {}
  }

  const skip = ["/api/", "/sign-in", "/sign-up", "mailto:", "tel:"];
  const links = [...internal].filter((u) => !skip.some((s) => u.includes(s)));

  const bad = [];
  for (const url of links) {
    try {
      const res = await fetch(url, { redirect: "follow" });
      if (res.status >= 400) bad.push([url, res.status]);
    } catch {
      bad.push([url, "ERR"]);
    }
  }

  console.log(JSON.stringify({ pagesScanned: pageUrls.length, linksChecked: links.length, bad }, null, 2));
}

main();
