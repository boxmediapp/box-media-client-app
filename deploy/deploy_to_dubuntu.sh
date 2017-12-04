source deploy/prod.sh
echo "deploying the version 3.1.1 to dilshat@dubuntu using the property file deploy/prod.sh (for replacement of the environment specific variables) ..."
deploy/deploy.sh dubuntu dilshat 3.1.1
