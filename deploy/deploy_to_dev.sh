source deploy/prod.sh
echo "deploying the version 2.9.20-SNAPSHOT to davran@userver using the property file deploy/prod.sh (for replacement of the environment specific variables) ..."
deploy/deploy.sh userver davran 2.9.20-SNAPSHOT
