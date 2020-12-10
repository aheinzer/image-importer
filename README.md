# imageImporter

## Beschreibung

imageImporter verschiebt Bilder in ein ZIELVERZEICHNIS und legt diese dort chronologisch mit Datum und Zeit im Ordner- und Bildnamen ab.

Dadurch können Bilder aus mehrere Quellen und Geräten chronologisch sortiert an einem Ort abgelegt werden.

* imageImporter wird mit folgenden Parametern gestartet
  * 1 ZIELVERZEICHNIS (wo die Bilder hinkopiert werden sollen)
  * 1-n QUELLVERZEICHNISSEN (wo die zu verarbeitenden Bilder liegen)
* pro Quellverzeichnis wird jedes JPG-Bild verarbeitet
  * erst wird das Bild-Erstellungsdatum aus dem Bild ausgelesen (Exif-Daten)
  * dann wird pro Datum im ZIELVEREICHNIS ein Ordner angelegt im Format YYYYMMDD
  * dann wird das Bild vom QUELLVERZEICHNIS im ZIELVERZEICHNIS ins Unterverzeichnis YYYYMMDD verschoben
  * dann wird das Bild umbenannt mit Erstellungsdatum und -zeit im Format YYYYMMDD-HHMMSS.jpg
  * pro Bild wird eine Ausgabe geloggt

## Installation

```bash
# https://nodejs.org installieren

# Installation testen
node -v
npm v

# Dependencies runterladen
npm install

# startOnMac.command entsprechend anpassen (ZIEL- und QUELLVERZEICHNISSE)
```

## Start
```bash
# Import starten
./startOnMac.command
```
