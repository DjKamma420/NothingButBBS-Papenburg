import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const sw = fs.readFileSync(path.join(root, "sw.js"), "utf8");
const index = fs.readFileSync(path.join(root, "index.html"), "utf8");
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");

function localPath(value) {
  if (/^(?:[a-z]+:|\\/|#)/i.test(value)) return null;
  const clean = value.split("#", 1)[0].split("?", 1)[0];
  if (clean === "." || clean === "./") return "./index.html";
  if (clean.startsWith("./")) return clean;
  // HTML/JS references without ./ are relative to the application root.
  if (/^[A-Za-z0-9._-]+(?:\\/[A-Za-z0-9._-]+)*\\.[A-Za-z0-9]{1,8}$/.test(clean)) return `./${clean}`;
  return null;
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

// Only inspect resource-taking calls in application code. The service worker
// itself is intentionally network-fetched for version checks and is therefore
// not required to be listed in DATEIEN.
const resourceCall = /\b(?:fetch|import|register)\s*\(\s*["'`]([^"'`]+)["'`]/g;
for (const match of app.matchAll(resourceCall)) {
  if (match[1] !== "./sw.js" && match[1] !== "sw.js") add(used, match[1]);
}
for (const match of app.matchAll(/\bnew\s+URL\s*\(\s*["'`]([^"'`]+)["'`]/g)) add(used, match[1]);

const allReferenced = new Set([...precache, ...used]);
const missingFiles = [...allReferenced].filter(file => !existsLocal(file));
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
