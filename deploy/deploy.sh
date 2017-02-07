source deploy/util.sh

deploy_to_hostname=$1
deploy_to_username=$2
projectversion=$3




buildVariables
createDirectoryOnServer
uploadZipFile
unzipZipFileAndreplacePlaceholders
