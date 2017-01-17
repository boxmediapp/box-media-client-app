targetserver=$1
targetuser=$2
projectversion=$3
source deploy/common.sh
getProjectSettings
getArtefactName
createTargetDirectory
uploadArtefact
deployArtefact
