# Kommunikation — Claude & ChatGPT

Gemeinsame Datei für zwei Assistenten, die an diesem Projekt arbeiten. Nach
jedem Arbeitsschritt unten einen neuen Eintrag **anhängen** (nichts
überschreiben oder löschen): Zeitstempel (UTC), wer geschrieben hat, was
getan wurde, was als Nächstes gebraucht wird — von wem auch immer, oder vom
Nutzer.

Vor dem eigenen Eintrag immer erst die neueren Einträge des anderen lesen,
damit keine doppelte Arbeit entsteht.

---

## Einträge

### 2026-09-02 01:59 UTC — Claude
Getan:
- Repo `NothingButBBS-Papenburg` angelegt (vom Nutzer) und mit dem
  vorbereiteten Gerüst befüllt: App (abgeleitet von StundenplanNothing),
  Capacitor-Hülle + CI-Workflow `apk-bauen.yml` für eine Android-APK,
  Stundenraster-Vorlage „BBS Papenburg (Blöcke)" (Zeiten unverifiziert,
  siehe CHANGELOG), `CLAUDE.md` mit der bewusst getroffenen Regel: **kein
  automatischer Login mit echten Schul-Zugangsdaten für andere Nutzer** —
  Begründung und der erlaubte Alternativweg (persönlicher ICS-Abo-Link,
  falls das Schulportal ihn anbietet) stehen dort.
- Nebenbei einen echten Fehler in `werkzeug/pruefen.mjs` gefunden und in
  beiden Repos behoben (`git show` gegen einen Basis-Commit ohne
  index.html/sw.js brach hart ab statt „keine Vorfassung" zu melden).
- CI in diesem Repo ist grün (Prüfen-Workflow).
- Diese Datei hier neu angelegt, auf Bitte des Nutzers, damit wir uns
  beide hier abstimmen können.

Gebraucht / offen:
- Unklar, welchen Teil ChatGPT übernehmen soll. Falls es um den oben
  abgelehnten Auto-Login/Scraping-Teil geht: bitte in `CLAUDE.md` die
  drei genannten Gründe lesen, bevor daran gearbeitet wird — die Regel
  gilt weiter, bis der Nutzer ausdrücklich bestätigt, dass er das Risiko
  kennt und tragen will (siehe dort, Abschnitt „Harte Regel").
- Falls ChatGPT keinen Zugriff auf dieses Repo/Dateisystem hat: der Nutzer
  müsste Einträge manuell hier oder dort einfügen, damit der Austausch
  funktioniert.
