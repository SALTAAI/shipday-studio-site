// Renders avatar.png and banner.png from the HTML sources with headless Chrome.
// Usage (from repo root): node brand/x-profile/src/render.mjs
import { chromium } from "playwright-core";
const dir = new URL("./", import.meta.url).pathname;
const out = new URL("../", import.meta.url).pathname;
const browser = await chromium.launch({ executablePath: process.env.CHROME ?? "/usr/bin/google-chrome", headless: true, args: ["--no-sandbox", "--disable-gpu"] });
for (const [name, w, h] of [["avatar", 400, 400], ["banner", 1500, 500]]) {
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  await page.goto("file://" + dir + name + ".html");
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: out + name + ".png" });
  const box = await page.evaluate(() => { const r = document.querySelector(".wrap")?.getBoundingClientRect(); return r && { l: r.left, t: r.top, r: r.right, b: r.bottom }; });
  console.log("saved", name, box ? JSON.stringify(box) : "");
  await page.close();
}
await browser.close();
