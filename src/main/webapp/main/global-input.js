jQuery(document).ready(function ($) {   
        boxservice.globalInput={
               key:"DecXC8bBdTI2FxhQV", 
               init: function(){
                           this.api=require("global-input-message");
                           var that=this;
                           $(".globalInputActivateButton").click(function(){
                               that.connect();
                               return false;
                           });
                           console.log("*********:globalinput");
                     },
                isLoggedIn(){
                        this.loadUsername() && this.loadPassword();                        
                },    
                saveUsername(username){
                    if (typeof(Storage) !== "undefined") {
                        localStorage.setItem("box.username",username);
                    }
                    else{
                        boxservice.api.username=username;
                    }
                 },
                 savePassword(password){
                     console.log("***password to save:"+password);
                     if (typeof(Storage) !== "undefined") {
                         if(!password){                             
                             localStorage.setItem("box.password","");                           
                         }
                         else{                                
                             var encrypted=this.api.encrypt(password,this.key);
                             console.log("***password encrupted:"+encrypted);
                             localStorage.setItem("box.password",encrypted);
                         }
                     }
                     else{
                         boxservice.api.password=password;
                     }                                              
                },
                
                loadUsername(){
                    if (typeof(Storage) !== "undefined") {
                        return localStorage.getItem("box.username");
                    }
                    else{
                        return boxservice.api.username;
                    }                    
                },
                loadPassword(){
                    if (typeof(Storage) !== "undefined") {
                        var password=localStorage.getItem("box.password");
                        console.log("password loaded:"+password);
                        if(!password){
                            return password;
                        }
                        
                        return  this.api.decrypt(password,this.key);
                    }
                    else{
                        return  boxservice.api.password;
                    }                    
                },
                
                disconnect:function(){
                              console.log("******** disconnected*****");
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
                             initData:Object.assign({},this.buildInitData()),
                             onSenderConnected:this.onSenderConnected.bind(this),
                             onSenderDisconnected:this.onSenderDisconnected.bind(this)
                         };
                         this.connector=this.api.createMessageConnector();
                         this.connector.connect(options);
                         $(".globalinputContainer").addClass("connected");
                         var codedata=this.connector.buildInputCodeData();
                         console.log("*****input code[["+codedata+"]]");
                         var qrcode = new QRCode("qrcode", {
                             text: codedata,
                             width: 300,
                             height: 300,
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
                 },
                 setPassword:function(password){
                     $("#loginUSerDialog .password").val(password);
                 },
                 login:function(){
                     console.log("trying to login now........");
                     $("#loginUSerDialog .login").click();
                 },
                 
                 buildInitData:function(){
                     return {
                         action:"input",
                         form:{
                           "title":"Box Media App Sign In",
                           fields:[{
                                     label:"Username",
                                     value:"",
                                     operations:{
                                         onInput:this.setUsername.bind(this)
                                     }

                                   },{
                                      label:"Password",
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
                     
                 },        
                
                 onSenderConnected:function(sender, senders){
                     console.log("******senders is connected***:");
                     $(".globalinputContainer").addClass("senderConnected");
                 },
                 onSenderDisconnected:function(sender, senders){
                     if(!senders.length){
                         $(".globalinputContainer").removeClass("senderConnected");
                     }
                 }
        }
        
        
        
        
});