git add . --all
git commit -m "development"
git push origin
git checkout master
git merge develop
git push origin
git tag -a $1 -m "release $1"
git checkout develop
ssh ec2-user@boxnetwork.co.uk 'cd box-media-client-app && git pull origin'

