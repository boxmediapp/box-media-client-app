source deploy/prod.sh
echo "deploying the version 3.2.3 to ec2-user@bemediaapp.iterativesolution.co.uk using the property file deploy/prod.sh (for replacement of the environment specific variables) ..."
deploy/deploy.sh bemediaapp.iterativesolution.co.uk ec2-user 3.2.3
