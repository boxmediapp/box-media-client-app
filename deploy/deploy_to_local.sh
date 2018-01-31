source deploy/prod.sh
echo "deploying the version 4.0.4 to local@local using the property file deploy/prod.sh (for replacement of the environment specific variables) ..."
deploy/local.sh local local 4.0.4
