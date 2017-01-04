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
    
    
        
    
    boxservice.episode.seUpEpisodeSortable=function(){
        boxservice.episode.listdata.setupSortable({headerSection:".sort-title",attributename:"title",sortParametername:"title"});
        boxservice.episode.listdata.setupSortable({headerSection:".sort-programnumber",attributename:"programmeNumber",sortParametername:"programmeNumber"});
        boxservice.episode.listdata.setupSortable({headerSection:".sort-metadata-status",attributename:"episodeStatus.metadataStatus",sortParametername:"episodeStatus.metadataStatus"});
        boxservice.episode.listdata.setupSortable({headerSection:".sort-video-status",attributename:"episodeStatus.videoStatus",sortParametername:"episodeStatus.videoStatus"});
        boxservice.episode.listdata.setupSortable({headerSection:".published-status",attributename:"episodeStatus.publishedStatus"});
        boxservice.episode.listdata.setupSortable({headerSection:".availability-status",attributename:"episodeStatus.currentAvailabilityStatus"});
        boxservice.episode.listdata.setupSortable({headerSection:".createdat",attributename:"createdAt",sortParametername:"createdAt"});
        boxservice.episode.listdata.setupSortable({headerSection:".lastmodified",attributename:"lastModifiedAt",sortParametername:"lastModifiedAt"});
        
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
   
   boxservice.episode.createListData=function(opts){
       var createListDataRequest={
               containerSelection:"#episodelistContainer",
               loadItemsFunction:boxservice.api.episode.list,
               listItemsFunction:boxservice.episode.listEpisodes,
               onStartList:function(){
                   boxservice.util.startWait();
                   $("#content").html(boxservice.episode.htmlContent);
                   boxservice.episode.seUpEpisodeSortable();
                   boxservice.util.search(boxservice.episode.listdata.search).done(function(search){
                           boxservice.episode.listdata.newSearch(search);                          
                           boxservice.episode.loadEpisodeList();
                    });                
                   $("#addNewEpisode").click(function(){
                       boxservice.episode.create().done(function(){
                       boxservice.episode.reload();
                       });
                   });
               }
         };
       if(opts && opts.backCallback){
           var deferred=$.Deferred();           
           deferred.promise().done(function(){
               opts.backCallback(); 
           }); 
           createListDataRequest.backDeferred=deferred;
       }
       return boxservice.recordlist.createlistdata(createListDataRequest);       
   };
   boxservice.episode.show=function(){
       boxservice.episode.listdata=boxservice.episode.createListData();       
       boxservice.episode.loadEpisodeList();      
   }
	boxservice.episode.loadEpisodeList=function(){
		if(boxservice.episode.htmlContent){
		    boxservice.episode.listdata.startList();
		}
		else{
			boxservice.util.page.load("episode/list.html").done(function(html){
				boxservice.episode.htmlContent=html;
				boxservice.episode.listdata.startList();				
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
           if(hasNeedsToPublishRecord(boxservice.episode.listdata.items)){                     
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
           var econfig={types:{lastModifiedAt:"datetime",createdAt:"datetime"}};
           boxservice.util.pageForEachRecord("episode/episode-row.html",episodes,"#episodelistContainer",econfig).done(function(){
                          boxservice.episode.listdata.autoScroll();
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
                                  var deferred=boxservice.episode.listdata.getBackDeferred();
                                  boxservice.initForNewPage();
                                  var episodeid=$(this).attr("href");
                                  boxservice.episode.edit(episodeid,deferred);
                                  return false;
                          });
                     
                    
                     boxservice.util.resetInput();
                     boxservice.util.scrollPaging(boxservice.episode.listdata);
                      
                     
                           
                   });
       };

   
   
   
   
   
   
      
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
   
	
});
