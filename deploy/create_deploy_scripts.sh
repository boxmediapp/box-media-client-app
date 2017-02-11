source deploy/util.sh

createDeployScript dubuntu  $projectversion  deploy/prod.sh  dubuntu              dilshat
createDeployScript dev      $projectversion  deploy/prod.sh  userver              davran
createDeployScript box      $projectversion  deploy/prod.sh  boxnetwork.co.uk     ec2-user
createDeployScript bebox    $projectversion  deploy/prod.sh  be.boxnetwork.co.uk  ec2-user



