import fs from "node:fs";

const app = fs.readFileSync("app.js", "utf8");

const required = [
  ["malformed JSON", /JSON\.parse\(sDaten\.value\)/],
  ["malformed JSON message", /Der Text lässt sich nicht lesen/],
  ["unrecognized package", /In der Datei steckt kein erkennbarer Stundenplan/],
  ["profile import guard", /Array\.isArray\(d\.profile\)/],
  ["sanitization before replacement", /const teil = sanitizePackage\(d\);/],
];

const missing = required.filter(([, pattern]) => !pattern.test(app));
if (missing.length) {
  throw new Error(`Import error-handling guard failed: ${missing.map(([name]) => name).join(", ")}`);
}

const importStart = app.indexOf('$("#sLaden").onclick');
const importEnd = app.indexOf('$("#sReset").onclick', importStart);
if (importStart < 0 || importEnd < 0) throw new Error("Could not locate import handler");

const handler = app.slice(importStart, importEnd);
if (handler.includes('alert("Der Text lässt sich nicht lesen')) {
  console.log("Current product behavior still uses alert() for malformed JSON.");
}
if (handler.includes('alert("In der Datei steckt kein erkennbarer Stundenplan')) {
  console.log("Current product behavior still uses alert() for an unrecognized package.");
}

console.log("Import error-handling structure: OK");
