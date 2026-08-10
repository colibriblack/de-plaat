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

## Eigene Terminseiten

Der Kaurna-Cronin-Termin hat eine eigene Seite unter `termine/kaurna-cronin-2026.html`. Für größere Veranstaltungen kann später eine weitere HTML-Seite in diesem Ordner angelegt und zusätzlich in `data/events.json` verlinkt werden.

## Etappe 3 und 4

Die Seite enthält jetzt Grundlagen für bessere Auffindbarkeit und Kundenbindung: strukturierte Daten für Google, eine eigene Terminseite, Teilen per WhatsApp, Instagram-Link, Plaat-Post per E-Mail und einfache Anfragewege für Platten, Reservierungen, Vorbestellungen, Gutscheine und Tickets.

## Google-Grundlage

Die Seite enthält einfache Suchmaschinen-Daten im HTML, eine `robots.txt` und eine `sitemap.xml`. Wenn später eine eigene Domain verbunden wird, sollten die URLs dort auf die echte Domain angepasst werden.

## Bildquelle

Die verwendeten De-Plaat-Bilder wurden lokal bereitgestellt.
Fotos: © Bettina Hähner und Christian Rothe.
