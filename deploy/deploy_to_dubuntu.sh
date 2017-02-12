source deploy/prod.sh
echo "deploying the version 2.9.17-SNAPSHOT to dilshat@dubuntu using the property file deploy/prod.sh (for replacement of the environment specific variables) ..."
deploy/deploy.sh dubuntu dilshat 2.9.17-SNAPSHOT
