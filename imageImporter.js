const fs = require('fs');
const ExifReader = require('exifreader');

const args = process.argv.slice(2);
if (args.length < 2) {
    console.log(`Mindestens 2 Argumente notwendig (args = ${args}): DEST_DIR SOURCE_DIRS ...`);
    process.exit(2);
}

const [destDir, ...sourceDirs] = args;

console.log('destination dir: ' + destDir);
console.log('source dirs    : ' + sourceDirs.join(', '));
console.log('');

for (sourceDir of sourceDirs) {

    if (isDir(sourceDir)) {

        console.log(sourceDir);

        fs.readdirSync(sourceDir).forEach(sourceFile => {

            if (isJpg(sourceFile)) {

                const sourceFilePath = sourceDir + '/' + sourceFile;
                const dateTime = exifDateTime(sourceFilePath);
                const date = dateTime.substring(0, 8)
                // console.log(dateTime);
                // console.log(date);


                const destDirWithDate = destDir + '/' + date;
                const destFilePath = destDirWithDate + '/' + dateTime + '.jpg';

                createDirIfNotExists(destDirWithDate)

                var errorMessage = '';

                if (!fs.existsSync(destFilePath)) {
                    fs.renameSync(sourceFilePath, destFilePath);
                } else {
                    errorMessage = '- NOT OK, Bild existiert bereits am Zielort!';
                }

                console.log(`- ${sourceFilePath} -> ${destFilePath} ${errorMessage}`);
            }

        });
    } else {
        console.log(`Warnung - Verzeichnis ${dir} nicht gefunden`)
    }
}

function isDir(path) {
    try {
        var stat = fs.lstatSync(path);
        return stat.isDirectory();
    } catch (e) {
        return false;
    }
}

function isJpg(file) {
    return file.toLowerCase().endsWith('jpg');
}

function exifDateTime(file) {
    const tags = ExifReader.load(fs.readFileSync(file));
    const dateTimeOriginal = tags['DateTimeOriginal'].description;
    const dateTimeFormatted = dateTimeOriginal.replace(/(\d\d):(\d\d):(\d\d) (\d\d):(\d\d):(\d\d)/, "$1$2$3-$4$5$6")
    return dateTimeFormatted;
}

async function extractExifData(image) {
    let output = await exifr.parse(image, ['DateTimeOriginal']);
    return output;
}

function createDirIfNotExists(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
}
