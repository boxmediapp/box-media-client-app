boxservice=boxservice || {};


jQuery(document).ready(function ($) {


        boxservice.initForNewPage=function(){
            boxservice.util.resetScrollPaging();
            window.scrollTo(0,0);
        };

        boxservice.displayLoginWindow=function(){
            $("#loginUSerDialog").openModal({complete:boxservice.onLoginWindowClosed});
            boxservice.globalInput.connect();
        };
        boxservice.onLoginWindowClosed=function(){
            boxservice.globalInput.disconnect();
            if(!boxservice.globalInput.isLoggedIn()){
                boxservice.displayLoginWindow();
            }
        };
        boxservice.setLoginErrorMessage=function(message){
          $("#loginErrorMessage").html(message);
        };
        boxservice.onClickLogin=function(){
            boxservice.globalInput.disconnect();
            var username=$("#loginUSerDialog input[name=username]").val().trim();
            var password=$("#loginUSerDialog input[name=password]").val().trim();
            if(username.length>0 && password.length>0){
                    boxservice.api.users.signinUser(username,password).done(function(){
                             $("#nav-wrapper .signinorout a").html("Sign Out");
                             boxservice.globalInput.setCredentails(username,password);
                             $("#loginUSerDialog").closeModal();
                             boxservice.setupMenu();
                    }).fail(function(){
                             $("#nav-wrapper .signinorout a").html("Sign In");
                             boxservice.globalInput.setCredentails("","");
                             boxservice.setLoginErrorMessage("Login Failed");
                             boxservice.globalInput.connect();
                    });

            }
            return false;
        }


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
               boxservice.router.init();
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

        boxservice.setupMenu=function(){
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
    	               boxservice.globalInput.setCredentails("","");
    			 boxservice.api.users.signoutUser().done(function(){
    				   $("#nav-wrapper .signinorout a").html("Sign Out");
               location.reload();
    			   }).fail(function(){
    				   $("#nav-wrapper .signinorout a").html("Sign In");
               location.reload();
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
           boxservice.setupMenu();
       }


});
