import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const COUNTRIES = path.join(ROOT, "countries");
const INDEX = path.join(ROOT, "index.html");
const OUT = path.join(COUNTRIES, "_nodes.json");

function read(p){ return fs.readFileSync(p,'utf8'); }
function write(p,c){ fs.writeFileSync(p,c,'utf8'); }

function extract(html, name){
  const r = new RegExp(`<meta\\s+name=["']${name}["']\\s+content=["']([^"']*)["']`,'i');
  const m = html.match(r);
  return m?m[1]:"";
}

function has(html,name){
  return new RegExp(`<meta\\s+name=["']${name}["']`,'i').test(html);
}

const langs = ["en","zh","ar","es","pt","fr","de","ru","ja","ko"];

const nodes = fs.readdirSync(COUNTRIES)
  .filter(f=>f.endsWith(".html"))
  .map(f=>{
    const html = read(path.join(COUNTRIES,f));
    return {
      code: extract(html,"country-code")||f.replace(".html","").toUpperCase(),
      name: extract(html,"country-name")||f.replace(".html","").toUpperCase(),
      flag: extract(html,"country-flag")||"🌐",
      url: "/countries/"+f,
      langs: langs.filter(l=>has(html,"lang-"+l)),
      tags: extract(html,"node-tags").split(",").filter(Boolean)
    };
  });

write(OUT, JSON.stringify(nodes,null,2));

const grid = `<div class="country-grid">
${nodes.map(n=>`
<a class="country-card" href="${n.url}">
<div>${n.flag} ${n.name}</div>
<div>${n.langs.map(l=>`<span class="badge">${l.toUpperCase()}</span>`).join("")}</div>
</a>`).join("\n")}
</div>`;

const html = read(INDEX);
const start="<!-- AUTO_COUNTRY_NODES:START -->";
const end="<!-- AUTO_COUNTRY_NODES:END -->";

write(INDEX, html.split(start)[0]+start+"\n"+grid+"\n"+html.split(end)[1]);

console.log("🔥 COUNTRY GRID GENERATED:",nodes.length);
