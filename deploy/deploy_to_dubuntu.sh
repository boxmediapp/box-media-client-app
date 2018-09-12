source deploy/prod.sh
echo "deploying the version 4.3.0-SNAPSHOT to dilshat@dubuntu using the property file deploy/prod.sh (for replacement of the environment specific variables) ..."
deploy/deploy.sh dubuntu dilshat 4.3.0-SNAPSHOT
