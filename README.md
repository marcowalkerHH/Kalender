# FutureLab Navigator

Neues Projekt statt Adventskalender: FutureLab Navigator ist eine vollständig
clientseitige Projektzentrale mit Fahrplan, Task-Board und Ideen-Deck. Die Seite
läuft ohne Backend, alle Daten liegen direkt im Frontend und lassen sich schnell
anpassen.

## Features
- 🚀 **Projektfahrplan** mit vier Phasen und dynamischen Inhalten.
- 📋 **Task-Hub** inklusive Formular, Kanban-Board und Fortschrittsmetriken.
- 🔄 **Idea Deck** liefert zufällige Workshop-/Prototype-Impulse.
- 🧮 Kennzahlen für offene Tasks vs. erledigte Items.
- 🎨 Ein neues Dark-Theme auf Basis von `Space Grotesk`.

## Lokale Entwicklung
1. Static-File-Server starten, z. B. `python -m http.server 8000`.
2. Browser auf `http://localhost:8000/index.html` richten.

## Anpassungen
- Inhaltliche Module findest du in `script.js` (Phasen, Ideas, initiale Tasks).
- Styles liegen gesammelt in `style.css`.
