source deploy/prod.sh
echo "deploying the version 3.2.1 to ec2-user@mediapp.iterativesolution.co.uk using the property file deploy/prod.sh (for replacement of the environment specific variables) ..."
deploy/deploy.sh mediapp.iterativesolution.co.uk ec2-user 3.2.1
