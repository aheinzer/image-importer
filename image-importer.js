#!/usr/bin/env node

import fs from 'fs';
import exifReader from 'exifreader';
import { Command } from 'commander/esm.mjs';

const { sourceDirs, targetDir } = processArgs(process.argv);
const imageSuffix = 'jpg';

console.log(`
${boxedTitle('image-importer')}

source dirs : ${sourceDirs.join(', ')}
target dir  : ${targetDir}
`);

for (let sourceDir of sourceDirs) {
  if (isDir(sourceDir)) {
    console.log('processing ' + sourceDir);

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

        const targetDirWithDate = targetDir + '/' + date;
        const targetFilePathWithoutSuffix = targetDirWithDate + '/' + dateTime;

        createDirIfNotExists(targetDirWithDate);

        const targetFilePathOrError = moveFileWithStatus(
          sourceFilePath,
          targetFilePathWithoutSuffix,
          imageSuffix
        );

        console.log(`- ${sourceFilePath} -> ${targetFilePathOrError}`);
      });
  } else {
    console.log(`Warning - Dir ${dir} not found`);
  }
  console.log('');
}

function processArgs(args) {
  const program = new Command();
  program
    .requiredOption(
      '-s, --source <dirs...>',
      'source dirs with images to process'
    )
    .requiredOption(
      '-t, --target <dir>',
      'target dir for processed images to move'
    )
    .parse(args);

  const options = program.opts();

  return {
    sourceDirs: options.source,
    targetDir: options.target,
  };
}

function moveFileWithStatus(
  sourceFilePath,
  targetFilePathWithoutSuffix,
  imageSuffix
) {
  const targetFilePath = targetFilePathWithoutSuffix + '.' + imageSuffix;

  try {
    if (!fs.existsSync(targetFilePath)) {
      fs.renameSync(sourceFilePath, targetFilePath);
      return targetFilePath;
    } else {
      const date = new Date();
      const milliseconds = date.getMilliseconds();
      const targetFilePathWithMilliseconds =
        targetFilePathWithoutSuffix + '-' + milliseconds + '.' + imageSuffix;
      fs.renameSync(sourceFilePath, targetFilePathWithMilliseconds);
      return targetFilePathWithMilliseconds;
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

function boxedTitle(title) {
  const len = title.length;

  const borderLine = `+${'-'.repeat(len + 2)}+`;
  const titleLine = `| ${title} |`;
  const boxedTitle = `${borderLine}\n${titleLine}\n${borderLine}`;

  return boxedTitle;
}
