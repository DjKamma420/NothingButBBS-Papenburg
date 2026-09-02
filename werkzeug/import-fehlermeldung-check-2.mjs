import fs from "node:fs";
const app = fs.readFileSync("app.js", "utf8");
for (const [name, pattern] of [
  ["JSON parse", /JSON\.parse\(sDaten\.value\)/],
  ["malformed JSON error", /Der Text lässt sich nicht lesen/],
  ["unknown backup error", /In der Datei steckt kein erkennbarer Stundenplan/],
  ["sanitization", /const teil = sanitizePackage\(d\);/],
]) if (!pattern.test(app)) throw new Error(`Missing import guard: ${name}`);
console.log("Import error-handling guard: OK");
