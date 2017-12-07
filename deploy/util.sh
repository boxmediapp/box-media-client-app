getProjectVersionFromPom(){
  projectversion=`grep -A 0 -B 2 "<packaging>" pom.xml  | grep version  | cut -d\> -f 2 | cut -d\< -f 1`
  export projectversion
}

buildVariables(){
  export zipfilename="box-media-client-app-$projectversion.zip"
  export sourcezipfilepath="package/target/$zipfilename"
  export destfolder="bdocker/bnginx/var/www/html"
}


executeScript(){
   echo "executing the script $1 remotely  on  $deploy_to_username@$deploy_to_hostname "
   ssh $deploy_to_username@$deploy_to_hostname 'bash -s' < $1
   echo "remote execution completed"
}


createFolders(){
    uniqueidforfilename=$(date +%s)
    echo "creating the script for creating folder: /tmp/script_$uniqueidforfilename.sh"
    echo "mkdir -p $destfolder" > /tmp/script_$uniqueidforfilename.sh
    executeScript /tmp/script_$uniqueidforfilename.sh
}

uploadZipFile(){
    echo "executing :scp $sourcezipfilepath $deploy_to_username@$deploy_to_hostname:$destfolder/"
    scp $sourcezipfilepath $deploy_to_username@$deploy_to_hostname:$destfolder/
}


unzipZipFile(){
      uniqueidforfilename=$(date +%s)
      unzipZipFileAndReplace $uniqueidforfilename
      executeScript /tmp/script_$uniqueidforfilename.sh
}

unzipZipFileAndReplace(){
      uniqueidforfilename=$1
      echo "creating the install script:/tmp/script_$uniqueidforfilename.sh"
      echo "cd $destfolder" > /tmp/script_$uniqueidforfilename.sh
      echo "unzip -o $zipfilename" >> /tmp/script_$uniqueidforfilename.sh

      echo  'sed -i -e "s,@@@version@@@,'$projectversion',g" media-app/index.html ' >> /tmp/script_$uniqueidforfilename.sh
}

createDeployScript(){
    echo "source $3" > deploy/deploy_to_$1.sh
    echo 'echo "deploying the version '$2' to '$5'@'$4' using the property file '$3' (for replacement of the environment specific variables) ..."' >>  deploy/deploy_to_$1.sh
    echo "deploy/deploy.sh $4 $5 $2" >> deploy/deploy_to_$1.sh
    chmod u+x deploy/deploy_to_$1.sh
}
createLocalDeployScript(){
    echo "source $3" > deploy/deploy_to_$1.sh
    echo 'echo "deploying the version '$2' to '$5'@'$4' using the property file '$3' (for replacement of the environment specific variables) ..."' >>  deploy/deploy_to_$1.sh
    echo "deploy/local.sh $4 $5 $2" >> deploy/deploy_to_$1.sh
    chmod u+x deploy/deploy_to_$1.sh
}
