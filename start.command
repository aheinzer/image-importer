cd `dirname $0`

./gradlew -Dorg.gradle.warning.mode=all shadowJar

echo
java -jar build/libs/ImageImporter-all.jar \
  /Users/armin/Downloads \
  /Users/armin/Pictures/2019

echo
read -p "Drücke [Enter/Return] um das Fenster zu schliessen..."
