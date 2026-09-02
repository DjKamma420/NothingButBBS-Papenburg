# Stundenplan BBS Papenburg

Ein Stundenplan fürs Handy für Schülerinnen und Schüler der BBS Papenburg —
echte Uhrzeiten, alle Kurse in einer Ansicht, dazu Hausaufgaben, Klausuren,
Noten, Merkblätter und Fehlzeiten. Läuft offline, keine Zugangsdaten, keine
Anmeldung. Alle Daten bleiben auf dem Gerät.

Abgeleitet von [StundenplanNothing](https://github.com/DjKamma420/StundenplanNothing) —
dort steht die vollständige Anleitung (auch in der App selbst: ⚙ → *Anleitung
und Technik*). Diese README beschreibt nur, was hier zusätzlich dazukommt.

## Installieren

**Als App auf dem Handy (PWA, empfohlen):** Adresse im Browser öffnen →
*Zum Startbildschirm* / *App installieren*. Funktioniert sofort, keine APK
nötig.

**Als APK:** Im Reiter *Actions* dieses Repositories den neuesten Lauf von
*APK bauen* öffnen, die Datei `stundenplan-bbs-papenburg-apk` herunterladen.
Es ist eine Debug-APK — Android fragt beim Installieren nach der Erlaubnis
für „Apps aus unbekannten Quellen“.

## Voreinstellung für diese Schule

Unter ⚙ → Stundenraster steht neben den zwei allgemeinen Vorlagen eine
dritte: **BBS Papenburg (Blöcke)** mit den bekannten Blockzeiten
(8:10–9:40, 10:00–11:30, 11:45–13:15, 13:45–15:15). Einmal antippen, dann
prüfen ob es noch stimmt — Schulen ändern Zeiten gelegentlich.

## Was diese App bewusst nicht tut

Sie loggt sich nicht automatisch ins Schulportal ein und sammelt keine
Schul-Zugangsdaten — auch nicht für andere Schüler. Warum, steht in
[CLAUDE.md](CLAUDE.md). Der Plan wird wie im Ursprungsprojekt von Hand oder
per Copy-Paste aus dem Portal eingetragen (⚙ → Plan einfügen).

Bietet das Schulportal einen persönlichen Kalender-Abo-Link (ICS) an, lässt
sich der über den normalen ICS-Import weiterverarbeiten — das ist der vom
Anbieter vorgesehene Weg, ohne Passwort.

## Fächerkürzel

Kürzel → ausgeschriebener Name ist wie im Ursprungsprojekt eine lokale,
editierbare Tabelle (⚙ → Fachnamen) — kein Online-Dienst, den es für
beliebige Schulen zuverlässig gäbe. Wer die offizielle Fächerliste der BBS
Papenburg hat, kann sie hier als Ausgangsbefüllung ergänzen (Pull Request
oder Issue).
