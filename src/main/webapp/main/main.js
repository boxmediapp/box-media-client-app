boxservice={};
var globalInputMessage=require("global-input-message");

jQuery(document).ready(function ($) {   
        boxservice.globalInput.init();
        
        
        
        boxservice.initForNewPage=function(){
            boxservice.util.resetScrollPaging();
            window.scrollTo(0,0);
        }; 
    
        boxservice.displayLoginWindow=function(){
            $("#loginUSerDialog").openModal({complete:boxservice.onLoginWindowClosed});
        };
        boxservice.onLoginWindowClosed=function(){
            boxservice.globalInput.disconnect();
            if(!boxservice.globalInput.isLoggedIn()){                
                boxservice.displayLoginWindow();
            }            
        }
        boxservice.onClickLogin=function(){
            boxservice.globalInput.disconnect();            		
            var username=$("#loginUSerDialog input[name=username]").val().trim();
            var password=$("#loginUSerDialog input[name=password]").val().trim();
            if(username.length>0 && password.length>0){
                    boxservice.api.users.signinUser(username,password).done(function(){
                                
                             $("#nav-wrapper .signinorout a").html("Sign Out");
                          
                             boxservice.globalInput.saveUsername(username);                          
                             boxservice.globalInput.savePassword(password);
                             $("#loginUSerDialog").closeModal();
                             boxservice.setupMenu();                             
                    }).fail(function(){
                        console.log("******failed login");
                             $("#nav-wrapper .signinorout a").html("Sign In");
                             boxservice.globalInput.saveUsername("");
                             boxservice.globalInput.savePassword("");                            
                    });
                    console.log("******about to  login");
            }            
            return false;
        }
        
        
        boxservice.setupMenu=function(){
            
                if(boxservice.checkAppInfo){
                    console.log("menu is alaready set up.......");
                    return;
                }
                else{
                    console.log("continue set up menu.......");
                }
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
		
	       boxservice.help=function(){
	    	   
	    	boxservice.util.page.load("help/main.html").done(function(htmlContent){                         
                    $("#content").html(htmlContent);
	    	});
	    	   
	       };
	       
		  boxservice.util.menu.setup({linkSelection:".navItem a",whenClicked:function(){
		      boxservice.initForNewPage();
		  }});
		  boxservice.loadAppInfo();
		   
		   
		   $(".button-collapse").sideNav();
		   
		   
		  
		  
	   };
	   
	   
	    
	   
	   $("#loginUSerDialog .login").click(function(){
	       boxservice.onClickLogin();		   
	   });
	   
	   $("#loginUSerDialog .username").keypress(function(e){
	       var key = e.which;
               if(key == 13)  // the enter key code
                {
                       $("#loginUSerDialog .password").focus();                               
                       return false;  
                }             
               
           });
	   $("#loginUSerDialog .password").keypress(function(e){
               var key = e.which;
               if(key == 13)  // the enter key code
                {
                       boxservice.onClickLogin();                               
                       return false;  
                }             
               
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
    	               boxservice.globalInput.saveUsername("");
    	               boxservice.globalInput.savePassword("");    			
    			 boxservice.api.users.signoutUser().done(function(){
    				   $("#nav-wrapper .signinorout a").html("Sign Out");				   
    			   }).fail(function(){
    				   $("#nav-wrapper .signinorout a").html("Sign In");			   
    			   });       
           }
    	  else{    		  
    	          boxservice.displayLoginWindow();
    		  	
    	      }
    	  	   
       };
      
       if(!boxservice.globalInput.isLoggedIn()){           
           boxservice.displayLoginWindow();
       }
       else{
           console.log("setting up menu");
           boxservice.setupMenu();
       }            
              

});



