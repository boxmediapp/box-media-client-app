
getProjectSettings(){
  export artefcactbasename="box-media-client-app"
  export targetboxmediaclientdir=box-media-client-app/src/main/webapp
}

getProjectVersionFromPom(){
  projectversion=`grep -A 0 -B 2 "<packaging>" pom.xml  | grep version  | cut -d\> -f 2 | cut -d\< -f 1`
  export projectversion  
}
getArtefactName(){
  export artefactfilename="$artefcactbasename-$projectversion.zip"
  export sourceartefactpath="package/target/$artefactfilename"
  export targetartefactpath="$targetboxmediaclientdir/$artefactfilename"
}

executeScriptOnServer(){
   scp $1 $targetuser@$targetserver:boxmediadeployscript.sh   
   ssh $targetuser@$targetserver 'chmod u+x boxmediadeployscript.sh' 
   ssh $targetuser@$targetserver './boxmediadeployscript.sh'
   ssh $targetuser@$targetserver "rm boxmediadeployscript.sh"
}

createTargetDirectory(){
  echo "mkdir -p $targetboxmediaclientdir" > /tmp/preparedeployboxmediapp.sh
  executeScriptOnServer /tmp/preparedeployboxmediapp.sh
}

uploadArtefact(){
    scp $sourceartefactpath $targetuser@$targetserver:$targetartefactpath/
}

deploArtefact(){
  uploadArtefact()
  echo "cd $targetboxmediaclientdir" > /tmp/deployboxmediapp.sh
  echo "unzip -o $artefactfilename" >> /tmp/deployboxmediapp.sh
  echo "rm  $artefactfilename" >> /tmp/deployboxmediapp.sh
  echo sed -i -e "s,@@@version@@@,$projectversion,g" index.html >> /tmp/deployboxmediapp.sh
  executeScriptOnServer /tmp/deployboxmediapp.sh
}
  
 


