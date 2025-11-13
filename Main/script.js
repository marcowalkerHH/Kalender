(function () {
  'use strict';

  /* ===== Helpers ===== */
  function $(id) {
    return document.getElementById(id);
  }

  function on(el, event, handler) {
    if (el) {
      el.addEventListener(event, handler, false);
    }
  }

  function log(level, message) {
    try {
      var logRoot = $('dbg-log');
      if (!logRoot) {
        return;
      }
      var entry = document.createElement('div');
      entry.textContent = '[' + level.toUpperCase() + '] ' + message;
      logRoot.appendChild(entry);
      logRoot.scrollTop = logRoot.scrollHeight;
      var status = $('dbg-status');
      if (status) {
        status.textContent = level.toUpperCase();
      }
    } catch (err) {
      console.error(err);
    }
  }

  function shuffle(array) {
    for (var i = array.length - 1; i > 0; i -= 1) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = array[i];
      array[i] = array[j];
      array[j] = tmp;
    }
    return array;
  }

  /* ===== ICONS ===== */
  window.ICONS = {
    MARVEL:
      "<svg viewBox='0 0 64 64' xmlns='http://www.w3.org/2000/svg'><rect x='8' y='18' width='48' height='28' rx='4' fill='#ff4d6d'/><text x='32' y='39' fill='white' font-size='14' font-weight='800' text-anchor='middle' font-family='system-ui'>MARVEL</text></svg>",
    FORTNITE:
      "<svg viewBox='0 0 64 64' xmlns='http://www.w3.org/2000/svg'><path d='M10 30h44' stroke='#8ff2ff' stroke-width='4'/><path d='M12 40h40' stroke='#3fd0ff' stroke-width='3'/><circle cx='22' cy='24' r='4' fill='#8ff2ff'/><circle cx='32' cy='24' r='4' fill='#ff4d6d'/><circle cx='42' cy='24' r='4' fill='#ffd166'/></svg>",
    SURVIVAL:
      "<svg viewBox='0 0 64 64' xmlns='http://www.w3.org/2000/svg'><path d='M12 50 L32 14 L52 50 Z' fill='#ffd166'/><rect x='28' y='40' width='8' height='10' fill='#704c2a'/></svg>",
    PHYSIK:
      "<svg viewBox='0 0 64 64' xmlns='http://www.w3.org/2000/svg'><path d='M16 40 Q32 10 48 40' stroke='#8ff2ff' stroke-width='3' fill='none'/><circle cx='16' cy='40' r='3' fill='#8ff2ff'/><circle cx='48' cy='40' r='3' fill='#8ff2ff'/></svg>",
    MATHEMATIK:
      "<svg viewBox='0 0 64 64' xmlns='http://www.w3.org/2000/svg'><text x='16' y='28' font-size='18' fill='#8ff2ff'>7×8</text><text x='16' y='50' font-size='18' fill='#ffd166'>= ?</text></svg>",
    PS5:
      "<svg viewBox='0 0 64 64' xmlns='http://www.w3.org/2000/svg'><path d='M10 30h45' stroke='#8ff2ff' stroke-width='4'/><path d='M12 40h40' stroke='#3fd0ff' stroke-width='3'/><circle cx='22' cy='24' r='4' fill='#8ff2ff'/><circle cx='32' cy='24' r='4' fill='#ff4d6d'/><circle cx='42' cy='24' r='4' fill='#ffd166'/></svg>",
    SHELDON:
      "<svg viewBox='0 0 64 64' xmlns='http://www.w3.org/2000/svg'><circle cx='32' cy='24' r='10' fill='#ffd166'/><rect x='22' y='32' width='20' height='16' fill='#3fd0ff'/><text x='32' y='58' fill='#8ff2ff' font-size='10' text-anchor='middle'>BAZINGA</text></svg>",
    WOODWALKERS:
      "<svg viewBox='0 0 64 64' xmlns='http://www.w3.org/2000/svg'><circle cx='20' cy='24' r='10' fill='#8ff2ff'/><circle cx='44' cy='24' r='10' fill='#ffd166'/><path d='M20 34 C24 42 40 42 44 34' stroke='#8ff2ff' fill='none' stroke-width='3'/></svg>",
    'STAR WARS':
      "<svg viewBox='0 0 64 64' xmlns='http://www.w3.org/2000/svg'><path d='M8 40 h48 l-12 -12 h-24 z' fill='#ffd166'/><circle cx='44' cy='20' r='4' fill='#ff4d6d'/></svg>"
  };

  /* ===== TOPICS + QUESTIONS ===== */
  window.TOPICS = [
    'MARVEL',
    'FORTNITE',
    'SURVIVAL',
    'PHYSIK',
    'MATHEMATIK',
    'PS5',
    'SHELDON',
    'WOODWALKERS',
    'STAR WARS'
  ];

  function enrich(topic, list) {
    return list.map(function (row, idx) {
      return {
        id: topic + '_' + (idx + 1),
        topic: topic,
        q: row.q,
        a: row.a.slice(0),
        c: row.c
      };
    });
  }

  var POOL = {};
  POOL.MARVEL = enrich('MARVEL', [
    { q: 'Welcher Avenger sagt den Satz „I am Iron Man“ als letzter im MCU?', a: ['Tony Stark', 'Steve Rogers', 'Thor', 'Nick Fury'], c: 0 },
    { q: 'Wie heißt Thors Hammer, den nur „Würdige“ heben können?', a: ['Gungnir', 'Stormbreaker', 'Mjölnir', 'Hofund'], c: 2 },
    { q: 'Welcher Infinity-Stein kontrolliert die Zeit?', a: ['Space Stone', 'Mind Stone', 'Time Stone', 'Reality Stone'], c: 2 },
    { q: 'Wer hebt in „Age of Ultron“ Mjölnir ganz problemlos an?', a: ['Hulk', 'Vision', 'War Machine', 'Hawkeye'], c: 1 },
    { q: 'Wie lautet der echte Name von Black Panther?', a: ['M’Baku', 'T’Chaka', 'T’Challa', 'N’Jadaka'], c: 2 },
    { q: 'In welchem Land versteckt sich Wakanda?', a: ['Südafrika', 'Äthiopien', 'Kenia', 'Fiktives Ostafrika'], c: 3 },
    { q: 'Wie heißt der Metallschild von Captain America?', a: ['Adamantium', 'Vibranium', 'Promethium', 'Uru'], c: 1 },
    { q: 'Welche Stadt wird in „Avengers“ (2012) angegriffen?', a: ['London', 'New York', 'Berlin', 'Tokio'], c: 1 },
    { q: 'Welche Farbe hat der Power Stone?', a: ['Rot', 'Lila', 'Gelb', 'Blau'], c: 1 },
    { q: 'Wer ist der Regisseur von „Guardians of the Galaxy“ (1)?', a: ['Taika Waititi', 'James Gunn', 'Jon Favreau', 'Ryan Coogler'], c: 1 },
    { q: 'Wie heißt der intergalaktische Kopfgeldjäger, der zu „I am Groot“ nur „I am Groot“ sagt?', a: ['Rocket', 'Groot', 'Drax', 'Yondu'], c: 1 },
    { q: 'Welcher Held war früher ein Herzchirurg?', a: ['Bruce Banner', 'Stephen Strange', 'Reed Richards', 'Hank Pym'], c: 1 },
    { q: 'Wie heißt Thanos’ Heimatplanet?', a: ['Titan', 'Xandar', 'Vormir', 'Knowhere'], c: 0 },
    { q: 'Wer bekommt in „Endgame“ den Schild von Cap?', a: ['Bucky', 'Sam', 'Peter', 'Rhodey'], c: 1 },
    { q: 'Welche Rüstung ermöglicht Tony Stark Nano-Forming?', a: ['Mark III', 'Mark V', 'Mark L', 'Mark LXXXV'], c: 3 }
  ]);
  POOL.FORTNITE = enrich('FORTNITE', [
    { q: 'Wie viele Spieler landen im klassischen Battle-Royale-Match?', a: ['50', '75', '100', '150'], c: 2 },
    { q: 'Wie heißt der schrumpfende Gefahrenbereich?', a: ['Nebel', 'Sturm', 'Rauch', 'Flut'], c: 1 },
    { q: 'Welche drei Baumaterialien gibt es im klassischen Modus?', a: ['Holz, Stein, Metall', 'Holz, Ziegel, Glas', 'Stein, Ton, Metall', 'Holz, Beton, Glas'], c: 0 },
    { q: 'Was zeigt „Victory Royale“ an?', a: ['Top-10 erreicht', 'Ein Team eliminiert', 'Erster Platz', 'Alle Kisten geöffnet'], c: 2 },
    { q: 'Wofür nutzt man „Emotes“?', a: ['Heilung', 'Ausdruck/Tanz', 'Schildaufbau', 'Tarnung'], c: 1 },
    { q: 'Welche Seltenheit ist typischerweise am höchsten?', a: ['Ungewöhnlich', 'Episch', 'Legendär', 'Gewöhnlich'], c: 2 },
    { q: 'Was bringt ein „Launch Pad“?', a: ['Heilung', 'Schild', 'Höhen-Boost zum Gleiten', 'Unsichtbarkeit'], c: 2 },
    { q: 'Welches Item gewährt Schildpunkte?', a: ['Mini-Tranks', 'Verbände', 'Fischstäbchen', 'Schockwellen-Granate'], c: 0 },
    { q: 'Was ist „Third Party“?', a: ['Materialien tauschen', 'Ein drittes Team greift zwei kämpfende Teams an', 'Emotes kombinieren', 'Storm tanken'], c: 1 },
    { q: 'Wozu dient der „Reboot-Bus“?', a: ['Zone verlangsamen', 'Teamkameraden wiederbeleben', 'Waffen upgraden', 'NPCs kaufen'], c: 1 },
    { q: 'Wie nennt man schnelles Bauen und Bearbeiten?', a: ['Fast-Edit', 'Sweating', 'Cranking 90s', 'Box-Wipe'], c: 2 },
    { q: 'Welcher Modus hat keine Builds?', a: ['Arena', 'Zero Build', 'LTMs', 'Creative'], c: 1 },
    { q: 'Welche Ressource brauchst du zum Upshield per „Big Pot“?', a: ['Munition', 'Goldbarren', 'Zeit', 'Materialien'], c: 2 },
    { q: 'Welche Taktik ist sicher in Endzone?', a: ['Offene Felder laufen', 'Hochbau ohne Deckung', 'Low-Ground mit Hard-Mats', 'AFK stehen'], c: 2 },
    { q: 'Was ist „Peeking“?', a: ['Komplett aus der Deckung springen', 'Kurz vorscope aus der Deckung', 'Waffen droppen', 'Fischen ohne Angel'], c: 1 }
  ]);
  POOL.SURVIVAL = enrich('SURVIVAL', [
    { q: 'Erste Priorität bei Kälte?', a: ['Essen', 'Wasser', 'Wärme/Unterkunft', 'Weglaufen'], c: 2 },
    { q: 'Welche Farbe signalisiert im Gebirge am besten?', a: ['Weiß', 'Schwarz', 'Signalorange', 'Dunkelgrün'], c: 2 },
    { q: 'Faustregel „Rule of Threes“: ohne Unterkunft bei Kälte überlebt man etwa…', a: ['3 Minuten', '3 Stunden', '3 Tage', '3 Wochen'], c: 1 },
    { q: 'Wasseraufbereitung am sichersten?', a: ['Durchsichttest', 'Abkochen', 'Geruchstest', 'Schütteln'], c: 1 },
    { q: 'Was ist ein „Bow Drill“?', a: ['Knoten', 'Wasserfilter', 'Feuerbohrer', 'Angelhaken'], c: 2 },
    { q: 'Welche Blasenbildung zeigt gefährliche Dehydrierung?', a: ['Keine', 'Kopfschmerz, dunkler Urin', 'Husten', 'Gähnen'], c: 1 },
    { q: 'Welche Signaleinheit ist international üblich?', a: ['1 Pfeifton = Hilfe', '3 Signale kurz', '5 lange', '2 kurz, 1 lang'], c: 1 },
    { q: 'Sicherstes Messerhandling?', a: ['In dich schneiden', 'Weg vom Körper schneiden', 'Sägen mit Druck zum Körper', 'In der Jacke offen tragen'], c: 1 },
    { q: 'Welche Notunterkunft baut man schnell mit Plane?', a: ['A-Frame', 'Iglu', 'Jurte', 'Baumhaus'], c: 0 },
    { q: 'Was ist „Hypothermie“?', a: ['Überhitzung', 'Unterkühlung', 'Höhenkrankheit', 'Sonnenstich'], c: 1 },
    { q: 'Was ersetzt Salzverlust am sinnvollsten?', a: ['Zucker', 'Elektrolytmix', 'Kaffee', 'Kohlensäure'], c: 1 },
    { q: 'Was ist ein „Bear Hang“?', a: ['Bärenruf', 'Nahrung baumeln, bärensicher', 'Schlafsacktechnik', 'Kletterknoten'], c: 1 },
    { q: 'Wichtiger Gedanke bei Erster Hilfe draußen?', a: ['Eigene Sicherheit zuerst', 'Rennen', 'Alles filmen', 'Zuerst Wasser trinken'], c: 0 },
    { q: 'Sonnenstand im Norden mittags?', a: ['Süden', 'Norden', 'Osten', 'Westen'], c: 0 },
    { q: 'Wovor schützt ein „Space Blanket“ primär?', a: ['Regen', 'Wärmeverlust', 'Insekten', 'Bären'], c: 1 }
  ]);
  POOL.PHYSIK = enrich('PHYSIK', [
    { q: 'Einheit der Kraft?', a: ['Joule', 'Watt', 'Newton', 'Pascal'], c: 2 },
    { q: 'Licht breitet sich im Vakuum mit ca. …', a: ['3 000 km/s', '30 000 km/s', '300 000 km/s', '3 000 000 km/s'], c: 2 },
    { q: 'Wie nennt man Energie der Bewegung?', a: ['Potentielle', 'Kinetische', 'Chemische', 'Elektrische'], c: 1 },
    { q: 'Welche Größe bleibt in geschlossenem System bei elastischem Stoß erhalten?', a: ['Impuls', 'Temperatur', 'Druck', 'Farbe'], c: 0 },
    { q: 'Hebelgesetz: Drehmoment = Kraft × …', a: ['Masse', 'Weg', 'Hebelarm', 'Zeit'], c: 2 },
    { q: 'Welche Strahlung hat die höchste Frequenz?', a: ['Infrarot', 'Ultraviolett', 'Radiowellen', 'Gammastrahlung'], c: 3 },
    { q: 'Supraleiter haben bei kritischer Temperatur…', a: ['Null Widerstand', 'Doppelte Spannung', 'Negativen Strom', 'Keine Elektronen'], c: 0 },
    { q: 'Was beschreibt Ohmsches Gesetz?', a: ['v = s/t', 'F = m·a', 'U = R·I', 'p·V = n·R·T'], c: 2 },
    { q: 'Warum sieht man Blitz vor Donner?', a: ['Schall schneller', 'Licht schneller', 'Blitz näher', 'Luft bremst Donner'], c: 1 },
    { q: 'In der Schwerelosigkeit ist die Masse…', a: ['Null', 'Gleich, Gewicht kleiner', 'Größer', 'Unbestimmt'], c: 1 },
    { q: 'Resonanz führt zu…', a: ['Dämpfung', 'Maximaler Amplitude bei Eigenfrequenz', 'Temperaturabfall', 'Druckanstieg'], c: 1 },
    { q: 'Linse, die bündelt?', a: ['Zerstreuungslinse', 'Sammellinse', 'Prisma', 'Filter'], c: 1 },
    { q: 'Wellenlänge steigt, Frequenz…', a: ['Steigt', 'Fällt', 'Bleibt', 'Wird komplex'], c: 1 },
    { q: 'Energieerhaltung gilt…', a: ['Nie', 'Nur auf der Erde', 'In abgeschlossenen Systemen', 'Nur bei Licht'], c: 2 },
    { q: 'Einheit elektrischer Arbeit?', a: ['Volt', 'Joule', 'Ampere', 'Ohm'], c: 1 }
  ]);
  POOL.MATHEMATIK = enrich('MATHEMATIK', [
    { q: 'Primzahl?', a: ['21', '23', '27', '33'], c: 1 },
    { q: 'Der Mittelwert von 4, 8, 10?', a: ['6', '7', '8', '9'], c: 2 },
    { q: '7! ist…', a: ['5040', '720', '120', '40320'], c: 0 },
    { q: 'Log10(1000) =', a: ['1', '2', '3', '4'], c: 2 },
    { q: 'Fläche eines Kreises: A =', a: ['2πr', 'πr²', 'πd', 'r²'], c: 1 },
    { q: 'Lösung von 2x + 5 = 17', a: ['4', '5', '6', '7'], c: 2 },
    { q: 'gcd(24, 36) =', a: ['6', '8', '12', '18'], c: 2 },
    { q: '2^10 =', a: ['256', '512', '1024', '2048'], c: 2 },
    { q: 'Wenn p(A)=0,4 und p(B)=0,5 unabhängig, p(A∩B)=', a: ['0,1', '0,2', '0,3', '0,4'], c: 1 },
    { q: 'Ableitung von x² ist', a: ['2x', 'x', '2', 'x³'], c: 0 },
    { q: 'Summe 1..n =', a: ['n²', 'n(n+1)/2', '2n', 'n!'], c: 1 },
    { q: '30% von 80 =', a: ['18', '20', '24', '26'], c: 2 },
    { q: 'Wenn a∥b, dann Wechselwinkel sind…', a: ['Ungleich', 'Komplementär', 'Gleich groß', 'Zufällig'], c: 2 },
    { q: 'Medianeigenschaft', a: ['Häufigster Wert', 'Durchschnitt', 'Mittlerer Wert der Sortierung', 'Spanne'], c: 2 },
    { q: 'Ein rechtwinkliges Dreieck mit Katheten 3 und 4 hat Hypotenuse', a: ['5', '6', '7', '√20'], c: 0 }
  ]);
  POOL.PS5 = enrich('PS5', [
    { q: 'Wie heißt der PS5-Controller?', a: ['DualShock 5', 'DualSense', 'Sixaxis', 'ProPad'], c: 1 },
    { q: 'Hauptvorteil der PS5-SSD?', a: ['Höhere Latenz', 'Extrem schnelle Ladezeiten', 'Mehr Akku', 'Bessere Blu-ray'], c: 1 },
    { q: 'Feature der Trigger?', a: ['Kapazitiv', 'Adaptiv mit Widerstand', 'Mechanisch fix', 'Ohne Rumble'], c: 1 },
    { q: '3D-Audio heißt bei Sony…', a: ['Atmos3D', 'Tempest', 'PulseX', 'Horizon'], c: 1 },
    { q: 'Welches Medium liest die Disc-Version?', a: ['DVD', 'CD', 'Ultra HD Blu-ray', 'Nur digital'], c: 2 },
    { q: 'Wie heißt der Ruhemodus?', a: ['Sleep', 'Rest Mode', 'Idle', 'Quiet'], c: 1 },
    { q: 'Welches Abo bündelt Online-Play und Bibliotheken?', a: ['PS Plus', 'PS Now', 'PS Network Gold', 'PS Core'], c: 0 },
    { q: 'Was ist „Game Help“?', a: ['Live-Chat', 'In-Game-Tipps als Karten/Clips', 'Automatische Saves', 'Streaming nur'], c: 1 },
    { q: 'Exklusivtitel-Ikone mit Axt?', a: ['Kratos', 'Nathan Drake', 'Jin Sakai', 'Aloy'], c: 0 },
    { q: 'M.2-Slot dient für…', a: ['RAM', 'NVMe-SSD-Erweiterung', 'GPU', 'Lüfter'], c: 1 },
    { q: '120 Hz braucht…', a: ['Passenden TV/Monitor', 'Kabelbinder', 'Externer Lüfter', 'Headset'], c: 0 },
    { q: 'Remote Play erlaubt…', a: ['PS5 ohne Internet', 'Spielen auf anderem Gerät per Stream', 'Mod-Install', 'BIOS-Zugriff'], c: 1 },
    { q: 'Haptisches Feedback bedeutet…', a: ['LED-Farben', 'Feine Vibrationen passend zum Spiel', 'Lautere Speaker', 'Adaptive Lüfter'], c: 1 },
    { q: 'Welche Schnittstelle für 4K/120?', a: ['HDMI 2.1', 'HDMI 1.4', 'DVI', 'VGA'], c: 0 },
    { q: '„Activity Cards“ zeigen…', a: ['Trophäenhandel', 'Direkten Level-Fortschritt und Sprünge', 'PSN-Chatlogs', 'Speicherverbrauch'], c: 1 }
  ]);
  POOL.SHELDON = enrich('SHELDON', [
    { q: 'Sheldons Lieblingsplatz auf der Couch heißt…', a: ['The Throne', 'The Spot', 'The Corner', 'The Cozy'], c: 1 },
    { q: 'Sheldons Fachgebiet zu Serienbeginn?', a: ['Astrophysik', 'Experimentelle Physik', 'Theoretische Physik', 'Ingenieurswesen'], c: 2 },
    { q: 'Sheldons Catchphrase?', a: ['Booyah', 'Bazinga', 'Bingo', 'Bazooka'], c: 1 },
    { q: 'Vertragsart mit Mitbewohner Leonard?', a: ['Gentlemen’s Pact', 'Roommate Agreement', 'Room Code', 'Friendship Charter'], c: 1 },
    { q: 'Was verabscheut Sheldon beim Essen?', a: ['Ungeplante Änderungen', 'Salz', 'Pfeffer', 'Nudeln'], c: 0 },
    { q: 'Welches Spiel wird häufig gespielt?', a: ['Schach', 'Halo/Online-Games', 'Fußballmanager', 'Bridge'], c: 1 },
    { q: 'Comic-Book-Store-Tag?', a: ['Montag', 'Mittwoch', 'Freitag', 'Sonntag'], c: 1 },
    { q: 'Sheldons „Feind“ anfangs?', a: ['Kripke', 'Stuart', 'Zack', 'Wil Wheaton'], c: 3 },
    { q: 'Sheldons Mutter ist…', a: ['Streng religiös', 'Pilotin', 'Geheimagentin', 'Rockstar'], c: 0 },
    { q: 'Sheldons Duschschema zeigt…', a: ['Flexibilität', 'Kontrolle und Routine', 'Sportlichkeit', 'Improvisation'], c: 1 },
    { q: 'Sheldons Lieblingszahl?', a: ['3', '7', '73', '137'], c: 2 },
    { q: 'Was ist „Fun with Flags“?', a: ['Podcast', 'Vlog über Flaggen', 'Stand-up', 'Radio'], c: 1 },
    { q: 'Sheldons Partnerin/Ehefrau?', a: ['Penny', 'Amy', 'Bernadette', 'Priya'], c: 1 },
    { q: 'Sheldons Notfallgetränk für kranke Penny?', a: ['Tee', 'Heiße Milch mit Honig', 'Kakao', 'Brühe'], c: 1 },
    { q: 'Sheldons Berufung auf Regeln nennt man…', a: ['Heuristik', 'Pedanterie', 'Kühnheit', 'Charisma'], c: 1 }
  ]);
  POOL.WOODWALKERS = enrich('WOODWALKERS', [
    { q: 'Wie heißen die Gestaltwandler in der Buchreihe?', a: ['Shifters', 'Woodwalkers', 'Skinchangers', 'Animorphs'], c: 1 },
    { q: 'Hauptfigur der ersten Staffel?', a: ['Tikaani', 'Carag', 'Holly', 'Brandon'], c: 1 },
    { q: 'Carags Tiergestalt ist ein…', a: ['Wolf', 'Puma', 'Luchs', 'Bär'], c: 1 },
    { q: 'Wie heißt die Schule?', a: ['River High', 'Clearwater High', 'Forest Academy', 'Pine Ridge'], c: 1 },
    { q: 'Autorin der Reihe?', a: ['Katja Brandis', 'Cornelia Funke', 'Margit Auer', 'Sabine Städing'], c: 0 },
    { q: 'Wer ist eine gute Heilerin?', a: ['Ella', 'Mrs. Calloway', 'Miss Clearwater', 'Mr. Bridger'], c: 2 },
    { q: 'Gegenspieler mit gefährlichen Plänen?', a: ['Andrew Milling', 'Mr. Hunter', 'Mr. Reed', 'Jay'], c: 0 },
    { q: 'Welche Freundschaften tragen das Team?', a: ['Carag–Tikaani–Holly', 'Carag–Penny–Howard', 'Brandon–Sheldon–Amy', 'Rey–Finn–Poe'], c: 0 },
    { q: 'Was ist für Woodwalkers riskant?', a: ['Zu lang in Menschengestalt', 'Zu oft die Gestalt wechseln ohne Erholung', 'In der Schule lesen', 'In der Stadt laufen'], c: 1 },
    { q: 'Welches Thema zieht sich durch?', a: ['Fußball', 'Identität und Zugehörigkeit', 'Raumfahrt', 'Küchenrezepte'], c: 1 },
    { q: 'Welche Tierart ist Tikaani?', a: ['Wolf', 'Fuchs', 'Elch', 'Rabe'], c: 0 },
    { q: 'Wer kann besonders gut spurenlesen?', a: ['Carag', 'Brandon', 'Frankie', 'Wing'], c: 0 },
    { q: 'Welches Land ist primärer Schauplatz?', a: ['Deutschland', 'USA', 'Kanada', 'Neuseeland'], c: 1 },
    { q: 'Was verrät einen Walker schnell?', a: ['Augenfarbe', 'Tierhafte Reflexe/Geruch', 'Schuhgröße', 'Handschrift'], c: 1 },
    { q: 'Worum geht es in vielen Konflikten?', a: ['Prüfungsnoten', 'Schutz der Tierwelt vs. Menschenwelt', 'Politik', 'Sportturniere'], c: 1 }
  ]);
  POOL['STAR WARS'] = enrich('STAR WARS', [
    { q: 'Wie heißt Hans Schiff?', a: ['Slave I', 'Millennium Falcon', 'X-Wing', 'TIE Advanced'], c: 1 },
    { q: 'Wie heißt „Baby Yoda“ wirklich?', a: ['Gogo', 'Grogu', 'Goru', 'Goku'], c: 1 },
    { q: 'Wer sagt „Ich bin dein Vater“?', a: ['Obi-Wan', 'Darth Vader', 'Palpatine', 'Kylo Ren'], c: 1 },
    { q: 'Planet mit zwei Sonnen?', a: ['Hoth', 'Tatooine', 'Endor', 'Naboo'], c: 1 },
    { q: 'Waffe der Jedi?', a: ['Phasenstrahler', 'Lichtschwert', 'Plasmagewehr', 'Schallklinge'], c: 1 },
    { q: 'Wer schießt zuerst in der ursprünglichen Cantina-Szene?', a: ['Greedo', 'Han', 'Beide gleichzeitig', 'Der Barkeeper'], c: 1 },
    { q: 'Wie heißt Lukes Schwester?', a: ['Rey', 'Leia', 'Padmé', 'Jyn'], c: 1 },
    { q: 'Druiden-Duo?', a: ['BB-8 & K-2SO', 'R2-D2 & C-3PO', 'IG-11 & HK-47', 'L3-37 & D-O'], c: 1 },
    { q: 'Klonkrieger stammen genetisch von…', a: ['Jango Fett', 'Boba Fett', 'Mace Windu', 'Qui-Gon'], c: 0 },
    { q: 'Wer ist der Imperator?', a: ['Dooku', 'Palpatine', 'Thrawn', 'Maul'], c: 1 },
    { q: 'Wie heißt der Orden der Machtnutzer auf der dunklen Seite?', a: ['Jedi', 'Sith', 'Mandalorianer', 'Hutts'], c: 1 },
    { q: 'Waffe des Todessterns?', a: ['Ionenkanone', 'Superlaser', 'Turbolaser', 'Fusionslanze'], c: 1 },
    { q: 'Welcher Jediritter war „Auserwählter“ laut Prophezeiung?', a: ['Luke', 'Anakin', 'Obi-Wan', 'Mace'], c: 1 },
    { q: 'Der Mandalorianer heißt mit Namen…', a: ['Boba', 'Din Djarin', 'Cobb Vanth', 'Paz Vizsla'], c: 1 },
    { q: 'Wer sagt „Do. Or do not. There is no try.“?', a: ['Obi-Wan', 'Yoda', 'Qui-Gon', 'Ahsoka'], c: 1 }
  ]);

  /* ===== Deck Auswahl ===== */
  window.pickDeck = function pickDeck(n) {
    n = Math.max(0, Math.min(n, 1000));
    var topics = window.TOPICS.slice(0);
    var topicCount = topics.length;
    if (topicCount === 0) {
      return [];
    }
    var base = Math.floor(n / topicCount);
    var remainder = n - base * topicCount;
    var required = {};
    for (var t = 0; t < topicCount; t += 1) {
      required[topics[t]] = base;
    }
    while (remainder > 0) {
      var topic = topics[Math.floor(Math.random() * topicCount)];
      required[topic] += 1;
      remainder -= 1;
    }

    var usedIds = Object.create(null);
    var usedTexts = Object.create(null);
    var deck = [];

    function drawForTopic(topic, amount) {
      if (!amount) {
        return;
      }
      var pool = (POOL[topic] || []).slice(0);
      shuffle(pool);
      for (var i = 0; i < pool.length && amount > 0; i += 1) {
        var question = pool[i];
        if (usedIds[question.id] || usedTexts[question.q]) {
          continue;
        }
        usedIds[question.id] = true;
        usedTexts[question.q] = true;
        deck.push({
          id: question.id,
          topic: question.topic,
          q: question.q,
          a: question.a.slice(0),
          c: question.c
        });
        amount -= 1;
      }
    }

    for (var iTopic = 0; iTopic < topics.length; iTopic += 1) {
      drawForTopic(topics[iTopic], required[topics[iTopic]]);
    }

    if (deck.length < n) {
      for (var fallbackIndex = 0; fallbackIndex < topics.length && deck.length < n; fallbackIndex += 1) {
        var fallbackPool = (POOL[topics[fallbackIndex]] || []).slice(0);
        for (var j = 0; j < fallbackPool.length && deck.length < n; j += 1) {
          var fallbackQuestion = fallbackPool[j];
          if (usedIds[fallbackQuestion.id] || usedTexts[fallbackQuestion.q]) {
            continue;
          }
          usedIds[fallbackQuestion.id] = true;
          usedTexts[fallbackQuestion.q] = true;
          deck.push({
            id: fallbackQuestion.id,
            topic: fallbackQuestion.topic,
            q: fallbackQuestion.q,
            a: fallbackQuestion.a.slice(0),
            c: fallbackQuestion.c
          });
        }
      }
    }

    shuffle(deck);
    return deck.slice(0, n);
  };

  /* ===== Modal / Calendar ===== */
  window.openQA = function openQA(question, day) {
    var modal = $('modal');
    if (!modal || !question) {
      return;
    }
    var title = $('mtitle');
    if (title) {
      title.textContent = 'Tür ' + day + ' · ' + question.topic;
    }
    var qtext = $('qtext');
    if (qtext) {
      qtext.textContent = question.q;
    }
    var answers = $('answers');
    if (answers) {
      answers.innerHTML = '';
      var locked = false;
      for (var i = 0; i < question.a.length; i += 1) {
        (function (idx) {
          var button = document.createElement('button');
          button.type = 'button';
          button.textContent = String.fromCharCode(65 + idx) + ') ' + question.a[idx];
          on(button, 'click', function () {
            if (locked) {
              return;
            }
            locked = true;
            var correct = idx === question.c;
            button.classList.add(correct ? 'correct' : 'wrong');
            if (!correct) {
              var children = answers.children;
              for (var j = 0; j < children.length; j += 1) {
                if (j === question.c) {
                  children[j].classList.add('correct');
                }
              }
            }
            setTimeout(function () {
              modal.setAttribute('aria-hidden', 'true');
            }, 900);
          });
          answers.appendChild(button);
        })(i);
      }
    }
    modal.setAttribute('aria-hidden', 'false');
  };

  on($('btnClose'), 'click', function () {
    var modal = $('modal');
    if (modal) {
      modal.setAttribute('aria-hidden', 'true');
    }
  });

  window.buildCalendar = function buildCalendar() {
    var calendar = $('calendar');
    if (!calendar) {
      return;
    }
    var deck = window.pickDeck(24);

    (function inspect() {
      var seenId = Object.create(null);
      var seenText = Object.create(null);
      var duplicatesId = false;
      var duplicatesText = false;
      var counts = {};
      for (var ti = 0; ti < window.TOPICS.length; ti += 1) {
        counts[window.TOPICS[ti]] = 0;
      }
      for (var idx = 0; idx < deck.length; idx += 1) {
        var question = deck[idx];
        counts[question.topic] += 1;
        if (seenId[question.id]) {
          duplicatesId = true;
        }
        if (seenText[question.q]) {
          duplicatesText = true;
        }
        seenId[question.id] = true;
        seenText[question.q] = true;
      }
      log(duplicatesId ? 'warn' : 'ok', duplicatesId ? 'Duplikate (ID)=JA' : 'Duplikate (ID)=NEIN');
      log(duplicatesText ? 'warn' : 'ok', duplicatesText ? 'Duplikate (Text)=JA' : 'Duplikate (Text)=NEIN');
      log('ok', 'Verteilung: ' + JSON.stringify(counts));
    })();

    calendar.innerHTML = '';
    var shuffleBtn = $('btnShuffle');
    if (shuffleBtn) {
      shuffleBtn.classList.remove('hidden');
    }
    var title = $('kalTitle');
    if (title) {
      title.style.visibility = 'visible';
    }

    for (var i = 0; i < deck.length; i += 1) {
      (function (idx) {
        var question = deck[idx];
        var door = document.createElement('div');
        door.className = 'door';
        door.setAttribute('data-idx', String(idx));

        var num = document.createElement('div');
        num.className = 'door__num';
        num.textContent = String(idx + 1);

        var label = document.createElement('div');
        label.className = 'door__label';
        label.textContent = question.topic;

        var icon = document.createElement('div');
        icon.className = 'door__icon';
        icon.innerHTML = window.ICONS[question.topic] || '';

        var leaf = document.createElement('div');
        leaf.className = 'door__leaf';

        door.appendChild(num);
        door.appendChild(label);
        door.appendChild(icon);
        door.appendChild(leaf);

        on(door, 'click', function () {
          door.classList.add('open');
          window.openQA(question, idx + 1);
        });

        calendar.appendChild(door);
      })(i);
    }
  };

  /* ===== Login ===== */
  function normaliseDob(value) {
    if (!value) {
      return null;
    }
    var trimmed = String(value).trim();
    var isoMatch = trimmed.match(/^([0-9]{4})-([0-9]{2})-([0-9]{2})$/);
    if (isoMatch) {
      return isoMatch[1] + '-' + isoMatch[2] + '-' + isoMatch[3];
    }
    var deMatch = trimmed.match(/^([0-9]{2})[.\/-]([0-9]{2})[.\/-]([0-9]{4})$/);
    if (deMatch) {
      return deMatch[3] + '-' + deMatch[2] + '-' + deMatch[1];
    }
    return null;
  }

  var REQUIRED_NAME = 'noah';
  var REQUIRED_DOB = '2012-06-19';

  function initCaptcha() {
    var capText = $('cap_text');
    if (!capText) {
      return;
    }
    var left = Math.floor(Math.random() * 9) + 1;
    var right = Math.floor(Math.random() * 9) + 1;
    capText.textContent = left + ' + ' + right + ' = ?';
  }

  function readCaptcha() {
    var text = ($('cap_text') && $('cap_text').textContent) || '';
    var match = text.match(/(\d+)\s*\+\s*(\d+)/);
    if (!match) {
      return null;
    }
    return Number(match[1]) + Number(match[2]);
  }

  on($('btn_start'), 'click', function () {
    var error = $('gate_err');
    if (error) {
      error.textContent = '';
    }
    var name = ($('in_name') && $('in_name').value) || '';
    var dob = ($('in_dob') && $('in_dob').value) || '';
    var captchaInput = ($('in_cap') && $('in_cap').value) || '';

    var normalisedName = name.trim().toLowerCase();
    var normalisedDob = normaliseDob(dob);
    var captchaValue = parseInt(captchaInput, 10);
    var expectedCaptcha = readCaptcha();

    if (!normalisedName) {
      if (error) {
        error.textContent = 'Name fehlt';
      }
      initCaptcha();
      return;
    }
    if (normalisedName !== REQUIRED_NAME) {
      if (error) {
        error.textContent = 'Falscher Name';
      }
      initCaptcha();
      return;
    }
    if (!normalisedDob) {
      if (error) {
        error.textContent = 'Geburtsdatum ungültig';
      }
      initCaptcha();
      return;
    }
    if (normalisedDob !== REQUIRED_DOB) {
      if (error) {
        error.textContent = 'Falsches Geburtsdatum';
      }
      initCaptcha();
      return;
    }
    if (isNaN(captchaValue) || expectedCaptcha === null) {
      if (error) {
        error.textContent = 'Captcha unvollständig';
      }
      initCaptcha();
      return;
    }
    if (captchaValue !== expectedCaptcha) {
      if (error) {
        error.textContent = 'Falsches Ergebnis';
      }
      initCaptcha();
      return;
    }

    var gate = $('gate');
    if (gate) {
      gate.style.visibility = 'hidden';
      gate.style.display = 'none';
    }
    window.buildCalendar();
  });

  on($('btnShuffle'), 'click', function () {
    var modal = $('modal');
    if (modal) {
      modal.setAttribute('aria-hidden', 'true');
    }
    window.buildCalendar();
  });

  document.addEventListener('DOMContentLoaded', function () {
    initCaptcha();
  });

  console.log('Kalender geladen');
})();
