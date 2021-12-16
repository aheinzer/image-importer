# image-importer 

## Beschreibung

image-importer verschiebt Bilder in ein ZIELVERZEICHNIS und legt diese dort chronologisch mit Datum und Zeit im Ordner- und Bildnamen ab.

Dadurch können Bilder aus mehrere Quellen und Geräten chronologisch sortiert an einem Ort abgelegt werden.

## Ablauf

- image-importer wird mit folgenden Parametern gestartet
  - 1 ZIELVERZEICHNIS (wo die Bilder hinkopiert werden sollen)
  - 1-n QUELLVERZEICHNISSEN (wo die zu verarbeitenden Bilder liegen)
- pro Quellverzeichnis wird jedes JPG-Bild verarbeitet
  - erst wird das Bild-Erstellungsdatum aus dem Bild ausgelesen (Exif-Daten)
  - dann wird pro Datum im ZIELVEREICHNIS ein Ordner angelegt im Format YYYYMMDD
  - dann wird das Bild vom QUELLVERZEICHNIS im ZIELVERZEICHNIS ins Unterverzeichnis YYYYMMDD verschoben
  - dann wird das Bild umbenannt mit Erstellungsdatum und -zeit im Format YYYYMMDD-HHMMSS.jpg
  - falls das Bild bereits im ZIELVERZEICHNIS existiert, so werden im Namen noch die aktuellen Millisekunden angehängt im Format YYYYMMDD-HHMMSS-SSS.jpg
  - pro Bild wird eine Ausgabe geloggt

## Voraussetzungen

- node mit npm sind installiert (https://nodejs.org)
- testen mit
  - `node -v` 
  - `npm v`

## Installation

```bash
npm install -g image-importer
```

## Start

```bash
image-importer $HOME/Tresors/Fotos/2021 $HOME/Desktop $HOME/Downloads
```