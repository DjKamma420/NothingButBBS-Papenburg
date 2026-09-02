# Änderungen

Abgeleitet von StundenplanNothing (dort v39, siehe dessen CHANGELOG für die
gesamte Vorgeschichte). Eigene Versionsnummer folgt separat, sobald sich
diese Fassung von der Vorlage entfernt — bis dahin gilt: Fassung v39 des
Ursprungsprojekts plus die hier gelisteten Ergänzungen.

## v40

**Bestätigt (ChatGPT-Recherche, 2026-09-02)**
- Blockzeiten der Vorlage „BBS Papenburg (Blöcke)“ stimmen mit der
  offiziellen FAQ (start.bbs-papenburg.de/faq.php) und der Schulordnung
  (Fassung 2.7, start.bbs-papenburg.de/images/Schulordnung.pdf) überein.
  Nicht mehr als unbestätigt markiert.
- Stundenplansystem der Schule ist `virtueller-stundenplan.org`
  (E-Mail/Passwort oder Office365-Login), nicht WebUntis. Kein öffentlicher
  ICS/webcal-Abo-Link gefunden — dieser Weg bleibt vorerst unbestätigt und
  ungebaut (siehe CLAUDE.md).
- Keine öffentlich dokumentierten Fächerkürzel gefunden (nur
  Lehrkraftkürzel) — keine erfundenen Werte übernommen, Tabelle bleibt
  lokal und editierbar.

**Gehärtet**
- `package-lock.json` ergänzt, CI (`apk-bauen.yml`) nutzt jetzt `npm ci`
  statt `npm install` — reproduzierbare Abhängigkeiten statt frei
  schwebender `^`-Versionen.
- Bekannt: `npm audit` meldet 1 kritische, 1 hohe Schwachstelle in `tar`
  (transitive Abhängigkeit von `@capacitor/cli`, nur beim CI-Build aktiv,
  nicht in der ausgelieferten App). Fix erfordert einen Breaking-Change auf
  `@capacitor/cli` 8.x — wird in einem eigenen Branch getestet, bevor es
  nach main geht.

## Ergänzungen gegenüber StundenplanNothing v39

**Neu**
- Stundenraster-Vorlage „BBS Papenburg (Blöcke)“ mit den über die
  Schul-Website recherchierten Blockzeiten (8:10–9:40, 10:00–11:30,
  11:45–13:15, 13:45–15:15) — inzwischen bestätigt, siehe v40 oben
- Capacitor-Hülle für eine Android-APK, gebaut über GitHub Actions
  (`.github/workflows/apk-bauen.yml`)

**Bewusst nicht umgesetzt**
- Automatischer Login mit Schul-Zugangsdaten und automatisierter Abruf des
  Schulportals — siehe CLAUDE.md für die Begründung und die Bedingungen,
  unter denen das neu bewertet werden kann
- Online-Nachschlagen von Fächerkürzeln — es gibt keinen verlässlichen,
  schulübergreifenden Dienst dafür; die Tabelle bleibt lokal und editierbar
