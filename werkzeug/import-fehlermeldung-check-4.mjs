import fs from "node:fs";
const app = fs.readFileSync("app.js", "utf8");
if (!/JSON\.parse\(sDaten\.value\)/.test(app) || !/sanitizePackage\(d\)/.test(app)) throw new Error("Import guard missing");
console.log("Import guard: OK");
