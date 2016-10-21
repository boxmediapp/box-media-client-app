# box-media-client-app
HTML5 single page client application for the box media app

It will be installed into the EC2 as part of the docker install.

You can also install into the S3 bucket and then front it with the CDN, and then you can use the maven to do release:

    mvn jgitflow:release-start
    mvn jgitflow:release-finish
    
 This will create a zip file containing the web application in the target directory.
 
  
    
    





    
