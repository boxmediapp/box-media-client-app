source deploy/util.sh
getProjectVersionFromPom
echo "deploying the version:$projectversion ....." 

deploy/deploy.sh dubuntu dilshat $projectversion


