git add . --all
git commit -m "development"
git push origin
git checkout master
git merge develop
git push origin
git checkout develop
ssh ec2-user@transcode.boxnetwork.co.uk 'cd box-media-client-app && git pull origin'





