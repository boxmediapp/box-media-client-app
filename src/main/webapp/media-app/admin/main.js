jQuery(document).ready(function ($) {
	
	boxservice.admin={};
	boxservice.admin.users={};
	
	boxservice.admin.main=function(htmlContent){
	
		if(!htmlContent){			
			boxservice.util.page.load("admin/main.html").done(boxservice.admin.main).fail(boxservice.util.onError);
			return;
		}
		else{
			$("#content").html(htmlContent);
			$("#manageUser").click(function(){			
				boxservice.util.page.load("admin/manage-user.html").done(boxservice.admin.users.manage).fail(boxservice.util.onError);
			});
			$("#appConfig").click(function(){			
				boxservice.util.page.load("admin/app-config.html").done(boxservice.admin.config).fail(boxservice.util.onError);
			});
			$("#importFromBrightcove").click(function(){			
				boxservice.util.page.load("admin/import-from-bc.html").done(boxservice.admin.importFromBC).fail(boxservice.util.onError);
			});
			$("#reports").click(function(){
			    boxservice.util.page.load("admin/reports.html").done(function(htmlContent){
	                              boxservice.api.report.get().done(function(report){	                                 
	                                  htmlContent=boxservice.util.replaceVariables(htmlContent,report);	                                  
	                                  $("#content").html(htmlContent);	                                  
	                              }).fail(boxservice.util.onError);;
			        
			    }).fail(boxservice.util.onError);;
			});
			
			$("#adminTags").click(function(){			
					boxservice.admin.tags().done(function(){
					boxservice.admin.main();
				});
			});
			$("#adminCleintDevices").click(function(){                    
			    boxservice.admin.clientdevices.show({onBack:function(){
			        boxservice.admin.main();
			    }});			    
                        });
			
			$("#deliverSoundmouseSmurf").click(function(){
				boxservice.util.startWait();
				var mediaCommand={
						"command":"deliver_soundmouse_smurf_file"
				};
				boxservice.api.episode.soundMouseCommand(mediaCommand).done(function(){
					boxservice.util.finishWait();
					boxservice.util.openDialog("The delivery of the soudmouse smurf file is initiated");					
				}).fail(boxservice.util.onError);
			});
			
		       $("#advertisementSettings").click(function(){
		           boxservice.advertsettings.show({onBack:function(){
		               boxservice.admin.main();
		           }})
                            
                        });
		       
		       
		       $("#list1080Assets").click(function(){
		           
                           boxservice.util.startWait();
                           var mediaCommand={
                                           "command":"list_soundmouse_smurf_file"
                           };
                           boxservice.api.episode.soundMouseCommand(mediaCommand).done(function(){
                                   boxservice.util.finishWait();
                                   boxservice.util.openDialog("The delivery of the soudmouse smurf file is initiated");                                    
                           }).fail(boxservice.util.onError);
                       });
			
			
		}
		
	};
	
	boxservice.admin.importFromBC=function(htmlContent){		
		$("#content").html(htmlContent);
		boxservice.util.resetInput();
		boxservice.util.tooltip();
		$("#controllers .cancel").click(function () {			  
			  boxservice.admin.main();
		 });
		$("#controllers .import").click(function () {
			  var importContent=$("#importCSVContractMapping").val();
			  if(!importContent){
				  return;				  
			  }
			  importContent=importContent.trim();
			  if(!importContent){
				  return;				  
			  }
			  boxservice.util.startWait();
			  boxservice.api.bc.importcsv(importContent).done(function(content){
				  boxservice.util.finishWait();
				  if(!content){
					  boxservice.util.openDialog("Import successfull");
				  }
				  else{
					  boxservice.util.openDialog("<pre>"+content+"</pre>");
				  }
				  
				  boxservice.admin.main();
			  }).fail(boxservice.util.onError);
			  
		 });
	};
	
	boxservice.admin.config=function(htmlContent){
		//$("#content").html(boxservice.util.replaceVariables(htmlContent,boxservice.appinfo));
		$("#content").html(htmlContent);
		boxservice.admin.configFields=[{input:{selection:"#recordLimit"}, data:{value:["recordLimit"]}},
		                               {input:{selection:"#visibilityCategory"}, data:{value:["visibilityCategory"]}},		                               
		       	  		               {input:{selection:"#imagetemplateurl"}, data:{value:["imagetemplateurl"]}},
		       	  		               {input:{selection:"#brightcoveStatus"}, data:{value:["brightcoveStatus"], type:"boolean"}},
		       	  		               {input:{selection:"#convertImage"}, data:{value:["convertImage"], type:"boolean"}},
		       	  		               {input:{selection:"#sendUpdateToSoundMouse"}, data:{value:["sendUpdateToSoundMouse"], type:"boolean"}},
		       	  		               {input:{selection:"#s3videoURL"}, data:{value:["s3videoURL"]}},
		       	  		               {input:{selection:"#videoBucket"}, data:{value:["videoBucket"]}},
		       	  		               {input:{selection:"#awsRegion"}, data:{value:["awsRegion"]}},
		       	  		               {input:{selection:"#imageBucket"}, data:{value:["imageBucket"]}},
		       	  		               {input:{selection:"#imageMasterFolder"}, data:{value:["imageMasterFolder"]}},
		       	  		               {input:{selection:"#imagePublicFolder"}, data:{value:["imagePublicFolder"]}},
		       	  		               {input:{selection:"#imageUrlAliases"}, data:{value:["imageUrlAliases"]}},
		       	  		               {input:{selection:"#requiredFields"}, data:{value:["requiredFields"]}},
		       	  		               {input:{selection:"#autoYearsAvailability"}, data:{value:["autoYearsAvailability"]}},
		       	  		               {input:{selection:"#autoSetGeoAllowedCountries"}, data:{value:["autoSetGeoAllowedCountries"]}},
		       	  		               {input:{selection:"#autoSetContentType"}, data:{value:["autoSetContentType"]}},
		       	  		               {input:{selection:"#autoSetTxChannel"}, data:{value:["autoSetTxChannel"]}},
		       	  		               {input:{selection:"#autoSetPublishedStatus"}, data:{value:["autoSetPublishedStatus"]}},
		       	  		               {input:{selection:"#transcodeSourceBucket"}, data:{value:["transcodeSourceBucket"]}},
		       	  		               {input:{selection:"#transcodeDestFileNamePrefix"}, data:{value:["transcodeDestFileNamePrefix"]}},
		       	  		               {input:{selection:"#autoCreatePlaceHolder"}, data:{value:["autoCreatePlaceHolder"], type:"boolean"}},
		       	  		               {input:{selection:"#autoTranscode"}, data:{value:["autoTranscode"], type:"boolean"}},
		       	  		               {input:{selection:"#publishProgrammeInfo"}, data:{value:["publishProgrammeInfo"], type:"boolean"}},
		       	  		               {input:{selection:"#transcodeDestBucket"}, data:{value:["transcodeDestBucket"]}},		       	  		      
		       	  		               {input:{selection:"#s3imagesURL"}, data:{value:["s3imagesURL"]}}	       	  			       	  		               
		       	  		            ];
		boxservice.util.form.initInputFields(boxservice.appinfo.appconfig,boxservice.admin.configFields);
		boxservice.util.resetInput();
		boxservice.util.tooltip();
		
		
		
		var isDataNotConsistent=boxservice.util.form.valueHasChanged(boxservice.appinfo.appconfig,boxservice.admin.configFields);			  
		  if(isDataNotConsistent){
			  	 $("#controllers .save").hide();
			  	 $("#controllers .cancel").show();
	  			 boxservice.util.openDialog("The fields appears to be inconsistent, not editable:"+isDataNotConsistent);		  			
  			return;
  	     }
		  $("#controllers .save").hide();
		  $("#controllers .cancel").hide();
		  boxservice.admin.inputDirty=false;
		  boxservice.util.form.inputChangedCallback(boxservice.admin.configFields, function(){
			  boxservice.admin.inputDirty=true;
			  $("#controllers .save").show();
			  $("#controllers .cancel").show();
		  });
		  $("#controllers .cancel").click(function () {
			  boxservice.admin.inputDirty = false;
			  boxservice.admin.main();
		  });
		  
		  
		$("#controllers .save").click(function () {
			boxservice.admin.inputDirty = false;
			if (boxservice.util.form.valueHasChanged(boxservice.appinfo.appconfig, boxservice.admin.configFields)) {
				boxservice.util.startWait();
				boxservice.util.form.update(boxservice.appinfo.appconfig, boxservice.admin.configFields);				
				boxservice.admin.main();
			
				boxservice.api.task.updateappinfo(boxservice.appinfo).done(function () {
					boxservice.util.finishWait();
					boxservice.admin.main();
				}).fail(boxservice.util.onError);
			}
			else {

				boxservice.admin.main();
			}
		});

			
	
	
	};
	
	
	
	boxservice.admin.users.manage=function(htmlContent){
		$("#content").html(htmlContent);
		$("#addNewUserDialog .add").click(function(){
			var username=$("#newUserUsername").val().trim();
			var password=$("#newUserPassword").val().trim();
			if(username.length>0 && password.length>0){					
				var user={username:username, password:password, roles:"user"};
				boxservice.util.startWait();
				boxservice.api.users.create(user).done(function(){
					boxservice.util.finishWait();
					boxservice.admin.users.manage(htmlContent);
				});
			}
			return false;
		});
		
		boxservice.api.users.list().done(function(users){		
					boxservice.util.pageForEachRecord("admin/user-row.html",users,"#userlist").done(function(){
						$("#userlist .deleteUser").click(function(){
							var username=$(this).attr("href");				
							boxservice.api.users.deleteUser(username).done(function(){
								boxservice.admin.users.manage(htmlContent);
							});
							return false;
						});
						$("#userlist .changePassword").click(function(){
							$("#changePasswordDialog").openModal();
							var username=$(this).attr("href");				
							$("#usernameForChangePassword").val(username);
							boxservice.util.resetInput();
							return false;
						});														
					}).fail(boxservice.util.onError);			
					$("#changePasswordDialog .changePassword").click(function(){
						var username=$("#usernameForChangePassword").val();
						var password=$("#passwordForChangePassword").val();				
						var user={username:username, password:password};
							boxservice.api.users.updateUser(user);
						return false;	
					});
			
			
					$("#addNewUser").click(function(){				
						$("#addNewUserDialog").openModal();
						return false;
					});
			
		});
		
		
		
		
   };
   
  
   boxservice.admin.tags=function(originalDeferred){
	   var deferred = originalDeferred?originalDeferred:$.Deferred();
	   
	   
	   boxservice.util.page.load("admin/tags-editor.html").done(function(htmlContent){
	   		$("#content").html(htmlContent);
	   		$("#backButton").click(function(){deferred.resolve("back");});
	   		
	   		
			boxservice.api.tags.list().done(function(tags){
				if(tags.length==0){
					return;
				}
				 var tagobj=[];
				 for(var i=0;i<tags.length;i++){
					var t={tag: tags[i]};
					tagobj.push(t);
				 }
				 boxservice.util.pageForEachRecord("admin/tag-row.html",tagobj,".tagslist").done(function(){
					  $(".tagslist .delete").click(function(){
						 var tagToDelete=$(this).attr("value");						   
						   boxservice.api.tags.remove(tagToDelete).done(function(){
						   }).fail(boxservice.util.onError);
					  });
					  
				  });
				$("#addNewTag").click(function(){
					var newTag=$("#newtag").val();
					if(!newTag){
						return;
					}
					newTag=newTag.toLowerCase();
					var mediatag={name:newTag};
					boxservice.api.tags.add(mediatag).done(function(){
						
						
						if($(".tagslist .chip i[value='"+newTag+"']").length==0){
								boxservice.util.startWait();
								boxservice.util.page.load("admin/tag-row.html").done(function(ht){
									
									var t={tag:newTag };
									var pt=boxservice.util.replaceVariables(ht,t);
									$(".tagslist").append(pt);
									boxservice.util.finishWait();
								});
						}
						
					}).fail(boxservice.util.onError);
					
					
				});
				
				
			}).fail(boxservice.util.onError);
		   
	   
	   }).fail(boxservice.util.onError);
	   
	   
	   return deferred.promise();
		
   
   };
   
   
   
   boxservice.admin.clientdevices={
           show:function(opts){
               var that=this;
               if(!that.htmlContent){
                   boxservice.util.page.load("admin/clientdevices-editor.html").done(function(htmlContent){
                       that.htmlContent=htmlContent;
                       that.show(opts);
                   });
                   return;
               }
               $("#content").html(this.htmlContent);
               $("#backButton").click(function(){
                   if(opts.onBack){
                       opts.onBack();
                   }
                   return false;
               });
               
               $("#addNewDevice").click(function(){
                   var newDevice=$("#newdevice").val();
                   if(!newDevice){
                           return;
                   }
                   newDevice=newDevice.toLowerCase();
                   var device={name:newDevice};
                   boxservice.api.clientdevices.add(device).done(function(){
                           if($(".clientdevicelist .chip i[value='"+newDevice+"']").length==0){
                                           boxservice.util.startWait();
                                           boxservice.util.page.load("admin/device-row.html").done(function(ht){                                                                                                  
                                                   var pt=boxservice.util.replaceVariables(ht,device);
                                                   $(".clientdevicelist").append(pt);
                                                   boxservice.util.finishWait();
                                           });
                           }
                           
                   }).fail(boxservice.util.onError);
                   
                   
             });
               
               boxservice.api.clientdevices.list().done(function(devices){                                      
                   boxservice.util.pageForEachRecord("admin/device-row.html",devices,".clientdevicelist").done(function(){
                            $(".clientdevicelist .delete").click(function(){
                                   var deviceToDelete=$(this).attr("value");
                                     
                                     boxservice.api.clientdevices.remove(deviceToDelete).done(function(){
                                             console.log("deleted the devoce:"+deviceToDelete);
                                     }).fail(boxservice.util.onError);
                            });
                            
                    });
                   
               });
               
           }
           
   };  
	
     			  	
});



