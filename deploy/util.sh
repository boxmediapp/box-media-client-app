getProjectVersionFromPom(){
  projectversion=`grep -A 0 -B 2 "<packaging>" pom.xml  | grep version  | cut -d\> -f 2 | cut -d\< -f 1`
  export projectversion  
}

buildVariables(){
  export zipfilename="box-media-client-app-$projectversion.zip"
  export sourcezipfilepath="package/target/$zipfilename"  
  export destfolder="bdocker/bnginx/var/www/html"   
}

  
executeScriptOnServer(){
   echo "executing the script $1 remotely  on  $deploy_to_username@$deploy_to_hostname "
   ssh $deploy_to_username@$deploy_to_hostname 'bash -s' < $1      
   echo "remote execution completed"   
}
  
  createDirectoryOnServer(){
    uniqueidforfilename=$(date +%s)
    echo "creating the script for creating folder: /tmp/script_$uniqueidforfilename.sh"   
    echo "mkdir -p $destfolder" > /tmp/script_$uniqueidforfilename.sh    
    executeScriptOnServer /tmp/script_$uniqueidforfilename.sh
}

uploadZipFile(){     
    echo "executing :scp $sourcezipfilepath $deploy_to_username@$deploy_to_hostname:$destfolder/"
    scp $sourcezipfilepath $deploy_to_username@$deploy_to_hostname:$destfolder/    
}


unzipZipFileAndreplacePlaceholders(){    
      uniqueidforfilename=$(date +%s)
      echo "creating the install script:/tmp/script_$uniqueidforfilename.sh"
      echo "cd $destfolder" > /tmp/script_$uniqueidforfilename.sh
      echo "unzip -o $zipfilename" >> /tmp/script_$uniqueidforfilename.sh    
    
    echo sed -i -e "s,@@@version@@@,$projectversion,g" index.html >> /tmp/deployboxmediapp.sh    
    echo  'sed -i -e "s,@@@projectversion@@@,'$projectversion',g" index.html >> index.html ' >> /tmp/script_$uniqueidforfilename.sh
    executeScriptOnServer /tmp/script_$uniqueidforfilename.sh 
}

  