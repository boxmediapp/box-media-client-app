source deploy/prod.sh
echo "deploying the version 4.3.0 to davran@userver using the property file deploy/prod.sh (for replacement of the environment specific variables) ..."
deploy/deploy.sh userver davran 4.3.0
