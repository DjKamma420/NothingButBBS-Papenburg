# Stundenplan BBS Papenburg — Kontext für Claude

Abgeleitet von [StundenplanNothing](https://github.com/DjKamma420/StundenplanNothing).
Gleiche Architektur, gleiche Regeln — siehe dort für Details zu Aufbau,
Abschnitten in `app.js` und Begriffen im Code. Diese Datei hält nur fest,
was hier anders ist.

## Unterschiede zum Ursprungsprojekt

1. **Zusätzliche Stundenraster-Vorlage** `bbsPapenburg` in `VORLAGEN`
   (app.js) mit den Blockzeiten der BBS Papenburg. Quelle: bbs-papenburg.de,
   Stand der Recherche siehe CHANGELOG. Zeiten ändern sich an Schulen
   gelegentlich — vor jedem neuen Schuljahr stichprobenartig prüfen.
2. **Capacitor-Hülle** für eine Android-APK: `package.json`,
   `capacitor.config.json`, `.github/workflows/apk-bauen.yml`. Die Web-App
   selbst bleibt buildfrei (Regel 3 des Ursprungsprojekts gilt weiter);
   der Build-Schritt existiert nur für die zusätzliche APK-Hülle und läuft
   ausschließlich in CI. `android/`, `www/`, `node_modules/` werden nie
   committet — sie entstehen bei jedem Lauf neu aus derselben Dateiliste,
   die auch `sw.js` kennt (`werkzeug/seite-bauen.mjs`).

## Harte Regel — nicht stillschweigend neu verhandeln

**Kein automatischer Login mit echten Schul-Zugangsdaten für andere
Nutzer.** Das war ausdrücklich Teil des Auftrags und wurde bewusst
abgelehnt, aus drei Gründen, die beim nächsten Anlauf zuerst wieder gelten:

- Nicht verifiziert, welches System die Schule einsetzt oder was dessen
  Nutzungsbedingungen zu automatisiertem/Drittanbieter-Zugriff sagen.
- BBS-Schüler sind teils minderjährig; Passwortsammlung für andere Personen
  ist ein anderes Risiko als private Automatisierung für sich selbst.
- Verstoß gegen die Nutzungsbedingungen des Portal-Anbieters ist ohne
  Prüfung nicht auszuschließen und beträfe dann nicht nur eine Person.

**Erlaubter Weg, falls die Schule ihn anbietet:** ein persönlicher
Kalender-Abo-Link (ICS/webcal) aus dem Portal — kein Passwort, vom
Anbieter selbst für genau diesen Zweck vorgesehen. Erst einbauen, wenn
jemand bestätigt, dass es diesen Link bei dieser Schule gibt.

Diese Regel nur aufheben, wenn der Nutzer ausdrücklich bestätigt, dass er
die drei Punkte oben kennt und das Risiko trotzdem eingehen will — und
selbst dann zuerst klären, für wen die App gedacht ist (nur er selbst,
oder wieder andere Schüler).

## APK bauen

```
git push origin main
```

löst `.github/workflows/apk-bauen.yml` aus. Ergebnis liegt danach als
Actions-Artefakt "stundenplan-bbs-papenburg-apk" bereit (Debug-APK,
unsigniert — für den Play Store müsste sie noch signiert werden).

Lokal, mit Android SDK: `npm install && npx cap add android && npx cap
sync android && cd android && ./gradlew assembleDebug`.
