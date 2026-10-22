// Renders one 1200x630 Open Graph image per service page into public/og/services/<slug>.png.
// Run: node scripts/og-services.mjs   (needs Chrome at $CHROME or /usr/bin/google-chrome)
import { readFileSync, writeFileSync, mkdirSync, mkdtempSync } from "node:fs";
import { join, dirname } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath, pathToFileURL } from "node:url";
import ts from "typescript";
import { chromium } from "playwright-core";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const tmp = mkdtempSync(join(tmpdir(), "og-"));
for (const f of ["site", "services"]) {
  const src = readFileSync(join(root, "src/lib", `${f}.ts`), "utf8");
  const js = ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
  writeFileSync(join(tmp, `${f}.mjs`), js.replace(/from "\.\/site"/g, 'from "./site.mjs"'));
}
const { offers } = await import(pathToFileURL(join(tmp, "site.mjs")).href);
const { services } = await import(pathToFileURL(join(tmp, "services.mjs")).href);

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const priceLabel = (o) => `$${o.price}${o.unit ?? ""}`;

const html = (s) => {
  const o = offers.find((x) => x.id === s.offer);
  const size = s.h1.length > 70 ? 58 : s.h1.length > 55 ? 64 : 72;
  // Long slugs: shrink the footer URL line so it stays on one line.
  const urlSize = s.slug.length > 30 ? 19 : 22;
  return `<!doctype html><html><head><meta charset="utf-8"><style>
*{margin:0;box-sizing:border-box}body{width:1200px;height:630px;background:#0E0E12;color:#FAFAF7;font-family:Inter,"Helvetica Neue",Arial,sans-serif;position:relative;overflow:hidden}
.glow{position:absolute;right:-160px;top:-160px;width:620px;height:620px;border-radius:50%;background:#FF5A1F;opacity:.35;filter:blur(80px)}
.wrap{position:absolute;left:80px;top:64px;right:110px}
.brand{display:flex;align-items:center;gap:16px;font-weight:800;font-size:28px}
.eyebrow{margin-top:52px;font-size:26px;font-weight:700;color:#FF5A1F;text-transform:uppercase;letter-spacing:2px}
h1{margin-top:18px;font-size:${size}px;line-height:1.05;font-weight:900;letter-spacing:-2px}
.chips{position:absolute;left:80px;bottom:110px;display:flex;gap:14px}
.chip{border:2px solid rgba(250,250,247,.2);border-radius:999px;padding:12px 22px;font-size:24px;font-weight:600}
.chip b{color:#FFD84D}
.url{position:absolute;left:80px;bottom:50px;font-size:${urlSize}px;opacity:.6;white-space:nowrap}
</style></head><body><div class="glow"></div><div class="wrap">
<div class="brand"><svg width="52" height="52" viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="#1d1d24"/><path d="M14 40 L32 14 L50 40 Z" fill="#FF5A1F"/><rect x="12" y="44" width="40" height="7" rx="3.5" fill="#FAFAF7"/></svg>Shipday Studio</div>
<div class="eyebrow">${esc(s.eyebrow)}</div>
<h1>${esc(s.h1)}</h1></div>
<div class="chips"><div class="chip">${esc(o.name)} <b>${priceLabel(o)}</b></div><div class="chip">Delivered in <b>${esc(o.turnaround)}</b></div><div class="chip">Fixed price · no calls</div></div>
<div class="url">shipdaystudio.com/services/${s.slug}/ · remote, clients worldwide, any industry</div></body></html>`;
};

const outDir = join(root, "public/og/services");
mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROME ?? "/usr/bin/google-chrome" });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
for (const s of services) {
  await page.setContent(html(s), { waitUntil: "load" });
  const overflow = await page.evaluate(() => {
    const h = document.querySelector("h1").getBoundingClientRect();
    const c = document.querySelector(".chips").getBoundingClientRect();
    return h.bottom > c.top - 20;
  });
  if (overflow) console.warn(`WARN ${s.slug}: headline overlaps the chips`);
  await page.screenshot({ path: join(outDir, `${s.slug}.png`) });
  console.log("og", s.slug);
}
await browser.close();
