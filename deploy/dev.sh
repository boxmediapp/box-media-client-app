source deploy/common.sh
getProjectSettings

getProjectVersionFromPom


echo "deploy/deploy.sh $devtargetserver $devtargetuser $projectversion" > deploy/latest_to_dev.sh
chmod u+x deploy/latest_to_dev.sh
 

