source deploy/common.sh
targetserver=$1
targetuser=$2
projectversion=$3
getProjectSettings
getArtefactName
createTargetDirectory
uploadArtefact
deployArtefact
