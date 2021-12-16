#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const exifReader = require('exifreader');

const imageSuffix = 'jpg';

const args = pgmArgs();

if (args.length < 2) {
  console.log(
    `Mindestens 2 Argumente notwendig (args = ${args}): DEST_DIR SOURCE_DIRS ...`
  );
  process.exit(2);
}

const [destDir, ...sourceDirs] = args;

console.log(`
${boxedTitle(pgmName())}

destination dir: ${destDir}
source dirs    : ${sourceDirs.join(', ')}
`);

for (sourceDir of sourceDirs) {
  if (isDir(sourceDir)) {
    console.log(sourceDir);

    fs.readdirSync(sourceDir)
      .filter((sourceFile) => isImage(sourceFile))
      .forEach((sourceFile) => {
        const sourceFilePath = sourceDir + '/' + sourceFile;

        var dateTime;
        try {
          dateTime = exifDateTime(sourceFilePath);
        } catch (e) {
          dateTime = new Date()
            .toJSON()
            .slice(0, 19)
            .replace(/-/g, '')
            .replace('T', '-')
            .replace(/:/g, '');
        }
        const date = dateTime.substring(0, 8);

        const destDirWithDate = destDir + '/' + date;
        const destFilePathWithoutSuffix = destDirWithDate + '/' + dateTime;

        createDirIfNotExists(destDirWithDate);

        const destFilePathOrError = moveFileWithStatus(
          sourceFilePath,
          destFilePathWithoutSuffix,
          imageSuffix
        );

        console.log(`- ${sourceFilePath} -> ${destFilePathOrError}`);
      });
  } else {
    console.log(`Warnung - Verzeichnis ${dir} nicht gefunden`);
  }
}

function moveFileWithStatus(
  sourceFilePath,
  destFilePathWithoutSuffix,
  imageSuffix
) {
  const destFilePath = destFilePathWithoutSuffix + '.' + imageSuffix;

  try {
    if (!fs.existsSync(destFilePath)) {
      fs.renameSync(sourceFilePath, destFilePath);
      return destFilePath;
    } else {
      const date = new Date();
      const milliseconds = date.getMilliseconds();
      const destFilePathWithMilliseconds =
        destFilePathWithoutSuffix + '-' + milliseconds + '.' + imageSuffix;
      fs.renameSync(sourceFilePath, destFilePathWithMilliseconds);
      return destFilePathWithMilliseconds;
    }
  } catch (e) {
    return e.message;
  }
}

function isDir(path) {
  try {
    return fs.lstatSync(path).isDirectory();
  } catch (e) {
    return false;
  }
}

function isImage(file) {
  return file.toLowerCase().endsWith(imageSuffix);
}

function exifDateTime(file) {
  const tags = exifReader.load(fs.readFileSync(file));
  const dateTimeOriginal = tags['DateTimeOriginal'].description;
  const dateTimeFormatted = dateTimeOriginal.replace(
    /(\d\d):(\d\d):(\d\d) (\d\d):(\d\d):(\d\d)/,
    '$1$2$3-$4$5$6'
  );

  return dateTimeFormatted;
}

function createDirIfNotExists(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
}

function pgmName() {
  return path.basename(__filename);
}

function pgmArgs() {
  return process.argv.slice(2);
}

function boxedTitle(title) {
  const len = title.length;

  const borderLine = `+${'-'.repeat(len + 2)}+`;
  const titleLine = `| ${title} |`;
  const boxedTitle = `${borderLine}\n${titleLine}\n${borderLine}`;

  return boxedTitle;
}
