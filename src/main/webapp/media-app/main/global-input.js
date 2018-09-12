var boxservice=boxservice || {};
jQuery(document).ready(function ($) {
        boxservice.globalInput={
               key:"BAkgDYjQQFoWIOsQG",
               api:require("global-input-message"),
               isUserInfoValid:function(userinfo){
                      if(  userinfo && userinfo.clientId && userinfo.clientSecret){
                            var expiresAt=userinfo.expiresAt;
                            var now=new Date();
                            if(now.getTime()>=expiresAt){
                              console.warn("user info is expired");
                              return false;
                            }
                            else{
                              return true;
                            }
                      }
                      else{
                        return false;
                      }
                    },
                setUserInfo:function(userinfo){
                        if(!userinfo){
                              localStorage.removeItem("mediaUser");
                              boxservice.api.userinfo={};
                        }
                        else if (typeof(Storage) !== "undefined") {
                            var userInfoString=JSON.stringify(userinfo);
                            var key=this.key;
                            var cred=this.api.encrypt(userInfoString,key);
                            localStorage.setItem('mediaUser', cred);
                            boxservice.api.userinfo=userinfo;
                        }
                        else{
                            boxservice.api.userinfo=userinfo;
                        }
                },
                signout:function(){
                    if(localStorage.getItem("mediaUser")){
                        var useinfo=this.getUserInfo();
                        if(useinfo){
                            boxservice.api.users.signoutUser();
                        }
                        localStorage.removeItem("mediaUser");
                        this.stopRefreshLoginThread();
                    }

                },
                getUserInfo:function(){
                    if(boxservice.api.userinfo){
                         return boxservice.api.userinfo;
                    }
                    if (typeof(Storage) !== "undefined") {
                            var userCred=localStorage.getItem("mediaUser");
                            if(!userCred){
                              return {};
                            }
                            var key=this.key;

                            try{
                                  var credString = this.api.decrypt(userCred,key);
                                  if(!credString){
                                      return {};
                                  }
                                  var userinfo=JSON.parse(credString);
                                  if(!userinfo){
                                    return {};
                                  }
                                  boxservice.api.userinfo= userinfo;
                                  return userinfo;
                              }
                              catch(error){
                                console.error("failed to parse the mediaUser:"+error);
                                return {};
                              }
                    }
                    else{
                        return {};
                    }
                },

                refreshExpiresOfUserInfo:function(userinfo){
                    var now=new Date();
                    userinfo.expiresAt=now.getTime()+userinfo.durationInSeconds*1000;
                    this.setUserInfo(userinfo);
                    console.log("userInfo expiration time is refreshed");
                },
                stopRefreshLoginThread:function(){
                    if(this.refreshLoginTimer){
                        clearInterval(this.refreshLoginTimer);
                        this.refreshLoginTimer=null;
                      }
                },
                startRefreshLoginThread:function(){
                      var userinfo=this.getUserInfo();
                      if(!this.isUserInfoValid(userinfo)){
                            return;
                      }
                      this.stopRefreshLoginThread();
                      if(!userinfo.durationInSeconds){
                        return;
                      }
                      if(userinfo.durationInSeconds<45){
                        return;
                      }
                      var refreshInterval=userinfo.durationInSeconds-30;
                      if(refreshInterval<0){
                        refreshInterval=30;
                      }
                      var that=this;
                      this.refreshLoginTimer=setInterval(function(){
                                    boxservice.api.users.refreshLogin(userinfo).done(function(respose){
                                        that.refreshExpiresOfUserInfo(userinfo);
                                    });
                        },refreshInterval*1000);
                },
                disconnect:function(){
                              if(this.connector){
                                  this.connector.disconnect();
                                  this.connector=null;
                               }
                              $(".globalinputContainer").removeClass("connected");
                              $(".globalinputContainer").removeClass("senderConnected");
                              $("#qrcode").empty();
                           },

                 connect:function(){

                         var options={
                             onSenderConnected:this.onSenderConnected.bind(this),
                             onSenderDisconnected:this.onSenderDisconnected.bind(this),
                             initData:{
                                 action:"input",
                                 dataType:"form",
                                 form:{
                                   id:"###username###@boxmediaapp",
                                   label:"boxmediaapp",
                                   title:"Box Media App Sign In",
                                   fields:[{
                                             label:"Username",
                                             id:"username",
                                             value:"",
                                             operations:{
                                                 onInput:this.setUsername.bind(this)
                                             }

                                           },{
                                              label:"Password",
                                              id:"password",
                                              type:"secret",
                                              operations:{
                                                onInput:this.setPassword.bind(this)
                                              }

                                           },{
                                              label:"Login",
                                              type:"button",
                                              operations:{
                                                 onInput:this.login.bind(this)
                                              }

                                           }]
                                       }
                                 }

                         };
                         this.connector=this.api.createMessageConnector();
                         this.connector.connect(options);
                         $(".globalinputContainer").addClass("connected");
                         var codedata=this.connector.buildInputCodeData();
                         var qrcode = new QRCode("qrcode", {
                             text: codedata,
                             width: 350,
                             height: 360,
                             colorDark : "#000000",
                             colorLight : "#ffffff",
                             correctLevel : QRCode.CorrectLevel.H
                         });
                 },
                 onSenderConnected:function(){

                 },
                 onSenderDisconnected:function(){

                 },
                 setUsername:function(username){
                     $("#loginUSerDialog .username").val(username);
                     boxservice.util.resetInput();
                 },
                 setPassword:function(password){
                     $("#loginUSerDialog .password").val(password);
                     boxservice.util.resetInput();
                 },
                 login:function(){
                     $("#loginUSerDialog .login").click();
                 },



                 onSenderConnected:function(sender, senders){
                     $(".globalinputContainer").addClass("senderConnected");
                 },
                 onSenderDisconnected:function(sender, senders){
                     if(!senders.length){
                         $(".globalinputContainer").removeClass("senderConnected");
                     }
                 }
        };





});
