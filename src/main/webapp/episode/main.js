jQuery(document).ready(function ($) {
   if(!boxservice.episode){
		boxservice.episode={};
	}
	boxservice.episode.reload=function(){		
	       boxservice.episode.loadEpisodeList();
	};
	boxservice.episode.loadEditEpisodePage=function(){    	    
    	return boxservice.util.page.load("episode/edit.html");   	
    };
    boxservice.episode.getPublishedClassName=function(status){    	
	    	  return "published_"+status;    	  	          	
    };
    boxservice.episode.getAvailabilityClassName=function(status){    	
  	  return    "availability_"+status;    	  	          	
    };
    boxservice.episode.getRequiredFieldStatusClassName=function(status){    	
    	  return    "requiredFieldsStatus_"+status;    	  	          	
      };
    
          
      
      
    boxservice.episode.setPublishedClassName=function(statusContainer,publishedStatus){    	
    	  statusContainer.removeClass(boxservice.episode.getPublishedClassName("ACTIVE"));
    	  statusContainer.removeClass(boxservice.episode.getPublishedClassName("INACTIVE"));
    	  statusContainer.removeClass(boxservice.episode.getPublishedClassName("NOT_APPROVED"));
    	  statusContainer.removeClass(boxservice.episode.getPublishedClassName("APPROVED"));
    	  statusContainer.removeClass(boxservice.episode.getPublishedClassName("IN_PROGRESS"));
    	  if(publishedStatus){
    		  statusContainer.addClass(boxservice.episode.getPublishedClassName(publishedStatus));
    	  }
    };
    boxservice.episode.setAvailabilityClassName=function(statusContainer,availabilityStatus){    	
  	  statusContainer.removeClass(boxservice.episode.getAvailabilityClassName("AVAILABLE"));
  	  statusContainer.removeClass(boxservice.episode.getAvailabilityClassName("NOT_AVAILABLE"));
  	  
  	  if(availabilityStatus){
  		  statusContainer.addClass(boxservice.episode.getAvailabilityClassName(availabilityStatus));
  	  }
  };
  boxservice.episode.setRequiredFieldClassName=function(statusContainer,requiredFieldStatus){    	
  	  statusContainer.removeClass(boxservice.episode.getRequiredFieldStatusClassName("COMPLETE"));
  	  statusContainer.removeClass(boxservice.episode.getRequiredFieldStatusClassName("NOT_COMPLETE"));
  	  
  	  if(requiredFieldStatus){
  		  statusContainer.addClass(boxservice.episode.getRequiredFieldStatusClassName(requiredFieldStatus));
  	  }
  };
    boxservice.episode.getMissingFields=function(episode){
        if(episode.requiredFieldsStatus!="NOT_COMPLETE"){
            return null;                    
        }        
        var missingFields=episode.requiredFieldsMissing.split(",");
        for(var i=0;i<missingFields.length;i++){
            var missingField=missingFields[i];
            var ib=missingField.indexOf(".");
            if(ib!=-1){
                missingField= missingField.substring(ib+1); 
            }
            missingFields[i]=missingField;  
        }
        return missingFields;
    }
    boxservice.episode.checkRule=function(episode,publishedStatus){
    	if(!episode){				
			boxservice.util.openDialog("Unable to update the status:"+episodeid);
			return;
		}
    	if(!episode.episodeStatus){
    		boxservice.util.openDialog("Unable to update the status of this episode:"+episodeid);
			return;
    	}
    	if(publishedStatus=="APPROVED"){
    		if(episode.episodeStatus.publishedStatus=="ACTIVE"){
    			boxservice.util.openDialog("The current episode is already in ACTIVE Status, which means it is approved already");
    			return false;
    		}
    		else if(episode.episodeStatus.publishedStatus=="APPROVED"){    			
    			return false;
    		}
    		    		
    	}
    	else if(publishedStatus=="NOT_APPROVED"){
    		if(episode.episodeStatus.publishedStatus=="ACTIVE"){
    			boxservice.util.openDialog("You need to deactivate the episode first to mark it as 'not approved");
    			return false;
    		}
    		else if(episode.episodeStatus.publishedStatus=="NOT_APPROVED"){    			
    			return false;
    		}
    	}
    	else if(publishedStatus=="IN_PROGRESS"){
    		if(episode.episodeStatus.publishedStatus=="ACTIVE"){
    			boxservice.util.openDialog("You need to deactivate the episode first to mark it as 'in progress");
    			return false;
    		}
    		else if(episode.episodeStatus.publishedStatus=="IN_PROGRESS"){    			
    			return false;
    		}    		
    	}
    	else if(publishedStatus=="ACTIVE"){
    		if(episode.requiredFieldsStatus=="NOT_COMPLETE"){
    			boxservice.util.openDialog("Missing required fields to activate:"+boxservice.episode.getMissingFields(episode));
    			return false;
    		}
    		if(episode.episodeStatus.publishedStatus=="ACTIVE"){    			
    			return false;
    		}
    		else if(episode.episodeStatus.publishedStatus!="INACTIVE" && episode.episodeStatus.publishedStatus!="APPROVED"){
    			boxservice.util.openDialog("You can only activate the episode in the approvd state");
    			return false;
    		}    		    		
    	}
    	else if(publishedStatus=="INACTIVE"){
    		if(episode.episodeStatus.publishedStatus=="INACTIVE"){    			
    			return false;
    		}
    		else if(episode.episodeStatus.publishedStatus!="ACTIVE"){    			
    			return false;
    		}    		    		
    	}    	
    	return true;
    };
    boxservice.episode.switchPublishedStatus=function(targetButton, publishedStatus,episodes){
    		recordContainer=targetButton.parents(".episoderow");
    	
    		var episodeid=recordContainer.attr("episodeid");
    		
    		var episode=boxservice.util.episode.filterEpisodesById(episodes,episodeid);    		
    		if(!boxservice.episode.checkRule(episode,publishedStatus)){
    			return;
    		}    		
    		targetButton.parents(".statusAction").removeClass("active");
    		boxservice.util.startWait();
    		boxservice.api.episode.changePublishedStatus(episodeid,publishedStatus).done(function(updatedEpisode){    		
    			boxservice.episode.setPublishedClassName($("#episode_"+episodeid),updatedEpisode.episodeStatus.publishedStatus);    			
    			    			
    			if(episode){
    				episode.episodeStatus.publishedStatus=updatedEpisode.episodeStatus.publishedStatus;
    			}
    			else{
    				console.error("the episode is not found when trying to set the published status of the loaded");
    			}
    			boxservice.util.finishWait();
    	}).fail(boxservice.util.onError);
    } ;    
    
    
        
    
    var seUpEpisodeSortable=function(episodes){
    	    	
    	boxservice.util.menu.configSort(".sort-title",function(a,b){
            if (a.title < b.title) 
                return 1; 
            else if (a.title > b.title)
               return -1;
            else
               return 0;
          },episodes,function(episodes){
            boxservice.episode.listdata.empty(); 
            boxservice.episode.listEpisodes(episodes);
        }, boxservice.episode.listdata,function(sortOrder){
            boxservice.episode.listdata.newSort("title",sortOrder);                        
            boxservice.api.episode.list(boxservice.episode.listdata).done(function(episodes){      
                $("#episodelistContainer").empty();
                boxservice.episode.listEpisodes(episodes);                  
                }).fail(boxservice.util.onError);
             });
    	
    	
    	boxservice.util.menu.configSort(".sort-programnumber",function(a,b){
    	    if (a.programmeNumber < b.programmeNumber) 
    	        return 1; 
    	    else if (a.programmeNumber > b.programmeNumber)
    	        return -1;
    	    else
    	        return 0;
          },episodes,function(episodes){
              boxservice.episode.listdata.empty();
              boxservice.episode.listEpisodes(episodes);
        }, boxservice.episode.listdata,function(sortOrder){
            boxservice.episode.listdata.orderBy="programmeNumber";
            boxservice.episode.listdata.sortOrder=sortOrder;
        });

    	
    	boxservice.util.menu.configSort(".sort-metadata-status",function(a,b){
            	if (a.episodeStatus.metadataStatus < b.episodeStatus.metadataStatus)
                    return -1;
                else if (a.episodeStatus.metadataStatus > b.episodeStatus.metadataStatus)
                    return 1;
                else
                        return 0;
          },episodes,function(episodes){
            boxservice.episode.listdata.empty();
            boxservice.episode.listEpisodes(episodes);
        }, boxservice.episode.listdata,function(sortOrder){
            boxservice.episode.listdata.orderBy="episodeStatus.metadataStatus";
            boxservice.episode.listdata.sortOrder=sortOrder;
        });
    	
    	boxservice.util.menu.configSort(".sort-video-status",function(a,b){
        	if (a.episodeStatus.videoStatus < b.episodeStatus.videoStatus)
                return -1;
            else if (a.episodeStatus.videoStatus > b.episodeStatus.videoStatus)
                return 1;
            else  
                    return 0;
      },episodes,function(episodes){
          boxservice.episode.listdata.empty();
          boxservice.episode.listEpisodes(episodes);
    }, boxservice.episode.listdata,function(sortOrder){
        boxservice.episode.listdata.orderBy="episodeStatus.videoStatus";
        boxservice.episode.listdata.sortOrder=sortOrder;
    });
    	
    	
    	
    	boxservice.util.menu.configSort(".published-status",function(a,b){
        	if (a.episodeStatus.publishedStatus < b.episodeStatus.publishedStatus)
                return -1;
            else if (a.episodeStatus.publishedStatus > b.episodeStatus.publishedStatus)
                return 1;
            else  
                    return 0;
          },episodes,function(episodes){
              boxservice.episode.listdata.empty();
            boxservice.episode.listEpisodes(episodes);
        }, boxservice.episode.listdata,function(sortOrder){
            boxservice.episode.listdata.orderBy="episodeStatus.publishedStatus";
            boxservice.episode.listdata.sortOrder=sortOrder;
        });
    	
       boxservice.util.menu.configSort(".availability-status",function(a,b){
           if (a.episodeStatus.currentAvailabilityStatus < b.episodeStatus.currentAvailabilityStatus)
               return -1;
           else if (a.episodeStatus.currentAvailabilityStatus > b.episodeStatus.currentAvailabilityStatus)
               return 1;
           else  
                   return 0;
          },episodes,function(episodes){
              boxservice.episode.listdata.empty();
              boxservice.episode.listEpisodes(episodes);
        }, boxservice.episode.listdata,function(sortOrder){
            boxservice.episode.listdata.orderBy="currentAvailabilityStatus";
            boxservice.episode.listdata.sortOrder=sortOrder;
        });
    	
       boxservice.util.menu.resetSort();
    	
    };
    
	    
	    
	    
    boxservice.episode.loadCompliancePage=function(){    	    
    	return boxservice.util.page.load("episode/compliance.html");   	
    };
    boxservice.episode.cuepointsRowPage=function(){    	    
    	return boxservice.util.page.load("episode/cue-row.html");
    };

    boxservice.episode.selectFromS3File=function(boxvideos,episode){		  
		  var config={value:["file"]};
		
		  $("#fileSelectDialog").openModal();
		  boxservice.util.selectable(boxvideos.files,config,"#fileToSelect");						        		  
		  $("#fileSelectDialog .okButton").on("click",function(){
			  var selectedMedia=$("#fileSelectDialog input:checked").attr("id");
	  		  $("#ingestSource").val(boxvideos.baseUrl+"/"+selectedMedia);	  		  
	  		boxservice.episode.editpage.markEditing();
			  boxservice.episode.checkStatus(episode);
			  boxservice.util.resetInput();
	  		  
		});
		
   };
   boxservice.episode.show=function(listdata){
       boxservice.episode.listdata={
               search:null,
               loadedall:false,
               start:0,
               newSearch:function(search){
                   boxservice.episode.listdata.search=search;      
                   boxservice.episode.listdata.start=0;
                   boxservice.episode.listdata.loadedall=false;
               },
               nextPage:function(){
                   if(!boxservice.episode.listdata.start)
                       boxservice.episode.listdata.start=0;
                   else{
                       boxservice.episode.listdata.start=parseInt(boxservice.episode.listdata.start);
                   }
                   boxservice.episode.listdata.start+=boxservice.appinfo.appconfig.recordLimit;
               },
               empty:function(){
                   boxservice.episode.listdata.start=0;
                   $("#episodelistContainer").empty();
               },
               setUploadedAll:function(episodes){
                   if(!episodes || !episodes.length || episodes.length<boxservice.appinfo.appconfig.recordLimit){
                       boxservice.episode.listdata.loadedall=true;
                   }
               },
               newSort:function(sortBy,sortOrder){
                   boxservice.episode.listdata.sortBy=sortBy;
                   boxservice.episode.listdata.sortOrder=sortOrder;
                   boxservice.episode.listdata.start=0;
                   boxservice.episode.listdata.loadedall=false;                   
               }
       };
       boxservice.episode.loadEpisodeList();      
   }
	boxservice.episode.loadEpisodeList=function(){
		
		var showPage=function(listdata, htmlContent){
			boxservice.util.startWait();
		 	$("#content").html(htmlContent);		 			 	
		        boxservice.api.episode.list(listdata).done(function(episodes){	
		        
		        boxservice.episode.listEpisodes(episodes);
		    	  seUpEpisodeSortable(episodes);
		    	}).fail(boxservice.util.onError);	
		    boxservice.util.search(boxservice.episode.listdata.search).done(function(search){
		                boxservice.episode.listdata.newSearch(search);		                
		                boxservice.episode.loadEpisodeList();
	        	 });		    
		    $("#addNewEpisode").click(function(){
		    	boxservice.episode.create().done(function(){
		    		boxservice.episode.reload();
		    	});
		 	});
		};
		if(boxservice.episode.htmlContent){
			showPage( boxservice.episode.listdata,boxservice.episode.htmlContent);
		}
		else{
			boxservice.util.page.load("episode/list.html").done(function(html){
				boxservice.episode.htmlContent=html;
				showPage( boxservice.episode.listdata,boxservice.episode.htmlContent);				
			});
		}
		
	    
       };
   
       boxservice.episode.listEpisodes=function(episodes){


           boxservice.util.finishWait();
           
           
           
           var hasNeedsToPublishRecord=function(episodes){
                 if(episodes==null|| (!episodes.length)){
                         return false;
                 }  
                 for(var i=0;i<episodes.length;i++){
                         for(var i=0;i<episodes.length;i++){
                                 if(episodes[i].episodeStatus && episodes[i].episodeStatus.metadataStatus=="NEEDS_TO_PUBLISH_CHANGES"){
                                         return true;
                                 }
                         }
                 }
                 return false;
           };
           
           boxservice.util.pageForEachRecord("episode/episode-row.html",episodes,"#episodelistContainer").done(function(){
                          $(".episoderow").each(function(index){
                                  var episodeid=$(this).attr("episodeid");
                                  var episode=boxservice.util.episode.filterEpisodesById(episodes,episodeid);
                                  if(episode && episode.editorNotes){
                                         $(this).addClass("hasEditorNote");
                                  }
                          });
                        
                          boxservice.util.setupDropdownMenu($(".trafficLight"));
                      
                      
                      $(".approve").click(function(){                    
                             boxservice.episode.switchPublishedStatus($(this),"APPROVED",episodes);
                             return false;
                          });
                          $(".disapprove").click(function(){    
                                  boxservice.episode.switchPublishedStatus($(this),"NOT_APPROVED",episodes);
                                  return false;
                         });
                          $(".approveinprogress").click(function(){     
                                  boxservice.episode.switchPublishedStatus($(this),"IN_PROGRESS",episodes);
                                  return false;
                         });
                          $(".requiredFieldsStatus_NOT_COMPLETE .requiredFieldsStatus img").hover(function(){
                                  $(".requiredFieldsStatus_NOT_COMPLETE .requiredFieldsStatus").addClass("active");
                          }, function(){
                                  $(".requiredFieldsStatus_NOT_COMPLETE .requiredFieldsStatus").removeClass("active");
                          });
                          $(".addModifyAvailabilityWindows").click(function () {
                                    var episodeid=$(this).attr("href");
                                    var episode=boxservice.util.episode.filterEpisodesById(episodes,episodeid);
                                        boxservice.availability.show(episode).done(function(){
                                                boxservice.episode.edit(episodeid).done(function(){
                                                          boxservice.episode.reload();
                                                  });
                                        }).fail(function(){
                                                boxservice.episode.edit(episodeid).done(function(){
                                                          boxservice.episode.reload();
                                                  });
                                        });
                                        return false;
                          });
                                
                          var addNote=function(target){
                                  
                                  recordContainer=target.parents(".episoderow");
                                  var episodeid=recordContainer.attr("episodeid");                               
                                  var episode=boxservice.util.episode.filterEpisodesById(episodes,episodeid);                             
                                  $("#episodeEditorNoteDialog .episodeEditorNote").val(episode.editorNotes);                              
                                  $("#episodeEditorNoteDialog .confirm").off("click").on("click", function(){
                                          
                                          episode.editorNotes=$("#episodeEditorNoteDialog .episodeEditorNote").val().trim();
                                          if(episode.editorNotes){
                                                  recordContainer.addClass("hasEditorNote");
                                          }
                                          else{
                                                  recordContainer.removeClass("hasEditorNote");
                                          }
                                          $("#episodeEditorNoteDialog .confirm").off("click");
                                          boxservice.util.startWait();
                                          boxservice.api.episode.addEditorNotes(episodeid,episode.editorNotes).done(function(){
                                                  boxservice.util.finishWait();                                           
                                          }).fail(boxservice.util.onError);
                                          
                                  });
                                  $("#episodeEditorNoteDialog").openModal();
                          };
                          $(".addComplianceNote").click(function(){
                                  addNote($(this));
                                  return false;
                         });
                          $(".editorNoteIcon").click(function(){
                                  addNote($(this));
                                  return false;
                         });
                          
                          $(".activate").click(function(){                         
                                  boxservice.episode.switchPublishedStatus($(this),"ACTIVE",episodes);
                                 
                          });
                          $(".deactivate").click(function(){                     
                                 boxservice.episode.switchPublishedStatus($(this),"INACTIVE",episodes);                                                                          
                          });
                   
                      $("a.episodlink").click(function(){
                          window.scrollTo(0,0);
                                  var episodeid=$(this).attr("href");
                                  boxservice.episode.edit(episodeid).done(function(){
                                          
                                     boxservice.episode.reload();
                                  });
                                  return false;
                          });
                      
                      if(hasNeedsToPublishRecord(episodes)){                     
                                         $(".publishChangesButton").show();
                                         boxservice.util.tooltip();
                                         $("#publishAllChanges").unbind("click").click(function(){
                                                 var command={
                                                                 command:"publish-all-changes"
                                                 };
                                                 boxservice.util.startWait();
                                                 $(".publishChangesButton").hide();
                                                 
                                                 boxservice.api.command(command).done(function(){
                                                         boxservice.util.finishWait();
                                                 }).fail(boxservice.util.onError);
                                                 
                                         });
                           }
                      else{
                          $(".publishChangesButton").hide();  
                      }
                      
                      
                      
                      
                      
                        
                     
                    
                     boxservice.util.resetInput();
                     boxservice.util.scrollPaging(function(){
                         boxservice.episode.listdata.nextPage();
                         boxservice.util.startWait();                     
                         boxservice.api.episode.list(boxservice.episode.listdata).done(function(episodes){
                            console.log(":::loaded data:"+episodes.length);
                            boxservice.episode.listdata.setUploadedAll(episodes);
                            

                            
                            boxservice.episode.listEpisodes(episodes);
                                 
                        }).fail(boxservice.util.onError);
                         
                     },boxservice.episode.listdata);
                    
                     
                     
                     
                     
                           
                   });
       
   };

   
   
   
   
   boxservice.episode.editFields=[{input:{selection:"#episodeTitle"}, data:{value:["title"]}},					  		            
	  		            {input:{selection:"#episodeNumber"}, data:{value:["number"]}},
	  		            {input:{selection:"#episodeSequenceNumber"}, data:{value:["episodeSequenceNumber"]}},
	  		            {input:{selection:"#episodeSynopsis"}, data:{value:["synopsis"]}},
	  		            {input:{selection:"#programmeNumber"}, data:{value:["programmeNumber"]}},	  		            
	  		            {input:{selection:"#episodeContentType"}, data:{value:["contentType"]}},	  		            
	  		            {input:{selection:"#txChannel"}, data:{value:["txChannel"]}},
	  		          
	  		          	{input:{selection:"#supplier"},        data:{value:["supplier"]}},
	  		            {input:{selection:"#certType"},        data:{value:["certType"]}},
	  		            {input:{selection:"#episodeTags"},     data:{type:"array", value:["tags"]}},
	  		            {input:{selection:"#warningText"},     data:{value:["warningText"]}},	  		            					  		            
	  		            {input:{selection:"#adsupport"},       data:{value:["adsupport"]}},	
	  		            {input:{selection:"#showType"},        data:{value:["showType"]}},
	  		            {input:{selection:"#brightcoveId"},    data:{value:["brightcoveId"]}},
	  		            
	  		            {input:{selection:"#ingestProfile"}, data:{value:["ingestProfile"]}},
	  		            {input:{selection:"#ingestSource"}, data:{value:["ingestSource"]}},
	  		            {input:{selection:"#imageURL"}, data:{value:["imageURL"]}},
	  		            
	  		            {input:{selection:"#durationScheduled"}, data:{value:["durationScheduled"]}},
	  		            {input:{selection:"#durationUploaded"}, data:{value:["durationUploaded"]}},
	  		            {input:{selection:"#prAuk"}, data:{value:["prAuk"]}},
	  		            {input:{selection:"#materialId"}, data:{value:["materialId"]}},
	  		            {input:{selection:"#excludeddevices"}, data:{value:["excludeddevices"]}},
	  		            {input:{selection:"#geoAllowedCountries"}, data:{value:["geoAllowedCountries"]}},
	  		            {input:{selection:"#numberOfAdsPerBreak"}, data:{value:["numberOfAdsPerBreak"]}},
	  		            {input:{selection:"#firstTXDate"}, data:{value:["firstTXDate"], type:"datetime-local"}},
	  		            {input:{selection:"#recordedAt"}, data:{value:["recordedAt"], type:"datetime-local"}},
	  		          
  	  		            {input:{selection:"#seriesTitle"},         data:{value:["series","name"]}, "notEditable":true},
  	  		            {input:{selection:"#editorNotes"}, data:{value:["editorNotes"]}}
  	  		            
	  		            ];
   
      
   boxservice.episode.create=function(originalDeferred){	 
	   var deferred = originalDeferred?originalDeferred:$.Deferred();
	   
	   boxservice.util.page.load("episode/create-new.html").done(function(htmlContent){		   
		   $("#content").html(htmlContent);
		   $("#backButton").click(function(){deferred.resolve("back");});
		   $("#cancelCreateEpisode").click(function(){deferred.resolve("back");}); 
		   $("#createEpisode").click(function(){
			   var episodeTitle=$("#episodeTitle").val();
			   var episodeSynopsis=$("#episodeSynopsis").val();
			   var programmeNumber=$("#programmeNumber").val();
			   if((!episodeTitle) || (!episodeSynopsis) (!programmeNumber)){
				   boxservice.util.openDialog("All th fields need to be created");
				   
			   }
		   });
	   }).fail(boxservice.util.onError);
	   return deferred.promise();
   };
	  
    boxservice.episode.startTranscodeMedia=function(episode){
    	if(episode.brightcoveId){
				  var ingestRequest={episodeid:episode.id};
				  var ingestpromise=boxservice.api.bc.ingest(ingestRequest);
				  boxservice.util.openDialog("Ingesting the media");
				  ingestpromise.then(function(data){
					  boxservice.util.closeDialog();
					  console.log("ingest response:"+data);
					  if(data && data.id){					  
						  $(".dialog").dialog("close");
						  $("#ingestJobId").html(data.id);
						  var atag=$("#notificationDialog a");
						  atag.attr("href",data.callback);						  
						  $("#notificationDialog").dialog("open");
					  }
					  
					  
				  }, function(err){
					  boxservice.util.openDialog("Failed to ingest"+err);
					  $(".dialog").dialog("close");
				  });
    	}		  				  
    		 
		  
		  
    };
    
	 
  
	 boxservice.episode.resetStatus=function(){		 
		 boxservice.episode.editpage.doneEditing();
	 };
	 boxservice.episode.checkStatus=function(episode){
		 boxservice.episode.setPublishedClassName($("#episodeEditor"),episode.episodeStatus.publishedStatus);
		 
		 if(boxservice.episode.editpage.isEditing()){			 
			 $("#unpublishFromBC").hide();
			 $("#publishToBC").hide();
			 $("#updateToBC").hide();
			 $("#playSourceVideo").hide();
			 $("#transcodeMedia").hide();
			 $("#deleteEpisode").hide();
			 $("#viewInBrightcove").hide();
			 $("#editSeries").hide();
			 $("#showCueEditor").hide();	
			 $("#viewImage").hide();
			 $("#deleteMasterImage").hide();
			 $("#importImageFromBC").hide();
			 
			 
			 
		 }
		 else{
			 
			 if(episode.series && episode.series.name){
				 $("#editSeries").show();
			 }
			 
			 
			     if(episode.episodeStatus.metadataStatus=="NEEDS_TO_CREATE_PLACEHOLDER"){			    	 
			    	 $("#publishToBC").show();
			    	 $("#updateToBC").hide();
			    	 $("#unpublishFromBC").hide();
			    	 $("#deleteEpisode").show();			    	 
			     }
			     else if(episode.episodeStatus.metadataStatus=="NEEDS_TO_PUBLISH_CHANGES"){
			    	 $("#publishToBC").hide();
			    	 $("#updateToBC").show();
			    	 $("#unpublishFromBC").show();
			    	 $("#deleteEpisode").hide();
			     }
			     else if(episode.episodeStatus.metadataStatus=="PUBLISHED"){
			    	 $("#publishToBC").hide();
			    	 $("#updateToBC").hide();
			    	 $("#unpublishFromBC").show();
			    	 $("#deleteEpisode").hide();
			     }
			     else{
			    	 console.log("Error, unknown metadata status:"+episode.episodeStatus.metadataStatus);
			    	 $("#publishToBC").show();
			    	 $("#updateToBC").show();
			    	 $("#unpublishFromBC").show();
			    	 $("#deleteEpisode").show();
			     }
			     if(episode.episodeStatus.videoStatus=="MISSING_VIDEO" || episode.episodeStatus.videoStatus=="MISSING_PROFILE" || episode.episodeStatus.videoStatus=="NO_PLACEHOLDER"){
			    	 $("#transcodeMedia").hide();
			     }
			     else{
			    	 $("#transcodeMedia").show();
			     }
			     
			      if(episode.ingestSource){
					  $("#playSourceVideo").show();				  
				  }
				  else{
					  $("#playSourceVideo").hide();
				  }
			      if(episode.brightcoveId){
			    	  $("#viewInBrightcove").show();
			    	  $("#importImageFromBC").show();
			      }
			      else{
			    	  $("#viewInBrightcove").hide();
			    	  $("#importImageFromBC").hide();
			      }
			      $("#showCueEditor").show();
				  if(episode.imageURL){
					  $("#viewImage").show();	
					  $("#deleteMasterImage").show();
				  }
				  else{
					  $("#viewImage").hide();
					  $("#deleteMasterImage").hide();
				  }
		 }
		 
		 
		 
		 
	 };	 
	 	 
	 boxservice.episode.dislayStatus=function(episode){
		 var setVideoStatusOnEditor=function(videoStatus){
			 $("#episodeEditor").removeClass (function (index, css) {
				    return (css.match (/(^|\s)video_\S+/g) || []).join(' ');
			 });
			 $("#episodeEditor").addClass("video_"+videoStatus);
		 };
		 
		  
		var addStatus=function(title, valueClass,value){
		   var html='<div class="chip">'+title+':<span class="'+valueClass+'">'+value+'</span></div>';
		   var chipElemen=$(html);			  			  
		   $("#statusArea").append(chipElemen);			 
		};		 
		 $("#statusArea").empty();
		 if(!episode || (!episode.episodeStatus)){
			 return;
		 }
		 addStatus("Metadata Status", "metadataStatusValue",episode.episodeStatus.metadataStatus);
		 
		 
		 if(episode.episodeStatus.videoStatus=="TRANSCODING" || episode.episodeStatus.videoStatus=="TRANSCODE_FAILED" || episode.episodeStatus.videoStatus=="TRANSCODE_COMPLETE"){
			  
			 var linkvalue='<a href="#">'+episode.episodeStatus.videoStatus+'</a>';
			 addStatus("Video Status", "videoStatusValue",linkvalue);
			  $(".videoStatusValue a").click(function(){				  
				  var url=boxservice.api.bc.getNotificationURL(episode);
		  			window.open(url,"_blank");
		  			return false;
			  });
		 }
		 else{
			 	addStatus("Video Status", "videoStatusValue",episode.episodeStatus.videoStatus);
		 }
		 setVideoStatusOnEditor(episode.episodeStatus.videoStatus);
		 
		 //addStatus("Published Status", "publishedStatusValue",episode.episodeStatus.publishedStatus);
		 
		 if(episode.durationScheduled && episode.durationUploaded){
			 try{				 
				var d1=parseInt(episode.durationScheduled);
				var d2=parseInt(episode.durationUploaded);
				if(d1!=d2){
						
					addStatus("Duration", "durationErrorValue","Duration:uploaded and schedule different");
				}
			 }
			 catch(error){
				 console.log("Error when trying to comparing the duration scheduled and uploaded:"+error);
			 }			 
		 }
		 if(episode.episodeStatus.videoStatus=="TRANSCODING"){
			 var command={
					 command:"check-transcode-inprogress",
					 episodeid:episode.id					 
			 };
			 boxservice.util.startWait();
			 boxservice.api.command(command).done(function(status){
				 boxservice.util.finishWait();
				 console.log("Episode status:"+JSON.stringify(status));
				 if(status && status.videoStatus && status.videoStatus !="TRANSCODING"){
					 $(".videoStatusValue").value(status.videoStatus);
					 setVideoStatusOnEditor(status.videoStatus);
				 }
				 
			 }).fail(boxservice.util.onError);
			
		 }
		 
		 
	 };
   boxservice.episode.edit=function(episodeid, originalDeferred){
	   var deferred =null;
	   
	   if(originalDeferred){
		   deferred=originalDeferred;
	   }
	   else{
		   deferred=$.Deferred();
	   }
	   
	   	   
	   if(!episodeid){
		   boxservice.util.openDialog("epsiodeid is null:");
		   deferred.reject("episodeid is null");
		   return deferred.promise();
	   }
	   var pagePromise=boxservice.episode.loadEditEpisodePage();
	   var episodedatapromise= boxservice.api.episode.view(episodeid);
	   var tagspromise=boxservice.api.tags.list();
	   var compliancePromise=boxservice.episode.loadCompliancePage();
	   var cuepointsRowPagePromise=boxservice.episode.cuepointsRowPage();
	   
	   $.when(pagePromise,episodedatapromise,tagspromise,compliancePromise,cuepointsRowPagePromise).then(function(htmlContentResult,episodeRsult,tagResult,compliancePageRsult, cuspointsRowPageResult){
		      var htmlContent=htmlContentResult[0];
		      var episode=episodeRsult[0];
		      var tags=tagResult[0];
		      var compliancePage=compliancePageRsult[0];
		      var cueRowPage=cuspointsRowPageResult[0];
		      
		      var configpage={types:{lastModifiedAt:"datetime","createdAt":"datetime"} };
		      		      
			  $("#content").html(htmlContent);			  
			  boxservice.util.form.initInputFields(episode,boxservice.episode.editFields); 	    				 			
			  var scheduleconfig={"types":{"scheduleTimestamp":"datetime"}};
			   			  
			  boxservice.util.pageForEachRecord("episode/schedule-record.html",episode.scheduleEvents,"#scheduleslist",scheduleconfig).done(function(){
				  
				  console.log("schedule event is added");
			  });
			  var rconfig={types:{start:"datetime",end:"datetime"}};
			  
			  boxservice.util.pageForEachRecord("episode/availability-row.html",episode.availabilities,"#availabilitylist",rconfig).done(function(){
				  
				  console.log("schedule event is added");
			  });
			  
			  $("#statusArea").empty();
			  var chipElemen=$("<div/>").attr({"class":"chip"});
			  chipElemen.html("Metadata:"+episode.episodeStatus.metadataStatus);
			  $("#statusArea").append(chipElemen);
			  boxservice.episode.dislayStatus(episode);
			  
			  
			  if(episode.complianceInformations){
				  var complianceContent="";
				  for(var i=0;i<episode.complianceInformations.length;i++){
					  complianceContent=complianceContent+boxservice.util.replaceVariables(compliancePage,episode.complianceInformations[i]);
					  
				  }
				  $("#complianceInformation").append(complianceContent);
			  }
			  boxservice.episode.editpage.init(episode,deferred);
				  
			 
			  
			  
			  
			  boxservice.util.form.populateOptions(tags,"#episodeTags");
			  boxservice.util.form.selectOptions(episode.tags,"#episodeTags");
			  /*
			  if(episode.cuePoints && episode.cuePoints.length>0){
				  var cueContent="";
				  for(var i=0;i<episode.cuePoints.length;i++){
					  cueContent=cueContent+boxservice.util.replaceVariables(cueRowPage,episode.cuePoints[i]);
				  }
				  $("#cuepoints").append(cueContent);
			  }
			  */
			  boxservice.util.resetInput();
			  
			  
			  
			  
	    	  
			  
			  
			  
			  
			  
			  
			  
			  var isDataNotConsistent=boxservice.util.form.valueHasChanged(episode,boxservice.episode.editFields);			  
			  if(isDataNotConsistent){
				     boxservice.episode.editpage.markDirty();
		  			 boxservice.util.openDialog("The fields appears to be inconsistent, not editable:"+isDataNotConsistent);		  			
	    			return;
	    	  }
			  boxservice.episode.resetStatus();
			  boxservice.episode.checkStatus(episode);
			  
			  boxservice.util.form.inputChangedCallback(boxservice.episode.editFields, function(){				  				  
				  boxservice.episode.editpage.markEditing();
				  boxservice.episode.checkStatus(episode);
			  });
			  
			  var changePublishedStatus=function(episodeid, publishedStatus){				  
		    	  var statusContainer= $("#episodeEditor");
		    	  var statusTextContainer=$(".publishedStatusValue");
		    	  boxservice.episode.changePublishedStatus(publishedStatus,episodeid,statusContainer,statusTextContainer);  
			  };
			  
			  
			  
			  $("#publishToBC").click(function(){
				  	boxservice.util.startWait();
		  			var publishpromise=boxservice.api.bc.publish(episode);
		  			publishpromise.done(function(){
		  				boxservice.util.finishWait();		  				
		  				boxservice.episode.edit(episode.id,deferred);		  				
		  			});
		  			publishpromise.fail(function(err){				  				
		  				boxservice.util.finishWait();
		  				boxservice.util.openDialog("failed to  pulished to Brifghtcove video cloud:"+JSON.stringify(err));
		  			});
		  			return false;
		  		});
		  		$("#updateToBC").click(function(){
		  			boxservice.util.startWait();
		  			var publishpromise=boxservice.api.bc.publish(episode);
		  			publishpromise.done(function(){
		  				boxservice.util.finishWait();		  				
		  				boxservice.episode.edit(episode.id,deferred);
		  			});
		  			publishpromise.fail(function(err){		
		  				boxservice.util.finishWait();
		  				boxservice.util.openDialog("failed to  update the Brifghtcove video cloud:"+JSON.stringify(err));
		  			});
		  			return false;
		  		});
		  		boxservice.dialogs.setupDeleteMediaEntryDialog($("#unpublishFromBC"), function(){		  			
		  			boxservice.util.startWait();
		  			console.log("going to delete the media entry");
		  			var publishpromise=boxservice.api.bc.unpublish(episode);
		  			publishpromise.done(function(){
		  				boxservice.util.finishWait();
		  				boxservice.episode.edit(episode.id,deferred);
		  			});
		  			publishpromise.fail(function(err){
		  				boxservice.util.finishWait();
		  				boxservice.util.openDialog("failed to  remove from the Brifghtcove video cloud:"+JSON.stringify(err));		  				
		  			});
		  		});
		  		boxservice.dialogs.setupSwitchToNewSeriesDialog($("#switchSeries"), function(){
		  			var contractNumber=$("#seriesContractNumber").val();
		  			if(!contractNumber){
		  				return;
		  			}
		  			contractNumber=contractNumber.trim();
		  			if(!contractNumber.length){
		  				return;
		  			}
		  			boxservice.util.startWait();
		  			boxservice.api.series.getByContractNumber(contractNumber).done(function(series){		  				
		  				if(series.length>0){
			  					
			  					episode.series=series[0];			  					
			  					var episodedatapromise = boxservice.api.episode.update(episode.id, episode, "switchseries");
			  					episodedatapromise.done(function () {
			  						boxservice.util.finishWait();
			  						boxservice.episode.edit(episode.id,deferred);
			  					}).fail(function (err) {
			  						boxservice.util.openDialog("Failed" + JSON.stringify(err));
			  						boxservice.util.finishWait();
			  					});
		  				}
		  				else{
		  					boxservice.util.finishWait();
		  					boxservice.util.openDialog("The series could not be found");		  					
		  				}
		  			});	
		  		});
		  		
		  		
		  		
		  		
		  		$("#viewInBrightcove").click(function(){
		  			var url=boxservice.bc.videourl(episode.brightcoveId);
		  			window.open(url,"_blank");
		  			return false;
		  		});
		  		$("#jsonview").click(function(){
		  			var url=boxservice.api.episode.getDetailsUrl(episode.id);
		  			window.open(url,"_blank");
		  			return false;
		  		});
		  		$("#soundMouseHeaderview").click(function(){
		  			var url=boxservice.api.episode.soundMouseHeaderFileUrl(episode.id);
		  			window.open(url,"_blank");
		  			return false;
		  		});
		  		$("#soundMouseSmurfview").click(function(){
		  			var url=boxservice.api.episode.soundMouseSmurfFileUrl(episode.id);
		  			window.open(url,"_blank");
		  			return false;
		  		});
		  		$("#bcAnalycsData").click(function(){		  			
		  			var url=boxservice.api.episode.bcAnalysticsUrl(episode.brightcoveId);
		  			window.open(url,"_blank");
		  			return false;
		  		});
		  		
		  		
		  		
		  		
		  		
		  		
		  		
		  		
		  		
		  		
		  		
		  		
		  		$("#editSeries").off("click").on("click", function(){		  				
		  				boxservice.series.edit(episode.series.id).done(function(){
		  					boxservice.episode.edit(episode.id,deferred);
		  				});		  				
		  				return false;
		  		}); 
		  		
		  		/*
		  		$("#selectS3Files").on("click",function(){
		  			boxservice.api.boxvideo.listFiles().done(function(boxvideos){
		        		  boxservice.episode.selectFromS3File(boxvideos,episode);
		        		
		        		  
		        		  
		        		  
		        	  }).fail(function(err){							
							boxservice.util.openDialog("error in loading the s3 files"+err);							
						});
		  			
		  		});
		  		*/
		  		
		  	    		  	    		  	    		  	    
		  	  if(episode.brightcoveId){
			  		 var videopromise=boxservice.api.bc.video.view(episode.brightcoveId);
			    	 var pagepromise=boxservice.bc.loadViewVideoPage();
			    	$.when(videopromise,pagepromise).then(function(videoResult,htmlContentResult){  
			    		var video=videoResult[0];
			    		var htmlContent=htmlContentResult[0];
			    		$("#bcView").html(boxservice.util.replaceVariables(htmlContent,video));
			    	});
	  		 
	  		   }
		  		
		  		
		  		
	   },function(htmlError,episodeError,tagError,compliancePageError,cueRowPageError){
		   boxservice.util.openDialog("error loading the data from the server:"+htmlError+":"+	episodeError+":"+tagError+":"+compliancePageError+":"+cueRowPageError);		   
	   });
	   return deferred.promise();	   
   };
	
});
