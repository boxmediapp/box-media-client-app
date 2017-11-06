source deploy/util.sh

createDeployScript dubuntu  $projectversion  deploy/prod.sh  dubuntu              dilshat
createDeployScript dev      $projectversion  deploy/prod.sh  userver              davran
createDeployScript box      $projectversion  deploy/prod.sh  mediapp.iterativesolution.co.uk     ec2-user
createDeployScript bebox    $projectversion  deploy/prod.sh  bemediaapp.iterativesolution.co.uk  ec2-user
createDeployScript image    $projectversion  deploy/prod.sh  image.boxnetwork.co.uk  ec2-user
createLocalDeployScript  local  $projectversion  deploy/prod.sh  local  local
