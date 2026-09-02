# Phase 4 — ChatGPT Audit & Feature Priorities

Stand: 2026-09-03

## Ziel

Phase 4 soll nicht einfach weitere UI-Funktionen anhäufen. Priorität haben Funktionen, die den Stundenplan im Alltag robuster und schneller nutzbar machen, ohne neue Zugangsdaten oder unnötige Serverabhängigkeiten einzuführen.

## Priorität 1 — Daten-/Import-Resilienz

- Import alter Sicherungen weiterhin vollständig rückwärtskompatibel halten.
- Roundtrip-Test als Pflichtprüfung für jede Änderung am Sicherungsformat beibehalten.
- Bei beschädigten/teilweise ungültigen Importdaten klare Fehlermeldung statt stiller Teilübernahme.
- Exportformat versionieren, bevor neue Felder eingeführt werden.

## Priorität 2 — PWA-/Offline-Zuverlässigkeit

- App muss nach einem Service-Worker-Update niemals einen gemischten alten/neuen Asset-Stand laden.
- Precache-Liste und tatsächlich verwendete lokalen Dateien automatisiert gegeneinander prüfen.
- Offline-Start testen: App öffnen, Navigation durchführen, Stundenplan anzeigen, Einstellungen öffnen.
- Cache-Version bei jeder Änderung an precache-relevanten Dateien erhöhen.

## Priorität 3 — Stundenplan-Bedienung

- Heute-Ansicht mit klarer Hervorhebung des aktuellen Blocks.
- Schneller Wechsel zwischen Tagen ohne unnötige Dialoge.
- Lesbare Darstellung bei langen Fächern, Räumen und Lehrern auf kleinen Displays.
- Empty/Error States für Tage ohne Unterricht und unvollständige Einträge.

## Priorität 4 — Barrierefreiheit

- Tastaturbedienung aller Dialoge und Menüs prüfen.
- Fokus nach Dialogöffnung und -schließung sinnvoll setzen.
- Touch-Ziele mindestens nach aktuellem WCAG-AA-Maßstab prüfen.
- Kontrast und sichtbaren Fokus in DE und EN prüfen.
- Sprachumschalter selbst per Tastatur und Screenreader erreichbar halten.

## Priorität 5 — Datenschutz / Sicherheit

- Keine neuen Analytics, Tracker oder externe Fonts/CDNs ohne ausdrückliche Begründung.
- Importierte Daten niemals als HTML interpretieren.
- Externe URLs bei Kalender-/Portal-Funktionen nicht ungeprüft in DOM oder Navigation übernehmen.
- Keine Passwörter oder Portal-Tokens im Local Storage speichern.
- Backup-Import als untrusted input behandeln.

## Bewusst nicht priorisieren

- Automatischer Login ins Schulportal.
- Passwortsammlung für andere Schüler.
- ICS-Unterstützung als angeblich vorhandenes Schulportal-Feature, solange ein echter persönlicher Abo-Link nicht bestätigt ist.
- Große Refactorings der persistierten Variablen ohne Parser und Migrationsstrategie.

## Technischer nächster Schritt

Vor einer größeren Phase-4-Funktion sollte ein gezielter Offline-/Import-Sicherheitstest ergänzt werden. Das liefert mehr Sicherheitsgewinn als ein weiteres kosmetisches Feature und passt direkt zum bereits vorhandenen Roundtrip-Test.
