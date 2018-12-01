//------------------------------------------------------------------------
// Armin Heinzer, 01.12.2018
//------------------------------------------------------------------------

package ch.heinzer.import

// https://code.google.com/p/metadata-extractor/
import com.drew.imaging.ImageMetadataReader
import com.github.ajalt.clikt.core.CliktCommand
import com.github.ajalt.clikt.parameters.arguments.argument
import com.github.ajalt.clikt.parameters.arguments.multiple
import com.github.ajalt.clikt.parameters.types.file
import java.io.File
import java.nio.file.Files
import java.nio.file.Paths
import java.text.SimpleDateFormat
import java.util.Date

fun main(args: Array<String>) = Import().main(args)

class Import : CliktCommand(help = "Import SOURCE to DEST, or multiple SOURCE(s) to directory DEST.") {

    private val source by argument().file(exists = true).multiple()
    private val dest by argument().file()

    override fun run() {

        source.forEach { sourceDir ->

            if (sourceDir.exists() && sourceDir.isDirectory) {

                printAsTitle(sourceDir.toString())

                sourceDir.listFiles().filter { it.isFile }.filter { it.name.toLowerCase().endsWith(".jpg") }
                    .forEach { photo ->

                        val suffix = photo.name.toLowerCase().split('.').last()

                        val exif = ImageMetadataReader.readMetadata(photo)
                        exif.directories.filter { it.name == "Exif SubIFD" }.forEach { directory ->

                            directory.tags.filter { it.tagName == "Date/Time Original" }.forEach { tag ->

                                val (creationDate, creationTime) = tag.description.replace(":", "").split(" ")

                                val destinationSubDir = File("$dest/$creationDate")
                                destinationSubDir.mkdirs()

                                val newPhotoPath = "${destinationSubDir.path}/$creationDate-$creationTime.$suffix"

                                try {
                                    copyImage(photo.path, newPhotoPath)
                                } catch (e1: java.nio.file.FileAlreadyExistsException) {
                                    val formatterMillis = SimpleDateFormat("SSS")
                                    val newPhotoPathWithMillis = newPhotoPath
                                        .replace(".$suffix", "-${formatterMillis.format(Date())}.$suffix")
                                    try {
                                        copyImage(photo.path, newPhotoPathWithMillis)
                                    } catch (e2: Exception) {
                                        println("NICHT kopiert ${photo.name} ==> $newPhotoPathWithMillis")
                                    }
                                }
                            }
                        }
                    }
            }
        }
        println("\nFertig!\n")
    }
}


fun printAsTitle(text: String) {
    val border = "+-${"-".repeat(text.length)}-+"
    println(border)
    println("| $text |")
    println(border)
}

fun copyImage(from: String, to: String) {
    Files.copy(Paths.get(from), Paths.get(to))
    println("kopiert $from\n     -> $to")
}

