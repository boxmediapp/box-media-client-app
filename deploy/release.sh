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

git checkout develop

echo "deploy/deploy.sh $devtargetserver $devtargetuser $projectversion" > deploy/latest_to_dev.sh
chmod u+x deploy/latest_to_dev.sh

echo "deploy/deploy.sh $boxserver $boxuser $projectversion" > deploy/latest_to_box.sh
chmod u+x deploy/latest_to_box.sh

echo "deploy/deploy.sh $beboxserver $beboxuser $projectversion" > deploy/latest_to_bebox.sh
chmod u+x deploy/latest_to_bebox.sh











