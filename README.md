# Kalender

Ein vollständig clientseitiger Adventskalender, der für Noahs 2025er Saison erstellt wurde. Die Seite kombiniert eine Matrix-Intro-Animation, einen geschützten Login mit Rechen-Challenge und einen spielerischen Fragenkalender mit 24 Türen.

## Features
- 🎄 Intro mit Matrix-Regen, Übergangsscreen und animiertem Schnee-/Charakter-Layer.
- 🔐 Login über Name, Geburtsdatum und eine zufällige Kopfrechenaufgabe.
- 🧠 Dynamisch ausgewählte Fragen aus thematischen JSON-Pools (Marvel, Fortnite, Minecraft, …).
- 🔊 Hintergrundmusik inkl. Lautstärkeregelung & Mute-Schalter.
- ♻️ Schaltfläche zum Neu-Mischen der Fragen, damit mehrere Sessions möglich sind.

## Lokale Entwicklung
1. Installiere einen einfachen Static-File-Server deiner Wahl (z. B. `npm install --global serve`).
2. Starte den Server im Projektverzeichnis, etwa mit `serve .` oder `python -m http.server`.
3. Öffne anschließend `http://localhost:3000` (bzw. den vom Server ausgegebenen Port) in deinem Browser.

⚠️ Der Login funktioniert nur, wenn die JSON-Dateien über HTTP ausgeliefert werden. Ein reines Öffnen der `index.html` via `file://` blockiert die `fetch`-Aufrufe zu `data/users.json` und `fragen/*.json`.

## Deployment auf GitHub Pages
Dieses Repository enthält ab sofort einen GitHub-Actions-Workflow (`.github/workflows/deploy.yml`), der bei jedem Push auf den Branch `main` oder `work` automatisch den aktuellen Stand auf GitHub Pages veröffentlicht.

1. Aktiviere unter **Settings → Pages** die Option „GitHub Actions“ als Source.
2. Stelle sicher, dass du auf `main` (oder `work`) pushst – der Workflow kümmert sich um das Packaging.
3. Nach erfolgreichem Lauf findest du die URL im Actions-Log sowie im Pages-Abschnitt des Repos.

Wenn du einen anderen Branch verwenden möchtest, passe einfach die `branches`-Sektion im Workflow an.
