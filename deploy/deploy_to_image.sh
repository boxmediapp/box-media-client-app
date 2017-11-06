source deploy/prod.sh
echo "deploying the version 3.0.6 to ec2-user@image.boxnetwork.co.uk using the property file deploy/prod.sh (for replacement of the environment specific variables) ..."
deploy/deploy.sh image.boxnetwork.co.uk ec2-user 3.0.6
