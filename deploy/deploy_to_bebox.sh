source deploy/prod.sh
echo "deploying the version 3.0.4-SNAPSHOT to ec2-user@be.boxnetwork.co.uk using the property file deploy/prod.sh (for replacement of the environment specific variables) ..."
deploy/deploy.sh be.boxnetwork.co.uk ec2-user 3.0.4-SNAPSHOT
