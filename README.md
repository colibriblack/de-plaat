# De Plaat Website

Statische erste Version der Website für das Vinyl Café De Plaat in Esens.

## Lokal ansehen

```bash
python3 -m http.server 8080
```

Dann im Browser `http://localhost:8080` öffnen.

## Container

Der Container baut einen kleinen Go-Webserver und liefert die statischen Dateien auf Port 8080 aus.

## Termine pflegen

Die sichtbaren Termine liegen zusätzlich in `data/events.json`. Für einen neuen Termin kann dort ein weiterer Eintrag ergänzt werden. Die Seite hat weiterhin eine statische Fallback-Anzeige, falls die Datei einmal nicht geladen werden kann.

## Aktuelle Inhalte pflegen

Der Bereich „Gerade bei De Plaat“ liegt in `data/current.json`. Dort können drei kurze Hinweise gepflegt werden, zum Beispiel neue Platten, Kuchen/Café-Bar oder Kunst/Kultur im Laden.

## Plattenempfehlungen pflegen

Der Bereich „Persönlich empfohlen“ liegt in `data/recommendations.json`. Dort können Fundstücke, Hörtipps oder Vorbestellungen gepflegt werden. Das ist die einfache Vorstufe für einen späteren kleinen, kuratierten Shop.

## Aquarelle und Fotografien pflegen

Die Bereiche „Aquarelle“ und „Fotografien“ werden aus `data/artworks.json` und `data/photographs.json` befüllt. Neue Bilder gehören in den Ordner `assets`; danach können Titel, Beschreibung, Bildpfad, Alternativtext und Status in der jeweiligen JSON-Datei ergänzt werden.

## Eigene Terminseiten

Der Kaurna-Cronin-Termin hat eine eigene Seite unter `termine/kaurna-cronin-2026.html`. Für größere Veranstaltungen kann später eine weitere HTML-Seite in diesem Ordner angelegt und zusätzlich in `data/events.json` verlinkt werden.

Der Wein-&-Vinyl-Abend hat eine eigene Seite unter `termine/wein-vinyl.html`. Dort steht die Idee „Aquarell als Eintrittskarte“ und eine kleine Speisen- und Getränkekarte als Entwurf. Preise, Datum und konkrete Weinauswahl können dort ergänzt werden, sobald sie feststehen.

## Etappe 3 und 4

Die Seite enthält jetzt Grundlagen für bessere Auffindbarkeit und Kundenbindung: strukturierte Daten für Google, eine eigene Terminseite, Teilen per WhatsApp, Instagram-Link, De Plaat Post per E-Mail und einfache Anfragewege für Platten, Reservierungen, Vorbestellungen, Gutscheine und Tickets.

## Google-Grundlage

Die Seite enthält einfache Suchmaschinen-Daten im HTML, eine `robots.txt` und eine `sitemap.xml`. Wenn später eine eigene Domain verbunden wird, sollten die URLs dort auf die echte Domain angepasst werden.

## Bildquelle

Die verwendeten De-Plaat-Bilder wurden lokal bereitgestellt.
Fotos: © Bettina Hähner und Christian Rothe.

## Interne Notizen

- Mitgliedschaften: Eine mögliche VUT-Mitgliedschaft später erst aufnehmen, wenn sie wirklich besteht. Dann dezent als Haltung zu unabhängiger Musikkultur erwähnen, nicht als große Auszeichnung.
- IHK nicht prominent auf der Website listen. Für die GmbH ist sie formal Pflicht und gehört höchstens in rechtliche/administrative Unterlagen, nicht in den sichtbaren Markenauftritt.
