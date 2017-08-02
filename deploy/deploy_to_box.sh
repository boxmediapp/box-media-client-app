source deploy/prod.sh
echo "deploying the version 3.0.5-SNAPSHOT to ec2-user@boxnetwork.co.uk using the property file deploy/prod.sh (for replacement of the environment specific variables) ..."
deploy/deploy.sh boxnetwork.co.uk ec2-user 3.0.5-SNAPSHOT
