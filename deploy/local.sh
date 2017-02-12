source deploy/util.sh
getProjectVersionFromPom
buildVariables
mkdir -p ~/$destfolder
cp $sourcezipfilepath ~/$destfolder/
cd ~
uniqueidforfilename=$(date +%s)
unzipZipFileAndReplace $uniqueidforfilename
chmod u+x /tmp/script_$uniqueidforfilename.sh
/tmp/script_$uniqueidforfilename.sh
    