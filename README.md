# bdocker

This is a HTML5 single-page client component of the Box Media application.

Its server component is at:

           https://github.com/boxmediapp/box-mule-api
                           
 The steps for building and deploying the application to the server:
  
                
(1) Checkout the git repository:
 
          git clone  https://github.com/boxmediapp/box-media-client-app.git 

(2) Modify the script "deploy/create_deploy_scripts.sh" to add a new line

      createDeployScript <serverid>     $projectversion  deploy/prod.sh  <your-target-server-host-name>  <username-connecting-to-target-server>
     
where <serverid> can be any word that can uniquey identify your target server, so that you can identify the generated deployment script in the form of:

                deploy/deploy_to_<server-id>.sh
                
   
(3) Run a terminal and go into the project folder:
 
         cd box-media-client-app

(4) and then run the script to create the zip file
 
         build/package.sh

this will create a deployment zip file and  a configuration zip file. 

It also generates the deployment script in the form of "deploy/deploy_to_<server-id>.sh"

       
(5)Execute generated deployment script:

         build/deploy_to_<server-id>.sh
         
   this will deploy the application to the target server.
   
   