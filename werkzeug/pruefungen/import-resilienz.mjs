#!/usr/bin/env node
/*
 * Statischer Sicherheits-Check für den Sicherungsimport.
 * Ziel: Änderungen am Importpfad dürfen nicht wieder dazu führen,
 * dass beschädigte/unerwartete JSON-Daten still als gültiger Teilimport
 * behandelt werden.
 *
 * Dieser Check ist bewusst unabhängig von Browser/Playwright und ergänzt
 * den bestehenden Roundtrip-Test in angriff.mjs.
 */
import fs from "node:fs";

const app = fs.readFileSync(new URL("../../app.js", import.meta.url), "utf8");

const required = [
  {
    name: "JSON parse failure is surfaced",
    pattern: /catch\s*\([^)]*\)\s*\{\s*return\s+alert\([\s\S]*?Text lässt sich nicht lesen/,
  },
  {
    name: "unrecognized package is rejected",
    pattern: /!Object\.keys\(teil\)\.length[\s\S]*?In der Datei steckt kein erkennbarer Stundenplan/,
  },
  {
    name: "sanitization occurs before replacement",
    pattern: /const teil\s*=\s*sanitizePackage\(d\)[\s\S]*?if\(teil\.cfg\)/,
  },
];

const failures = required.filter(x => !x.pattern.test(app));

if (failures.length) {
  console.error("Import-Resilienz: FEHLER");
  for (const f of failures) console.error(`- ${f.name}`);
  process.exit(1);
}

console.log(`Import-Resilienz: OK (${required.length} Schutzprüfungen)`);
