boxservice=boxservice || {};

boxservice.appconfig={
    box:{
          episode:{
                title:{
                      maxLength:150,
                      warningLength:25
                }
          }

    },
    bebox:{
      episode:{
        title:{
                  maxLength:150,
                  warningLength:25
        }
      }

    }


}
jQuery(document).ready(function ($) {


        boxservice.initForNewPage=function(){
            boxservice.util.resetScrollPaging();
            window.scrollTo(0,0);
        };

        boxservice.displayLoginWindow=function(){


                boxservice.globalInput.signout();
                // window.history.replaceState({}, "Box Media App", "/index.html");
                // if(window.path){
                //     window.path.location="/index.html";
                //
                // }
                // else{
                //     //window.path="/index.html";
                //     $(window).attr('location','/index.html')
                // }


            $("#loginUSerDialog").openModal({complete:boxservice.onLoginWindowClosed});
            boxservice.globalInput.connect();
        };
        boxservice.onLoginWindowClosed=function(){
            boxservice.globalInput.disconnect();
            var userinfo=boxservice.globalInput.getUserInfo();
            if(!boxservice.globalInput.isUserInfoValid(userinfo)){
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
                    boxservice.api.users.login(username,password).done(function(userinfo){
                             $("#nav-wrapper .signinorout a").html("Sign Out");
                             boxservice.globalInput.setUserInfo(userinfo);
                             $("#loginUSerDialog").closeModal();
                             boxservice.loadAppInfo();
                    }).fail(function(){
                             $("#nav-wrapper .signinorout a").html("Sign In");
                             boxservice.globalInput.signout();
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
               boxservice.router.setupTopMenu();
               boxservice.router.executeOnLoads();
               $(".button-collapse").sideNav();
               boxservice.util.finishWait();
               boxservice.globalInput.startRefreshLoginThread();

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


       boxservice.signinout=function(){
    	   boxservice.displayLoginWindow();
       };
       var userinfo=boxservice.globalInput.getUserInfo();
       if(boxservice.globalInput.isUserInfoValid(userinfo)){
          boxservice.loadAppInfo();
       }
       else{

           boxservice.displayLoginWindow();
       }


});
