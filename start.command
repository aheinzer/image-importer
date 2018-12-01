cd `dirname $0`

./gradlew -Dorg.gradle.warning.mode=all shadowJar

echo
java -jar build/libs/import-all.jar \
  /Users/armin/Downloads \
  /Users/armin/Pictures/2018

echo
read -p "Drücke [Enter/Return] um das Fenster zu schliessen..."
echo
