targetserver=$1
targetuser=$2



artefcactbasename="box-media-client-app"
projectversion=`grep -A 0 -B 2 "<packaging>" pom.xml  | grep version  | cut -d\> -f 2 | cut -d\< -f 1`


targetboxmediaclientdir=box-media-client-app/src/main/webapp 

artefactfilename="$artefcactbasename-$projectversion.zip"

echo "mkdir -p $targetboxmediaclientdir" > /tmp/preparedeployboxmediapp.sh

scp /tmp/preparedeployboxmediapp.sh $targetuser@$targetserver:

ssh $targetuser@$targetserver 'chmod u+x preparedeployboxmediapp.sh'
ssh $targetuser@$targetserver './preparedeployboxmediapp.sh'


scp package/target/$artefactfilename $targetuser@$targetserver:$targetboxmediaclientdir/$artefactfilename


echo "cd $targetboxmediaclientdir" > /tmp/deployboxmediapp.sh
echo "unzip -o $artefactfilename" >> /tmp/deployboxmediapp.sh
echo "rm  $artefactfilename" >> /tmp/deployboxmediapp.sh
echo sed -i -e "s,@@@version@@@,$projectversion,g" index.html >> /tmp/deployboxmediapp.sh
scp /tmp/deployboxmediapp.sh $targetuser@$targetserver:
ssh $targetuser@$targetserver 'chmod u+x deployboxmediapp.sh'
ssh $targetuser@$targetserver './deployboxmediapp.sh'

