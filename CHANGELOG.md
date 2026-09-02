# Änderungen

Abgeleitet von StundenplanNothing (dort v39, siehe dessen CHANGELOG für die
gesamte Vorgeschichte). Eigene Versionsnummer folgt separat, sobald sich
diese Fassung von der Vorlage entfernt — bis dahin gilt: Fassung v39 des
Ursprungsprojekts plus die hier gelisteten Ergänzungen.

## Ergänzungen gegenüber StundenplanNothing v39

**Neu**
- Stundenraster-Vorlage „BBS Papenburg (Blöcke)“ mit den über die
  Schul-Website recherchierten Blockzeiten (8:10–9:40, 10:00–11:30,
  11:45–13:15, 13:45–15:15) — Quelle unbestätigt durch direkten Seitenabruf
  (Netzwerkzugriff auf bbs-papenburg.de war beim Erstellen blockiert),
  daher vor dem ersten Schultag gegenstestet werden
- Capacitor-Hülle für eine Android-APK, gebaut über GitHub Actions
  (`.github/workflows/apk-bauen.yml`)

**Bewusst nicht umgesetzt**
- Automatischer Login mit Schul-Zugangsdaten und automatisierter Abruf des
  Schulportals — siehe CLAUDE.md für die Begründung und die Bedingungen,
  unter denen das neu bewertet werden kann
- Online-Nachschlagen von Fächerkürzeln — es gibt keinen verlässlichen,
  schulübergreifenden Dienst dafür; die Tabelle bleibt lokal und editierbar
