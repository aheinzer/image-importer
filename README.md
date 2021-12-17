# image-importer 

## Introduction

image-importer moves images to a TARGET DIRECTORY and stores them there chronologically with date and time in the folder and image name.

In this way, images from several SOURCE DIRECTORIES (and devices) can be stored chronologically sorted in one place.

## Process

- image-importer is started with the following parameters
  - 1-n SOURCE DIRECTORIES (where the images to be processed are located)
  - 1 DESTINATION DIRECTORY (where the images are to be moved to)
- each JPG image is processed per source directory
  - first the image creation date is read from the image (Exif data)
  - then a folder is created per date in the TARGET DIRECTORY in the format YYYYMMDD
  - then the image is moved from the SOURCE DIRECTORIES in the TARGET DIRECTORY to the subdirectory YYYYMMDD
  - then the image is renamed with creation date and time in the format YYYYMMDD-HHMMSS.jpg
  - if the image already exists in the TARGET DIRECTORY, the current milliseconds are added to the name in the format YYYYMMDD-HHMMSS-SSS.jpg
  - one output is logged per image

## Prerequisites

- node and npm are installed (https://nodejs.org)
- test with
  - `node -v` 
  - `npm v`

## Installation

```bash
npm install -g image-importer
```

## Usage

```bash
Usage: image-importer [options]

Options:
  -s, --source <dirs...>  source dirs with images to process
  -t, --target <dir>      target dir for processed images to move
  -h, --help              display help for command
```

## Example

Here the photos from the desktop + download folder are processed and moved to the photos folder.

```bash
john@macbook% node image-importer.js --source $HOME/Downloads $HOME/Desktop --target $HOME/Photos

+----------------+
| image-importer |
+----------------+

source dirs : /Users/john/Downloads, /Users/john/Desktop
target dir  : /Users/john/Photos

processing /Users/john/Downloads
- /Users/john/Downloads/20210106-102336.jpg -> /Users/john/Photos/20210106/20210106-102336.jpg
- /Users/john/Downloads/20210106-102420.jpg -> /Users/john/Photos/20210106/20210106-102420.jpg
- /Users/john/Downloads/20210106-102601.jpg -> /Users/john/Photos/20210106/20210106-102601.jpg
- /Users/john/Downloads/20210106-104425.jpg -> /Users/john/Photos/20210106/20210106-104425.jpg
- /Users/john/Downloads/20210106-141907.jpg -> /Users/john/Photos/20210106/20210106-141907.jpg
- /Users/john/Downloads/20210106-164916.jpg -> /Users/john/Photos/20210106/20210106-164916.jpg

processing /Users/john/Desktop
- /Users/john/Desktop/20210116-150916.jpg -> /Users/john/Photos/20210116/20210116-150916.jpg
- /Users/john/Desktop/20210116-151308.jpg -> /Users/john/Photos/20210116/20210116-151308.jpg
- /Users/john/Desktop/20210116-151331.jpg -> /Users/john/Photos/20210116/20210116-151331.jpg
```
