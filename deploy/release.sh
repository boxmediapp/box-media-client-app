git add .
git commit -m "releasing"
source deploy/common.sh

mvn jgitflow:release-start
mvn jgitflow:release-finish

git checkout  master

getProjectVersionFromPom
getProjectSettings
export targetboxmediaclientdir="$deploymentdir"
getArtefactName
targetuser=$devtargetuser
targetserver=$devtargetserver
uploadArtefact












