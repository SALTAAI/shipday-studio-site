// Crawl the locally served export and report internal links/assets that don't return 200,
// plus the target/rel of every external link. Usage: BASE=http://localhost:4310 node scripts/check-links.mjs
const BASE = process.env.BASE ?? "http://localhost:4310";
const seen = new Map(); const queue = ["/", "/sitemap.xml", "/robots.txt", "/site.webmanifest", "/this-page-does-not-exist/"]; const external = new Map(); let bad = 0;
while (queue.length) {
  const path = queue.shift(); if (seen.has(path)) continue;
  const res = await fetch(BASE + path, { redirect: "manual" }); seen.set(path, res.status);
  const expect404 = path === "/this-page-does-not-exist/";
  if ((res.status !== 200 && !expect404) || (expect404 && res.status !== 404)) { bad++; console.log("BAD", res.status, path, res.headers.get("location") ?? ""); }
  if (!(res.headers.get("content-type") ?? "").includes("html")) continue;
  const html = await res.text();
  for (const m of html.matchAll(/<a\b[^>]*>/g)) {
    const tag = m[0]; const href = tag.match(/href="([^"]*)"/)?.[1]; if (!href) continue;
    if (/^(https?:)?\/\//.test(href)) { const k = `${href} target=${tag.match(/target="([^"]*)"/)?.[1] ?? "-"} rel=${tag.match(/rel="([^"]*)"/)?.[1] ?? "-"}`; external.set(k, (external.get(k) ?? 0) + 1); continue; }
    if (href.startsWith("mailto:")) { external.set(href.split("?")[0], (external.get(href.split("?")[0]) ?? 0) + 1); continue; }
    const u = new URL(href.replace(/&amp;/g, "&"), BASE + path); if (u.hash && u.pathname === "/") { const id = u.hash.slice(1); if (path === "/" && !html.includes(`id="${id}"`)) { bad++; console.log("BAD anchor", href, "on", path); } }
    queue.push(u.pathname);
  }
  for (const m of html.matchAll(/(?:src|href)="(\/[^"]*)"/g)) { const u = new URL(m[1].replace(/&amp;/g, "&"), BASE); queue.push(u.pathname); }
}
console.log(`checked ${seen.size} internal URLs, ${bad} problems`);
console.log("external + mailto links (count):"); for (const [k, v] of external) console.log(" ", v, k);
process.exit(bad ? 1 : 0);
