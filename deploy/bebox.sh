git add . --all
git commit -m "development"
git push home
git checkout master
git merge develop
git push home
git checkout develop
ssh ec2-user@be.boxnetwork.co.uk 'cd box-media-client-app && git pull origin'





