source deploy/prod.sh
echo "deploying the version 3.2.0-SNAPSHOT to local@local using the property file deploy/prod.sh (for replacement of the environment specific variables) ..."
deploy/local.sh local local 3.2.0-SNAPSHOT
