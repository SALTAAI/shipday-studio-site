// Submit every URL in the live sitemap to IndexNow (Bing, Yandex, Seznam, Naver...). No sign-in needed.
// Usage: node scripts/indexnow.mjs   (env: SITE, default https://shipdaystudio.com)
// The key file public/<key>.txt must already be live at SITE/<key>.txt.
import { readdirSync } from "node:fs";
const SITE = process.env.SITE ?? "https://shipdaystudio.com";
const keyFile = readdirSync(new URL("../public/", import.meta.url)).find((f) => /^[a-f0-9]{32}\.txt$/.test(f));
if (!keyFile) throw new Error("no IndexNow key file in public/");
const key = keyFile.replace(/\.txt$/, "");
const live = await fetch(`${SITE}/${keyFile}`);
if (!live.ok || (await live.text()).trim() !== key) throw new Error(`key file not live at ${SITE}/${keyFile} (HTTP ${live.status})`);
const xml = await (await fetch(`${SITE}/sitemap.xml`)).text();
const urlList = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
const body = { host: new URL(SITE).host, key, keyLocation: `${SITE}/${keyFile}`, urlList };
const res = await fetch("https://api.indexnow.org/indexnow", { method: "POST", headers: { "Content-Type": "application/json; charset=utf-8" }, body: JSON.stringify(body) });
console.log(JSON.stringify({ at: new Date().toISOString(), status: res.status, statusText: res.statusText, submitted: urlList.length, body: (await res.text()).slice(0, 300) }));
