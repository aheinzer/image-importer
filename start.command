cd `dirname $0`

clear
echo
time node ./imageImporter.js \
  $HOME/OneDrive/Fotos/2020 \
  $HOME/Desktop \
  $HOME/Downloads

echo
read -p "Drücke [Enter/Return] um das Fenster zu schliessen..."
echo
