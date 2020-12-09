const fs = require('fs');
const path = require('path');
const exifReader = require('exifreader');

const args = pgmArgs();

if (args.length < 2) {
    console.log(`Mindestens 2 Argumente notwendig (args = ${args}): DEST_DIR SOURCE_DIRS ...`);
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

        fs.readdirSync(sourceDir).forEach(sourceFile => {

            if (isJpg(sourceFile)) {

                const sourceFilePath = sourceDir + '/' + sourceFile;

                const dateTime = exifDateTime(sourceFilePath);
                const date = dateTime.substring(0, 8);

                const destDirWithDate = destDir + '/' + date;
                const destFilePath = destDirWithDate + '/' + dateTime + '.jpg';

                createDirIfNotExists(destDirWithDate);

                const status = moveFileWithStatus(sourceFilePath, destFilePath);

                console.log(`- ${sourceFilePath} -> ${destFilePath} ${status}`);
            }

        });
    } else {
        console.log(`Warnung - Verzeichnis ${dir} nicht gefunden`);
    }
}

function moveFileWithStatus(sourceFilePath, destFilePath) {
    const status = !fs.existsSync(destFilePath) ? (
        fs.renameSync(sourceFilePath, destFilePath),
        '- OK'
    ) : '- NOT OK, Bild existiert bereits am Zielort!';

    return status;
}

function isDir(path) {
    try {
        return fs.lstatSync(path).isDirectory();
    } catch (e) {
        return false;
    }
}

function isJpg(file) {
    return file.toLowerCase().endsWith('jpg');
}

function exifDateTime(file) {
    const tags = exifReader.load(fs.readFileSync(file));
    const dateTimeOriginal = tags['DateTimeOriginal'].description;
    const dateTimeFormatted = dateTimeOriginal.replace(/(\d\d):(\d\d):(\d\d) (\d\d):(\d\d):(\d\d)/, "$1$2$3-$4$5$6");
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
