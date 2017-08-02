createLocalFolders(){           
    mkdir -p ~/$destfolder        
}

copyZipFile(){         
    cp $sourcezipfilepath ~/$destfolder/    
}

localUnzipZipFileAndReplace(){      
      cd ~/$destfolder
      unzip -o $zipfilename          
      sed -i -e "s,@@@version@@@,$projectversion,g" index.html 
}


export projectversion="$3"
source deploy/util.sh

buildVariables

createLocalFolders
copyZipFile
localUnzipZipFileAndReplace
    