# Kalender

Öffne <a href="test.html">test.html</a>, um direkt einen Link zum lokalen Testlauf
des NOAHSKALENDERS zu erhalten. Dort findest du auch die kurzen Schritte, mit
denen du den Webserver startest und anschließend den Kalender im Browser
aufrufst.

Alternativ kannst du dem Abschnitt „So startest du den lokalen Webserver“ in
`test.html` folgen:

1. Terminal im Projektordner öffnen (`cd Kalender`).
2. Server starten: `python -m http.server 8000`
3. Browser auf `http://localhost:8000/index.html` richten.

### Branch „gitterbruch“

Für den Export nach „Meenen“ liegt der komplette Stand zusätzlich auf dem
Branch `gitterbruch`. Wechsle bei Bedarf mit `git checkout gitterbruch` auf
diesen Zweig, um exakt die getestete Variante auszugeben.

### Aktuelle Testbefehle

Vor dem Anlegen des Branches wurden die folgenden Prüfungen erneut ausgeführt
und liefen ohne Fehler durch:

- `node --check assets/js/app.js`
- `for f in fragen/*.json data/users.json; do python -m json.tool "$f" >/dev/null || exit 1; done`

### Zugangsdaten für Noah

- Name: `Noah`
- Geburtsdatum: `2012-06-19`
- Zugangscode: `1906`
