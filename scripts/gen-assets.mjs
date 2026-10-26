// Generates original sample-work SVGs for fictional brands. No dependencies.
// Usage: node scripts/gen-assets.mjs
// Writes to samples/site-masters/legacy-svg/ (gitignored, private). Never write SVG samples into public/:
// the site repo is public and samples there must be protect.py previews (RULES.md, "Samples and watermarks").
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = new URL("../samples/site-masters/legacy-svg/", import.meta.url).pathname;
const out = (p, s) => { mkdirSync(join(root, p, ".."), { recursive: true }); writeFileSync(join(root, p), s.trim() + "\n"); };
const FONT = `font-family="Inter, 'Helvetica Neue', Arial, sans-serif"`;
const SERIF = `font-family="Georgia, 'Times New Roman', serif"`;
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");

// ---------- Landing pages (1200 x 2200) ----------
function browser(inner, bg) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 2200" width="1200" height="2200" ${FONT}>
<rect width="1200" height="2200" fill="${bg}"/>
${inner}
</svg>`;
}
const lines = (x, y, w, n, color, gap = 22, h = 10) =>
  Array.from({ length: n }, (_, i) => `<rect x="${x}" y="${y + i * gap}" width="${i === n - 1 ? w * 0.6 : w}" height="${h}" rx="5" fill="${color}"/>`).join("");

function northdrift() {
  const [sand, clay, ink, sage] = ["#F4EDE4", "#C8734A", "#2E2A26", "#9DB4A0"];
  const pot = (cx, cy, s, c) => `<g transform="translate(${cx} ${cy}) scale(${s})"><path d="M-60 -90 Q-70 -60 -90 -20 Q-110 40 -70 90 L70 90 Q110 40 90 -20 Q70 -60 60 -90 Z" fill="${c}"/><rect x="-66" y="-100" width="132" height="14" rx="7" fill="${c}" opacity=".85"/><path d="M-95 10 Q0 30 95 10" stroke="${sand}" stroke-width="5" fill="none" opacity=".5"/></g>`;
  return browser(`
<rect x="0" y="0" width="1200" height="90" fill="${sand}"/>
<text x="80" y="56" ${SERIF} font-size="26" fill="${ink}" font-weight="700">Northdrift</text>
<text x="760" y="55" font-size="16" fill="${ink}">Collection   Process   Studio</text>
<rect x="1010" y="30" width="120" height="38" rx="19" fill="${ink}"/><text x="1070" y="55" font-size="15" fill="${sand}" text-anchor="middle">Waitlist</text>
<text x="80" y="250" ${SERIF} font-size="74" fill="${ink}">Slow-made</text>
<text x="80" y="335" ${SERIF} font-size="74" fill="${ink}">for everyday</text>
<text x="80" y="420" ${SERIF} font-size="74" fill="${clay}" font-style="italic">rituals.</text>
<text x="80" y="490" font-size="21" fill="${ink}" opacity=".75">Spring collection · 40 pieces · thrown by hand in Bergen</text>
<rect x="80" y="540" width="230" height="58" rx="29" fill="${clay}"/><text x="195" y="576" font-size="18" fill="#fff" text-anchor="middle" font-weight="600">Join the waitlist</text>
<text x="340" y="576" font-size="18" fill="${ink}" text-decoration="underline">See the pieces →</text>
<rect x="660" y="160" width="460" height="520" rx="28" fill="#EADFD1"/>
<circle cx="890" cy="430" r="190" fill="${sage}" opacity=".35"/>
${pot(820, 470, 1.15, clay)}${pot(990, 520, .8, ink)}
<rect x="0" y="760" width="1200" height="2" fill="${ink}" opacity=".1"/>
<text x="80" y="850" font-size="15" fill="${clay}" letter-spacing="3" font-weight="700">THE PROCESS</text>
${["Throw", "Glaze", "Fire"].map((t, i) => `<g transform="translate(${80 + i * 360} 890)"><rect width="320" height="260" rx="22" fill="#fff"/><circle cx="50" cy="60" r="26" fill="${[clay, sage, ink][i]}"/><text x="40" y="68" font-size="22" fill="#fff" font-weight="700">${i + 1}</text><text x="30" y="140" ${SERIF} font-size="34" fill="${ink}">${t}</text>${lines(30, 170, 250, 3, "#E2D7C9")}</g>`).join("")}
<text x="80" y="1270" font-size="15" fill="${clay}" letter-spacing="3" font-weight="700">THE COLLECTION</text>
<text x="80" y="1330" ${SERIF} font-size="48" fill="${ink}">Forty pieces, no two alike.</text>
${[0, 1, 2, 3].map((i) => `<g transform="translate(${80 + i * 265} 1380)"><rect width="240" height="300" rx="20" fill="${["#EADFD1", "#DCE5DD", "#E9D3C4", "#E4E0DA"][i]}"/>${pot(120, 160, .75, [clay, sage, ink, clay][i])}<text x="0" y="335" font-size="18" fill="${ink}" font-weight="600">${["Tide cup", "Moss bowl", "Night vase", "Ember jug"][i]}</text><text x="0" y="362" font-size="16" fill="${ink}" opacity=".6">${["$34", "$48", "$86", "$64"][i]}</text></g>`).join("")}
<rect x="80" y="1830" width="1040" height="250" rx="32" fill="${ink}"/>
<text x="140" y="1935" ${SERIF} font-size="44" fill="${sand}">Be first when the kiln opens.</text>
<rect x="140" y="1975" width="520" height="58" rx="29" fill="${sand}" opacity=".12"/><text x="170" y="2011" font-size="17" fill="${sand}" opacity=".6">you@email.com</text>
<rect x="680" y="1975" width="200" height="58" rx="29" fill="${clay}"/><text x="780" y="2011" font-size="17" fill="#fff" text-anchor="middle" font-weight="600">Notify me</text>
<text x="80" y="2160" font-size="14" fill="${ink}" opacity=".5">Fictional brand · Sample work by Shipday Studio</text>
`, sand);
}

function quillbyte() {
  const [bg, vi, fg, mint] = ["#0F0E17", "#7C5CFF", "#E8E6F3", "#2CE6B5"];
  return browser(`
<defs><radialGradient id="g" cx="50%" cy="0%" r="70%"><stop offset="0" stop-color="${vi}" stop-opacity=".45"/><stop offset="1" stop-color="${bg}" stop-opacity="0"/></radialGradient></defs>
<rect width="1200" height="900" fill="url(#g)"/>
<g transform="translate(80 40)"><rect width="34" height="34" rx="9" fill="${vi}"/><path d="M10 24 L24 10 M14 10 H24 V20" stroke="#fff" stroke-width="3" fill="none"/><text x="46" y="25" font-size="22" fill="${fg}" font-weight="700">Quillbyte</text></g>
<text x="760" y="63" font-size="16" fill="${fg}" opacity=".7">Product   Pricing   Changelog</text>
<rect x="1010" y="36" width="120" height="40" rx="10" fill="${fg}"/><text x="1070" y="62" font-size="15" fill="${bg}" text-anchor="middle" font-weight="600">Early access</text>
<rect x="430" y="150" width="340" height="36" rx="18" fill="${vi}" opacity=".2"/><text x="600" y="174" font-size="15" fill="${fg}" text-anchor="middle">✦ Now in private beta</text>
<text x="600" y="280" font-size="70" fill="${fg}" font-weight="800" text-anchor="middle">Your newsletter,</text>
<text x="600" y="365" font-size="70" fill="${mint}" font-weight="800" text-anchor="middle">drafted by Friday.</text>
<text x="600" y="430" font-size="21" fill="${fg}" opacity=".7" text-anchor="middle">Quillbyte turns your week of notes, links and voice memos into a first draft in your voice.</text>
<rect x="420" y="470" width="200" height="56" rx="12" fill="${vi}"/><text x="520" y="505" font-size="17" fill="#fff" text-anchor="middle" font-weight="600">Get early access</text>
<rect x="640" y="470" width="150" height="56" rx="12" fill="none" stroke="${fg}" stroke-opacity=".3"/><text x="715" y="505" font-size="17" fill="${fg}" text-anchor="middle">Watch demo</text>
<g transform="translate(140 590)"><rect width="920" height="520" rx="20" fill="#1A1826" stroke="${vi}" stroke-opacity=".5"/>
<circle cx="30" cy="28" r="7" fill="#FF5F57"/><circle cx="54" cy="28" r="7" fill="#FEBC2E"/><circle cx="78" cy="28" r="7" fill="#28C840"/>
<rect x="0" y="56" width="920" height="1" fill="${fg}" opacity=".1"/>
<rect x="24" y="80" width="200" height="420" rx="12" fill="#14121F"/>${lines(44, 110, 150, 8, "#2A2740", 40, 14)}
<text x="260" y="130" font-size="30" fill="${fg}" font-weight="700">Issue #42 — What I learned shipping weekly</text>
${lines(260, 165, 620, 4, "#2E2B45", 26, 12)}
<rect x="260" y="280" width="620" height="90" rx="12" fill="${vi}" opacity=".16"/><text x="282" y="315" font-size="15" fill="${mint}" font-weight="700">✦ Suggested from your notes</text>${lines(282, 335, 560, 2, "#4B3FA0", 20, 10)}
${lines(260, 400, 620, 3, "#2E2B45", 26, 12)}</g>
${["Learns your voice", "Pulls in your links", "Never auto-sends"].map((t, i) => `<g transform="translate(${80 + i * 360} 1200)"><rect width="320" height="250" rx="18" fill="#191726"/><rect x="28" y="30" width="48" height="48" rx="12" fill="${[vi, mint, "#FF8A65"][i]}" opacity=".9"/><text x="28" y="125" font-size="24" fill="${fg}" font-weight="700">${t}</text>${lines(28, 155, 260, 3, "#2E2B45", 24, 10)}</g>`).join("")}
<text x="600" y="1560" font-size="44" fill="${fg}" font-weight="800" text-anchor="middle">Simple pricing, when we launch.</text>
${[["Solo", "$9"], ["Creator", "$19"], ["Team", "$49"]].map(([n, p], i) => `<g transform="translate(${150 + i * 310} 1610)"><rect width="280" height="260" rx="18" fill="${i === 1 ? vi : "#191726"}"/><text x="28" y="56" font-size="20" fill="${fg}" font-weight="600">${n}</text><text x="28" y="120" font-size="52" fill="#fff" font-weight="800">${p}</text><text x="${i === 2 ? 128 : 100}" y="120" font-size="18" fill="${fg}" opacity=".7">/mo</text>${lines(28, 160, 220, 3, i === 1 ? "#9F86FF" : "#2E2B45", 24, 10)}</g>`).join("")}
<rect x="80" y="1950" width="1040" height="150" rx="24" fill="${mint}"/><text x="140" y="2038" font-size="36" fill="${bg}" font-weight="800">Join 1,200 writers on the waitlist</text><rect x="880" y="1996" width="190" height="58" rx="12" fill="${bg}"/><text x="975" y="2032" font-size="17" fill="#fff" text-anchor="middle" font-weight="600">Request invite</text>
<text x="80" y="2160" font-size="14" fill="${fg}" opacity=".45">Fictional brand · Sample work by Shipday Studio</text>
`, bg);
}

function fennel() {
  const [cream, green, fig, sun] = ["#F7F5EC", "#3F7D4E", "#7A3B69", "#F2B84B"];
  const leaf = (x, y, r, c) => `<path transform="translate(${x} ${y}) rotate(${r})" d="M0 0 C30 -40 80 -40 110 0 C80 40 30 40 0 0 Z" fill="${c}"/>`;
  return browser(`
<text x="80" y="62" font-size="26" fill="${green}" font-weight="800">Fennel <tspan fill="${fig}">&amp;</tspan> Fig</text>
<text x="770" y="60" font-size="16" fill="#333">Course   Recipes   About</text>
<rect x="1000" y="32" width="130" height="42" rx="21" fill="${fig}"/><text x="1065" y="59" font-size="15" fill="#fff" text-anchor="middle" font-weight="600">Enroll · $59</text>
<rect x="80" y="130" width="250" height="36" rx="18" fill="${sun}" opacity=".35"/><text x="205" y="154" font-size="15" fill="#5a4210" text-anchor="middle" font-weight="700">4-WEEK ONLINE COURSE</text>
<text x="80" y="260" font-size="68" fill="#1E2A20" font-weight="800">Prep once.</text>
<text x="80" y="340" font-size="68" fill="${green}" font-weight="800">Eat well all week.</text>
<text x="80" y="410" font-size="21" fill="#333">Two hours on Sunday, ten real meals. No fancy kit, no sad salads.</text>
<rect x="80" y="450" width="240" height="60" rx="30" fill="${green}"/><text x="200" y="487" font-size="18" fill="#fff" text-anchor="middle" font-weight="700">Start the course</text>
<text x="350" y="487" font-size="16" fill="#555">★★★★★  reviews go here</text>
<circle cx="900" cy="340" r="230" fill="${sun}" opacity=".3"/>
<circle cx="900" cy="340" r="170" fill="#fff"/><circle cx="900" cy="340" r="150" fill="#EFE9D8"/>
<circle cx="850" cy="300" r="48" fill="${fig}"/><circle cx="960" cy="320" r="38" fill="${sun}"/><circle cx="900" cy="410" r="44" fill="#D9573F"/>
${leaf(790, 380, -30, green)}${leaf(940, 250, 20, "#6BA368")}
<text x="80" y="700" font-size="15" fill="${fig}" letter-spacing="3" font-weight="700">WHAT YOU'LL LEARN</text>
${["Week 1 · The base kit", "Week 2 · Sauces that carry", "Week 3 · Batch &amp; freeze", "Week 4 · Your own plan"].map((t, i) => `<g transform="translate(${80 + (i % 2) * 530} ${740 + Math.floor(i / 2) * 200})"><rect width="510" height="175" rx="24" fill="#fff"/><circle cx="50" cy="55" r="24" fill="${[green, fig, sun, "#D9573F"][i]}"/><text x="90" y="64" font-size="24" fill="#1E2A20" font-weight="700">${t}</text>${lines(40, 100, 420, 3, "#ECE7D8", 22, 10)}</g>`).join("")}
<rect x="80" y="1180" width="1040" height="300" rx="32" fill="${green}"/>
<circle cx="230" cy="1330" r="90" fill="${sun}"/><circle cx="230" cy="1310" r="34" fill="#7a5a1c"/><path d="M170 1390 Q230 1340 290 1390" fill="#7a5a1c"/>
<text x="370" y="1290" font-size="32" fill="#fff" font-weight="800">Hi, I'm Mara.</text>
${lines(370, 1320, 640, 4, "#5E9A6C", 28, 12)}
<text x="80" y="1580" font-size="40" fill="#1E2A20" font-weight="800">Student reviews (placeholder)</text>
${[0, 1, 2].map((i) => `<g transform="translate(${80 + i * 355} 1620)"><rect width="330" height="190" rx="22" fill="#fff"/><text x="28" y="50" font-size="18" fill="${sun}">★★★★★</text>${lines(28, 75, 270, 3, "#ECE7D8", 22, 10)}<text x="28" y="165" font-size="16" fill="#333" font-weight="600">${"Review placeholder"}</text></g>`).join("")}
<rect x="80" y="1870" width="1040" height="230" rx="32" fill="${fig}"/>
<text x="140" y="1955" font-size="38" fill="#fff" font-weight="800">One price. Lifetime access.</text>
<text x="140" y="2000" font-size="18" fill="#fff" opacity=".8">30-day money-back guarantee, no questions asked.</text>
<text x="760" y="1990" font-size="72" fill="#fff" font-weight="800">$59</text>
<rect x="140" y="2025" width="220" height="50" rx="25" fill="${sun}"/><text x="250" y="2057" font-size="17" fill="#3a2a05" text-anchor="middle" font-weight="700">Enroll now</text>
<text x="80" y="2160" font-size="14" fill="#333" opacity=".55">Fictional brand · Sample work by Shipday Studio</text>
`, cream);
}

out("work/landing/northdrift-ceramics.svg", northdrift());
out("work/landing/quillbyte.svg", quillbyte());
out("work/landing/fennel-and-fig.svg", fennel());

// ---------- Thumbnails (1280 x 720) ----------
const thumb = (bg, body) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="1280" height="720" ${FONT}>${bg}${body}</svg>`;
const big = (x, y, t, size, fill, stroke = "#000", anchor = "start") =>
  `<text x="${x}" y="${y}" font-size="${size}" font-weight="900" fill="${fill}" stroke="${stroke}" stroke-width="${size / 14}" paint-order="stroke" stroke-linejoin="round" text-anchor="${anchor}" letter-spacing="-2">${esc(t)}</text>`;
const face = (cx, cy, s, skin, hair, mood = "wow") => `<g transform="translate(${cx} ${cy}) scale(${s})">
<path d="M-150 260 Q0 150 150 260 L150 320 L-150 320Z" fill="${hair}" opacity=".9"/>
<ellipse cx="0" cy="0" rx="120" ry="140" fill="${skin}"/>
<path d="M-125 -30 Q-120 -150 0 -150 Q120 -150 125 -30 Q90 -100 0 -95 Q-90 -100 -125 -30Z" fill="${hair}"/>
<ellipse cx="-42" cy="0" rx="14" ry="${mood === "wow" ? 20 : 10}" fill="#1b1b1b"/><ellipse cx="42" cy="0" rx="14" ry="${mood === "wow" ? 20 : 10}" fill="#1b1b1b"/>
<path d="M-70 -45 Q-42 -${mood === "wow" ? 70 : 55} -15 -45" stroke="${hair}" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M70 -45 Q42 -${mood === "wow" ? 70 : 55} 15 -45" stroke="${hair}" stroke-width="9" fill="none" stroke-linecap="round"/>
${mood === "wow" ? `<ellipse cx="0" cy="70" rx="28" ry="36" fill="#5a1a1a"/>` : `<path d="M-45 60 Q0 100 45 60" stroke="#5a1a1a" stroke-width="10" fill="none" stroke-linecap="round"/>`}
</g>`;
const arrow = (x, y, r, c) => `<g transform="translate(${x} ${y}) rotate(${r})"><path d="M0 -18 H90 V-48 L150 0 L90 48 V18 H0Z" fill="${c}" stroke="#000" stroke-width="6"/></g>`;

const thumbs = [
  thumb(`<rect width="1280" height="720" fill="#101826"/><circle cx="1000" cy="380" r="330" fill="#1D4ED8" opacity=".5"/>`,
    `${[0, 1, 2, 3, 4].map((i) => `<g transform="translate(${90 + i * 105} ${430 + (i % 2) * 30})"><rect x="-26" y="0" width="52" height="150" rx="26" fill="${["#E5E7EB", "#F59E0B", "#10B981", "#EF4444", "#A78BFA"][i]}" stroke="#000" stroke-width="5"/><rect x="-8" y="150" width="16" height="70" fill="#9CA3AF"/></g>`).join("")}
     ${big(70, 190, "5 BUDGET", 150, "#FACC15")}${big(70, 340, "MICS", 150, "#fff")}${face(1010, 360, 1.25, "#F2C29B", "#3B2416")}${arrow(640, 520, -15, "#FACC15")}
     <rect x="70" y="620" width="230" height="56" rx="10" fill="#EF4444"/><text x="185" y="660" font-size="32" font-weight="900" fill="#fff" text-anchor="middle">UNDER $50</text>`),
  thumb(`<rect width="1280" height="720" fill="#F5E6C8"/><rect x="0" y="470" width="1280" height="250" fill="#8B5A2B"/>`,
    `<ellipse cx="900" cy="440" rx="290" ry="170" fill="#D9A15B" stroke="#5C3A1A" stroke-width="10"/><path d="M700 400 Q900 330 1100 400" stroke="#F5E6C8" stroke-width="16" fill="none" stroke-linecap="round"/><path d="M740 460 Q900 400 1060 460" stroke="#F5E6C8" stroke-width="12" fill="none" stroke-linecap="round" opacity=".7"/>
     ${big(70, 230, "30 DAY", 160, "#fff", "#5C3A1A")}${big(70, 400, "SOURDOUGH", 120, "#F97316", "#5C3A1A")}
     <rect x="80" y="520" width="300" height="90" rx="16" fill="#fff" stroke="#5C3A1A" stroke-width="6"/><text x="230" y="580" font-size="46" font-weight="900" fill="#5C3A1A" text-anchor="middle">DAY 1 → 30</text>`),
  thumb(`<rect width="1280" height="720" fill="#052E16"/><path d="M0 720 L0 520 L250 470 L480 380 L700 400 L930 230 L1280 120 L1280 720Z" fill="#16A34A" opacity=".35"/>`,
    `<polyline points="60,600 300,540 520,450 740,470 980,300 1220,170" stroke="#4ADE80" stroke-width="18" fill="none" stroke-linejoin="round" stroke-linecap="round"/><circle cx="1220" cy="170" r="22" fill="#fff" stroke="#000" stroke-width="6"/>
     ${big(70, 170, "MY FIRST", 120, "#fff")}${big(70, 330, "$1K MONTH", 150, "#4ADE80")}${face(1060, 520, .85, "#C68642", "#111", "smile")}
     <rect x="760" y="60" width="300" height="80" rx="40" fill="#FACC15" stroke="#000" stroke-width="6"/><text x="910" y="114" font-size="40" font-weight="900" text-anchor="middle">+412%</text>`),
  thumb(`<rect width="1280" height="720" fill="#7DD3FC"/><path d="M0 540 L220 260 L380 420 L600 140 L860 470 L1020 300 L1280 520 L1280 720 L0 720Z" fill="#1E3A8A"/><path d="M600 140 L670 230 L630 220 L600 260 L560 210 L530 230Z" fill="#fff"/><path d="M220 260 L270 325 L230 315 L200 340 L180 310Z" fill="#fff"/><rect y="600" width="1280" height="120" fill="#166534"/>`,
    `${big(640, 140, "ALPS ON", 120, "#fff", "#0C1E4A", "middle")}${big(640, 680, "$40 A DAY", 150, "#FDE047", "#0C1E4A", "middle")}
     <g transform="translate(1080 330) rotate(12)"><rect x="-110" y="-70" width="220" height="140" rx="14" fill="#fff" stroke="#000" stroke-width="6"/><text x="0" y="18" font-size="56" font-weight="900" text-anchor="middle" fill="#DC2626">CHF?!</text></g>`),
  thumb(`<rect width="1280" height="720" fill="#18181B"/>`,
    `<g transform="translate(700 90)"><rect width="500" height="540" rx="24" fill="#27272A" stroke="#3F3F46" stroke-width="4"/>${[0, 1, 2, 3, 4, 5].map((i) => `<rect x="30" y="${40 + i * 60}" width="${[300, 200, 380, 250, 320, 180][i]}" height="34" rx="8" fill="#3F3F46"/>`).join("")}<rect x="30" y="420" width="440" height="90" rx="14" fill="#A855F7" opacity=".85"/></g>
     <g transform="translate(950 360)"><circle r="150" fill="none" stroke="#EF4444" stroke-width="26"/><path d="M-105 105 L105 -105" stroke="#EF4444" stroke-width="26"/></g>
     ${big(70, 230, "STOP", 200, "#EF4444", "#fff")}${big(70, 380, "DOING THIS", 100, "#fff")}${big(70, 500, "IN YOUR UI", 100, "#A855F7", "#fff")}`),
  thumb(`<rect width="1280" height="720" fill="#FFEDD5"/><circle cx="1000" cy="220" r="150" fill="#FB923C"/><rect y="440" width="1280" height="280" fill="#FDBA74"/>`,
    `<g transform="translate(260 430)"><circle r="150" fill="#fff" stroke="#000" stroke-width="10"/><text y="40" font-size="110" font-weight="900" text-anchor="middle">5:00</text><text y="100" font-size="38" font-weight="800" text-anchor="middle" fill="#EA580C">AM</text></g>
     ${big(1220, 380, "HONEST", 150, "#fff", "#7C2D12", "end")}${big(1220, 530, "REVIEW", 150, "#EA580C", "#7C2D12", "end")}
     <rect x="700" y="580" width="520" height="80" rx="14" fill="#000"/><text x="960" y="633" font-size="40" font-weight="900" fill="#FDE047" text-anchor="middle">I DID IT FOR 60 DAYS</text>`),
];
thumbs.forEach((t, i) => out(`work/thumbnails/thumb-${i + 1}.svg`, t));

// ---------- Logos (600 x 600) ----------
const logo = (bg, body) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600" ${FONT}><rect width="600" height="600" fill="${bg}"/>${body}</svg>`;
out("work/logos/tidewell.svg", logo("#E0F2FE", `
<g transform="translate(300 250)"><circle r="120" fill="#0369A1"/><path d="M-120 10 Q-80 -30 -40 10 T40 10 T120 10 V60 Q60 140 0 120 Q-80 130 -110 60Z" fill="#7DD3FC"/><path d="M-110 50 Q-70 15 -30 50 T50 50 T120 50" stroke="#E0F2FE" stroke-width="10" fill="none" stroke-linecap="round"/><circle cx="30" cy="-45" r="22" fill="#FDE68A"/></g>
<text x="300" y="460" font-size="64" font-weight="800" fill="#0C4A6E" text-anchor="middle" letter-spacing="-1">tidewell</text>
<text x="300" y="505" font-size="20" fill="#0369A1" text-anchor="middle" letter-spacing="6">SWIM SCHOOL</text>`));
out("work/logos/brightloom.svg", logo("#FFF7ED", `
<g transform="translate(300 245)">${[0, 1, 2, 3, 4].map((i) => `<rect x="${-110 + i * 46}" y="-110" width="28" height="220" rx="14" fill="${["#F97316", "#FB923C", "#EA580C", "#FDBA74", "#C2410C"][i]}"/>`).join("")}${[0, 1, 2].map((i) => `<rect x="-130" y="${-70 + i * 60}" width="260" height="20" rx="10" fill="#7C2D12" opacity=".85"/>`).join("")}</g>
<text x="300" y="460" ${SERIF} font-size="66" fill="#7C2D12" text-anchor="middle">Brightloom</text>
<text x="300" y="505" font-size="20" fill="#C2410C" text-anchor="middle" letter-spacing="6">TEXTILE STUDIO</text>`));
out("work/logos/cobalt-owl.svg", logo("#0B1437", `
<g transform="translate(300 240)"><path d="M-110 -90 L-60 -40 Q0 -70 60 -40 L110 -90 L110 40 Q110 130 0 140 Q-110 130 -110 40Z" fill="#2563EB"/><circle cx="-45" cy="10" r="40" fill="#0B1437"/><circle cx="45" cy="10" r="40" fill="#0B1437"/><circle cx="-45" cy="10" r="16" fill="#FBBF24"/><circle cx="45" cy="10" r="16" fill="#FBBF24"/><path d="M-16 55 L0 80 L16 55Z" fill="#FBBF24"/></g>
<text x="300" y="460" font-size="58" font-weight="900" fill="#E0E7FF" text-anchor="middle" letter-spacing="2">COBALT OWL</text>
<text x="300" y="505" font-size="20" fill="#93C5FD" text-anchor="middle" letter-spacing="6">NIGHT-SHIFT COFFEE</text>`));

console.log("assets generated in", root);
