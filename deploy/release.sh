source deploy/util.sh

git add .
git commit -m "releasing"
mvn jgitflow:release-start
mvn jgitflow:release-finish
git checkout  master
getProjectVersionFromPom
git checkout develop

echo "source ~/box/box-secrets/prod.sh" > deploy/latest_to_dubuntu.sh
echo "deploy/deploy.sh dubuntu dilshat $projectversion" >> deploy/latest_to_dubuntu.sh


echo "source ~/box/box-secrets/prod.sh" > deploy/latest_to_dev.sh
echo "deploy/deploy.sh userver davran $projectversion" >> deploy/latest_to_dev.sh


echo "source ~/box/box-secrets/prod.sh" > deploy/latest_to_box.sh
echo "deploy/deploy.sh boxnetwork.co.uk ec2-user $projectversion" >> deploy/latest_to_box.sh

echo "source ~/box/box-secrets/prod.sh" > deploy/latest_to_bebox.sh
echo "deploy/deploy.sh be.boxnetwork.co.uk ec2-user $projectversion" >> deploy/latest_to_bebox.sh

chmod u+x deploy/*.sh




















