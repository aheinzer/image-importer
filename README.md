# imageImporter

## Beschreibung

* imageImporter wird mit folgenden Parametern gestartet
  * 1 ZIELVERZEICHNIS (wo die Bilder hinkopiert werden sollen)
  * 1-n QUELLVERZEICHNISSEN (wo die zu verarbeitenden Bilder liegen)
* pro Quellverzeichnis wird jedes JPG-Bild verarbeitet
  * erst wird das Bild-Erstellungsdatum aus dem Bild ausgelesen (Exif-Daten)
  * dann wird pro Datum im ZIELVEREICHNIS ein Ordner angelegt im Format YYYYMMDD
  * dann wird das Bild vom QUELLVERZEICHNIS in das ZIELVERZEICHNIS verschoben
  * dann wird das Bild umbenannt mit Erstelungsdatum und Zeit im Format YYYYMMDD-HHMMSS.jpg
  * pro Bild wird eine Ausgabe geloggt

## Installation

```bash
# https://nodejs.org installieren

# Installation testen
node -v
npm v

# Dependencies runterladen
npm install

# start.command entsprechend anpassen (ZIEL- und QUELLVERZEICHNISSE)
```

## Start
```bash
# Import starten
./start.command
```