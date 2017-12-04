var boxservice=boxservice || {};
jQuery(document).ready(function ($) {
        boxservice.globalInput={
               key:"DecXC8bBdTI2FxhQV",
               api:require("global-input-message"),

                isLoggedIn:function(){
                  var cred=this.getCredentials();
                  return  cred.username && cred.password;
                },
                setCredentails:function(username, password){
                        if((!password) || (!password)){
                          username="";
                          password="";
                        }
                        if (typeof(Storage) !== "undefined") {
                                var cred={
                                      username,
                                      password,
                                      expiredOn:new Date().getTime()+36000000
                                };
                                var credString=JSON.stringify(cred);
                                var key=this.key;
                                var mediaCred=this.api.encrypt(credString,key);
                                localStorage.setItem('mediaCred', mediaCred);
                        }
                        boxservice.api.username=username;
                        boxservice.api.password=password;
                },
                getCredentials:function(){
                    if(boxservice.api.username && boxservice.api.password){
                         return {
                             username:boxservice.api.username,
                             password:boxservice.api.password
                         };
                    }
                    var credentials={
                      username:"",
                      password:""
                    };
                    if (typeof(Storage) !== "undefined") {
                            var imageCred=localStorage.getItem("mediaCred");
                            if(!imageCred){
                              return credentials;
                            }
                            var key=this.key;
                            var credString=this.api.decrypt(imageCred,key);
                            if(!credString){
                                return credentials;
                            }
                            var cred=JSON.parse(credString);
                            if( (!cred.username) || (!cred.password) || (!cred.expiredOn)){
                              return credentials;
                            }
                            var now=new Date().getTime();
                            if(now>=cred.expiredOn){
                              return credentials;
                            }
                            return cred;
                    }
                    else{
                        return credentials;
                    }
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
                                 form:{
                                   id:"fbElBJPSaDUrA6neN@"+window.location.hostname,
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
