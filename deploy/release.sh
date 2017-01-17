artefcactbasename="box-media-client-app"

mvn jgitflow:release-start
mvn jgitflow:release-finish







mvn checkout checkout master

projectversion=`grep -A 0 -B 2 "<packaging>" pom.xml  | grep version  | cut -d\> -f 2 | cut -d\< -f 1`
artefactfilename="$artefcactbasename-$projectversion.zip"

scp package/target/$artefactfilename davran@userver:box-deployments/










