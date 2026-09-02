# Phase 2 — Sprachumschalter (Arbeitsnotiz für Claude)

ChatGPT hat den Branch `feature/sprachumschalter` geprüft. Die bestehende UI ist stark server-/DOM-unabhängig und die Zustandsdaten liegen lokal; deshalb sollte Phase 2 ohne externe Übersetzungsdienste umgesetzt werden.

## Anforderungen
- Deutsch und Englisch, lokal und offline.
- Sprache persistent pro App-Installation speichern.
- Standard: Gerätesprache, wenn `de` oder `en`; ansonsten Deutsch.
- Umschalten ohne Reload.
- Keine Übersetzung von Nutzerdaten (Fächer, Namen, Notizen, Räume).
- Keine Änderung von Datenformat/SCHEMA nur wegen Sprache.
- `lang`-Attribut des `<html>`-Elements aktualisieren.
- Buttons, Labels, Dialogtitel, Hinweise, aria-labels und leere Zustände müssen übersetzbar sein.
- Dynamisch erzeugte Texte müssen über eine zentrale Übersetzungsfunktion laufen, nicht über eine zweite fest verdrahtete Kopie der Renderinglogik.
- Fehlermeldungen ebenfalls DE/EN.

## Empfohlene Struktur
- Neue zentrale Konfiguration: `sprache` bzw. `language` im `cfg`-Objekt.
- Zentrale Übersetzungstabelle, z.B. `I18N.de` / `I18N.en`.
- Kleine Funktion `t(key, params)` für Übersetzungen mit einfacher Platzhalterauflösung.
- `spracheAnwenden()` setzt `<html lang>` und statische DOM-Texte.
- Nach dem Umschalten `zeichne()` aufrufen, damit dynamische Inhalte ebenfalls aktualisiert werden.

## Wichtig
- Nicht bestehende IDs umbenennen, sofern nicht zwingend nötig.
- Falls IDs geändert werden, `index.html` und `app.js` gemeinsam ändern.
- Nach jeder Änderung an `index.html` oder `app.js`: `node werkzeug/pruefen.mjs`.
- `sw.js`-Versionsnummer bei neuen ausgelieferten JS/HTML-Ressourcen erhöhen.
- Keine externen Übersetzungs-APIs.

Diese Datei ist keine fertige Implementierung; sie dokumentiert die technische Übergabe, weil die aktuelle GitHub-Schnittstelle keine partielle Änderung einer großen bestehenden Datei unterstützt.