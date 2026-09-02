import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const sw = fs.readFileSync(path.join(root, "sw.js"), "utf8");
const index = fs.readFileSync(path.join(root, "index.html"), "utf8");
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");

function localPath(value) {
  if (!value.startsWith("./")) return null;
  const clean = value.split("#", 1)[0].split("?", 1)[0];
  return clean === "./" ? "./index.html" : clean;
}

function existsLocal(value) {
  const rel = value === "./index.html" ? "index.html" : value.slice(2);
  return fs.existsSync(path.join(root, rel));
}

function add(set, value) {
  const p = localPath(value);
  if (p) set.add(p);
}

const precache = new Set();
const dateienMatch = sw.match(/const\s+DATEIEN\s*=\s*\[([\s\S]*?)\];/);
if (!dateienMatch) throw new Error("DATEIEN in sw.js nicht gefunden");
for (const match of dateienMatch[1].matchAll(/"([^"\\]*(?:\\.[^"\\]*)*)"|'([^'\\]*(?:\\.[^'\\]*)*)'/g)) {
  add(precache, match[1] ?? match[2]);
}

const used = new Set();
for (const match of index.matchAll(/\b(?:src|href)\s*=\s*["']([^"']+)["']/gi)) add(used, match[1]);

// Check explicit local resource strings in application code. Ignore bare "./"
// and API paths; the latter are external or data endpoints, not cache files.
for (const match of app.matchAll(/["'`]((?:\.\/)[^"'`\s?#]+(?:\.[a-z0-9]{1,8})(?:[?#][^"'`\s]*)?)["'`]/gi)) {
  add(used, match[1]);
}

const missingFiles = [];
for (const file of new Set([...precache, ...used])) {
  if (!existsLocal(file)) missingFiles.push(file);
}

const missingPrecache = [...used].filter(file => !precache.has(file));
const stalePrecache = [...precache].filter(file => !existsLocal(file));

console.log(`Precache-Dateien: ${[...precache].join(", ")}`);
console.log(`Erkannte lokale Ressourcen: ${[...used].join(", ")}`);
console.log(`Fehlende Dateien: ${missingFiles.length ? missingFiles.join(", ") : "keine"}`);
console.log(`Lokal verwendet, aber nicht precached: ${missingPrecache.length ? missingPrecache.join(", ") : "keine"}`);
console.log(`Precache-Einträge ohne Datei: ${stalePrecache.length ? stalePrecache.join(", ") : "keine"}`);

if (missingFiles.length || missingPrecache.length || stalePrecache.length) {
  process.exitCode = 1;
} else {
  console.log("Precache-Konsistenz: OK");
}
