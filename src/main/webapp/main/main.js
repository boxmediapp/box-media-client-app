boxservice={};


jQuery(document).ready(function ($) {   

	boxservice.setupMenu=function(){

		boxservice.checkAppInfo=function(){
			if(boxservice.appinfo){
				return;
			}
			boxservice.loadAppInfo();			
		};
		boxservice.loadAppInfo=function(){	   
			if((!boxservice.api) || (!boxservice.api.task)){
				console.error("loading error, failed to load api.js");
				boxservice.util.openDialog("failed to load the js file, try to reload again");
				return;
			}	
			boxservice.api.task.appinfo().done(function(appconfig){
					
				   $("#nav-wrapper .signinorout a").html("Sign Out");
				   boxservice.appinfo=appconfig;
				   console.log("******appinfo:"+JSON.stringify( boxservice.appinfo));
				   boxservice.appinfo.appconfig.recordLimit=parseInt(boxservice.appinfo.appconfig.recordLimit);
				   if(boxservice.appinfo && boxservice.appinfo.appconfig && boxservice.appinfo.appconfig.visibilityCategory){
					   $("body").addClass(boxservice.appinfo.appconfig.visibilityCategory);
				   }
				   boxservice.episode.show();
			   }).fail(function(err){				   
				   boxservice.util.finishWait();
				   boxservice.util.onError(err);
				   $("#nav-wrapper .signinorout a").html("Sign In");
				   
			   });       
      
		};
		
	       boxservice.help=function(htmlContent){
	    	   $("#content").html(htmlContent);
	       };
	       
		  boxservice.util.menu.setup(".navItem a");
		  boxservice.loadAppInfo();
		   
		   
		   $(".button-collapse").sideNav();
		   
		   
		  
		  
	   };
	   
	   boxservice.setupMenu();
	    
	   
	   $("#loginUSerDialog .login").click(function(){
		   var username=$("#loginUSerDialog input[name=username]").val().trim();
			var password=$("#loginUSerDialog input[name=password]").val().trim();
			if(username.length>0 && password.length>0){
				
				boxservice.api.users.signinUser(username,password).done(function(){
					 $("#nav-wrapper .signinorout a").html("Sign Out");
					 boxservice.api.username=username;
					 boxservice.api.password=password;
				}).fail(function(){
					 $("#nav-wrapper .signinorout a").html("Sign In");
					 boxservice.api.username=null;
					 boxservice.api.password=null;
					
				});
			}
			return false;
		   
	   });
	   
	   
	   
	   boxservice.checkUser=function(){	   
   		   boxservice.api.users.list().done(function(){
			   $("#nav-wrapper .signinorout a").html("Sign Out");				   
		   }).fail(function(){
			   $("#nav-wrapper .signinorout a").html("Sign In");			   
		   });       
     
       };
       
       
       boxservice.signinout=function(){
    	   if($("#nav-wrapper .signinorout a").html()=="Sign Out"){
    		   	 boxservice.api.username=null;
    			 boxservice.api.password=null;
    			 boxservice.api.users.signoutUser().done(function(){
    				   $("#nav-wrapper .signinorout a").html("Sign Out");				   
    			   }).fail(function(){
    				   $("#nav-wrapper .signinorout a").html("Sign In");			   
    			   });       
           }
    	  else{
    		  
    		  	$("#loginUSerDialog").openModal();
    		  	
    		}
    	  	   
       };


});



