// Full-page screenshots of the static export, served locally.
// Usage: npm run build && node scripts/serve-out.mjs out 4310 & BASE=http://localhost:4310 node scripts/screens.mjs
// Env: BASE (default http://localhost:4310), OUT (default ./screens), PAGES (comma list of name=path), CHROME.
import { chromium } from "playwright-core";
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";

const BASE = process.env.BASE ?? "http://localhost:4310";
const OUT = resolve(process.env.OUT ?? new URL("../screens/", import.meta.url).pathname);
mkdirSync(OUT, { recursive: true });

const pages = process.env.PAGES
  ? process.env.PAGES.split(",").map((p) => p.split("="))
  : [["home", "/"], ["order", "/order/"], ["terms", "/terms/"], ["privacy", "/privacy/"], ["imprint", "/imprint/"], ["work", "/work/quillbyte/"], ["404", "/this-page-does-not-exist/"]];
const viewports = [["desktop", { width: 1440, height: 900 }, 1], ["mobile", { width: 390, height: 844 }, 2]];

const browser = await chromium.launch({
  executablePath: process.env.CHROME ?? "/usr/bin/google-chrome",
  headless: true,
  args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"],
});
try {
  for (const [vpName, viewport, dpr] of viewports) {
    const ctx = await browser.newContext({ viewport, deviceScaleFactor: dpr, isMobile: vpName === "mobile", hasTouch: vpName === "mobile" });
    const page = await ctx.newPage();
    for (const [name, path] of pages) {
      await page.goto(BASE + path, { waitUntil: "networkidle" });
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo({ top: y, behavior: "instant" }); await new Promise((r) => setTimeout(r, 60)); }
        window.scrollTo({ top: 0, behavior: "instant" });
      });
      // Lazy images in hidden gallery tabs never fire load, so cap the wait instead of hanging.
      await page.evaluate(() => Promise.race([Promise.all([...document.images].map((i) => (i.complete ? 0 : new Promise((r) => { i.onload = i.onerror = r; })))), new Promise((r) => setTimeout(r, 4000))]));
      await page.waitForTimeout(300);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      const file = `${OUT}/${name}-${vpName}.png`;
      await page.screenshot({ path: file, fullPage: true });
      console.log("saved", file, overflow > 0 ? `HORIZONTAL OVERFLOW ${overflow}px` : "");
    }
    await ctx.close();
  }
} finally {
  await browser.close();
}
