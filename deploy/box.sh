git add . --all
git commit -m "development"
git push home
git checkout master
git merge develop
git push home
git tag -a $1 -m "release $1"
git checkout develop
ssh ec2-user@boxnetwork.co.uk 'cd bdocker && git pull origin'

