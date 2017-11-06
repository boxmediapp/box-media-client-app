source deploy/prod.sh
echo "deploying the version 3.0.7 to local@local using the property file deploy/prod.sh (for replacement of the environment specific variables) ..."
deploy/local.sh local local 3.0.7
