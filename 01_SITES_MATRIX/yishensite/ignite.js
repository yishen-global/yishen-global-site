/**
 * YISHEN GLOBAL – ONE KEY IGNITION ENGINE
 * Run: node ignite.js
 * This will auto-generate:
 * /countries seed nodes
 * /scripts generate_country_nodes.mjs
 * index.html injection anchors
 * styles.css grid system
 */

import fs from "fs";
import path from "path";

const root = process.cwd();
const log = console.log;

function ensureDir(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

function writeFile(p, c) {
  fs.writeFileSync(p, c, "utf8");
}

log("🛸 YISHEN GLOBAL · ONE KEY IGNITION START");

ensureDir("countries");
ensureDir("scripts");

/* ================== COUNTRY SEED MATRIX ================== */
const countries = [
  ["sa","Saudi Arabia","🇸🇦","ar,zh,en","Distributor,Projects"],
  ["ae","United Arab Emirates","🇦🇪","ar,en","Distributor,E-commerce"],
  ["us","United States","🇺🇸","en,es","Retail,Brand"],
  ["br","Brazil","🇧🇷","pt,en","Distributor,E-commerce"],
  ["mx","Mexico","🇲🇽","es,en","Distributor"],
  ["de","Germany","🇩🇪","de,en","Retail"],
  ["fr","France","🇫🇷","fr,en","Retail"],
  ["jp","Japan","🇯🇵","ja,en","Retail"],
  ["kr","Korea","🇰🇷","ko,en","Retail"],
  ["au","Australia","🇦🇺","en","Retail"]
];

countries.forEach(([code,name,flag,langs,tags])=>{
  const metas = `
<meta name="country-code" content="${code.toUpperCase()}">
<meta name="country-name" content="${name}">
<meta name="country-flag" content="${flag}">
${langs.split(',').map(l=>`<meta name="lang-${l}" content="1">`).join("\n")}
<meta name="node-tags" content="${tags}">
`;

  writeFile(`countries/${code}.html`,
`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
${metas}
<title>${name} Cooperation Hub</title>
</head>
<body>
<h1>${name} Cooperation Hub</h1>
<p>LEISA / YISHEN GLOBAL Official Country Node</p>
</body>
</html>`);
});

/* ================== INDEX ANCHOR ================== */
if(!fs.existsSync("index.html")){
  writeFile("index.html",
`<!DOCTYPE html><html><body>
<!-- AUTO_COUNTRY_NODES:START -->
<!-- AUTO_COUNTRY_NODES:END -->
</body></html>`);
}

/* ================== STYLE PATCH ================== */
writeFile("styles.css",`
.country-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px;margin:20px;}
.country-card{border:1px solid #333;padding:14px;border-radius:14px;color:white;text-decoration:none;}
.country-card:hover{border-color:#0ea5e3;}
.cc-top{display:flex;gap:10px;align-items:center;}
.cc-flag{font-size:28px;}
.badge{font-size:12px;padding:4px 8px;border:1px solid #555;border-radius:20px;}
`);

/* ================== GENERATOR CORE ================== */
const generator = `
${fs.readFileSync("scripts/generate_country_nodes.mjs","utf8")}
`;

if(!fs.existsSync("scripts/generate_country_nodes.mjs")){
  writeFile("scripts/generate_country_nodes.mjs",generator);
}

log("🚀 COUNTRIES + CORE ENGINE GENERATED");
log("NEXT: node scripts/generate_country_nodes.mjs");
