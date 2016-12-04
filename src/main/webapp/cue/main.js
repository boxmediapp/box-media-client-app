jQuery(document).ready(function ($) {	
			boxservice.cue={};
			
			boxservice.cue.fields=[
			                       	{input:{selection:"#cueTime"}, data:{value:["time"]}},					  		            
			                       	{input:{selection:"#cueType"}, data:{value:["type"]}},
			                       	{input:{selection:"#numberOfAds"}, data:{value:["metadata","numberOfAds"]}},
			                       	{input:{selection:"#cueName"}, data:{value:["name"]}},
			                       	{input:{selection:"#cueCode"}, data:{value:["code"]}},
			                       	{input:{selection:"#corceStop"}, data:{value:["force_stop"]}},
			                       	{input:{selection:"#mediaType"}, data:{value:["metadata","mediaType"]}},
			                       	{input:{selection:"#cueDuration"}, data:{value:["metadata","duration"]}},
			                       	{input:{selection:"#artist"}, data:{value:["metadata","artist"]}},
			                       	{input:{selection:"#cueTrack"}, data:{value:["metadata","track"]}},
			                       	{input:{selection:"#certification"}, data:{value:["metadata","certification"]}},
			                       	{input:{selection:"#materiaId"}, data:{value:["metadata","materialId"]}}			                       	
			                       ];
			boxservice.cue.getCueByIdFromTheList=function(cuelist, cueid){
				if(cuelist==null ||cuelist.length==0){
					return null;
				}
				for(var i=0;i<cuelist.length;i++){
					if(cuelist[i].id==cueid){
						return cuelist[i];
					}					
				}
				return null;
			};
			boxservice.cue.editingcue=null;
			boxservice.cue.show=function(episode){
				var deferred = $.Deferred();				
				boxservice.util.page.load("cue/editor.html").done(function(htmlContent){			  
						$("#content").html(htmlContent);			   
						
						$("#cancelCue").hide();
						$("#addNewCue").show();
						$("#updateCue").hide();
						$("#backButton").show();
						$("#ffFrame").hide();
						$("#rwFrame").hide();
						$("#backButton").click(function(){
							  $("video")[0].pause();
							  console.log("back button is called");
			        		  deferred.resolve(episode);
			        		  
						});
						
						if(episode.ingestSource){
							boxservice.api.boxvideo.presginedurl(episode.ingestSource).done(function(data){
				  				if(data && data.file){
				  				   $("video source").attr("src",data.file);
				  				   var videoElement=$("video")[0];
				  				 
				  				   videoElement.load();
				  				   $("#ffFrame").show();
				  				   $("#rwFrame").show();
				  				   
				  				   videoElement.addEventListener('timeupdate', function() {
				  					   $("#cueTime").val(videoElement.currentTime);				  					   				  					  
				  					}, false);
				  				   
				  				 $("#ffFrame").click(function(){
				  					$("video")[0].currentTime=$("video")[0].currentTime+1/60;				  					 
				  				 });
				  				$("#rwFrame").click(function(){
				  					$("video")[0].currentTime=$("video")[0].currentTime-1/60;				  					 
				  				 });
				  				 
				  				 
				  				}
				  		  	});
						}
						boxservice.util.startWait();
						boxservice.api.cue.list(episode).done(function(cuelist){
							boxservice.util.finishWait();
							$("#cuepointlist").empty();
							boxservice.util.pageForEachRecord("cue/cue-row.html",cuelist,"#cuepointlist").done(function(){
								$("#cuepointlist .delete").click(function(){
										var cueid=$(this).attr("href");
										boxservice.cue.remove(episode,cueid).then(
												
												);
										
										boxservice.cue.remove(episode,cueid).done(function(){
											boxservice.cue.show(episode).then(deferred.resolve,deferred.reject);
									}).fail(function(err){
										boxservice.util.onError(err);
										boxservice.cue.show(episode).then(deferred.resolve,deferred.reject);
									});
										
										return false;
								});
								$("#cuepointlist .edit").click(function(){
									var cueid=$(this).attr("href");
									var matchedCue=boxservice.cue.getCueByIdFromTheList(cuelist,cueid);
									if(!matchedCue){
										boxservice.util.onError("the cue is not found in the loaded list");										
									}
									else{			
										$(".cuepointlistContainer").hide();										
										boxservice.cue.edit(episode,matchedCue);
									}
									return false;
								});
								
								
							}).fail(boxservice.util.onError);							
						}).fail(function(err){
							boxservice.util.finishWait();
				  	 		boxservice.util.onError(err);
						});
						
						
						
						
						
						$("#addNewCue").click(function(){
							boxservice.cue.create(episode).done(function(cuecreated){
									boxservice.cue.show(episode).then(deferred.resolve,deferred.reject);
							}).fail(function(err){
								boxservice.util.onError(err);
								boxservice.cue.show(episode).then(deferred.resolve,deferred.reject);
							});							
						});
						$("#captureImage").click(function(){
						    boxservice.util.startWait();
						    var filenameConstructor=function(episode){
			                                return episode.materialId.replace(/\//g, "_").replace(/ /g, "-");
			                            };
			                            var searchFilename=filenameConstructor(episode);
						    boxservice.api.masterimage.listFiles(searchFilename).done(function (mediafiles) {
				                        
				                        if (mediafiles.files.length) {
				                            boxservice.util.finishWait();
				                                boxservice.util.openDialog("Matching image is already exist in the bucket:" + JSON.stringify(mediafiles.files[0].file) +" You need to either delete the file from the s3 if you do not want it or you can change the material id to different value and save it");
				                                
				                        }
				                        else {
				                            var secondsAt=$("#cueTime").val();
	                                                    var mediaCommand={
	                                                            command:"capture_image_from_video",
	                                                            episodeid:episode.id,
	                                                            secondsAt:secondsAt
	                                                    };
	                                                    
	                                                    boxservice.api.command(mediaCommand).done(function(){
	                                                          boxservice.util.finishWait();
	                                                          boxservice.util.openDialog("Image captured from the video at the specified position");

	                                                    }).fail(boxservice.util.onError);                                       
				                        }

				                     }).fail(boxservice.util.onError);

						    
						    
						});
						$("#cancelCue").click(function(){
							boxservice.cue.editingcue=null;
							$("#cancelCue").hide();
							$("#addNewCue").show();
							$("#updateCue").hide();
							$("#backButton").show();
							$(".cuepointlistContainer").show();
						});
						$("#updateCue").click(function(){
							$(".cuepointlistContainer").show();							
							boxservice.cue.update(episode).done(function(updated){
								boxservice.cue.show(episode).then(deferred.resolve,deferred.reject);
						}).fail(function(err){
							boxservice.util.onError(err);
							boxservice.cue.show(episode).then(deferred.resolve,deferred.reject);
						});							
							
							
						});
						boxservice.util.resetInput();
						window.scrollTo(0,0);
				});	
	    	  	return deferred.promise(); 
	};
	boxservice.cue.create=function(episode){
		var deferred = $.Deferred();
		
		 var cuepoint={
				 metadata:{}
		 };
		 boxservice.util.startWait();					    	 	  
  	 	 boxservice.util.form.update(cuepoint,boxservice.cue.fields);
  	 	 console.log(JSON.stringify(cuepoint));
  	 	boxservice.api.cue.create(episode,cuepoint).done(function(){
  	 		boxservice.util.finishWait();  		    
  	 		deferred.resolve(cuepoint);
  	 	}).fail(function(err){
  	 		boxservice.util.finishWait();
	  		deferred.fail(err);  	 		
  	 	}); 
  	 	return deferred.promise();;
	};
	boxservice.cue.remove=function(episode,cueid){
		var deferred = $.Deferred();
		boxservice.util.startWait();
		boxservice.api.cue.remove(episode,cueid).done(function(){
			boxservice.util.finishWait();	
			deferred.resolve(episode);
		}).fail(function(err){
			boxservice.util.finishWait();
  	 		boxservice.util.onError(err);
  	 		deferred.reject(err);
		});	
		return deferred.promise();
	};
	
	boxservice.cue.edit=function(episode,cue){		
				  				
		boxservice.util.form.initInputFields(cue, boxservice.cue.fields);
		boxservice.util.resetInput();
		var isDataNotConsistent=boxservice.util.form.valueHasChanged(cue,boxservice.cue.fields);
		$("#cancelCue").show();
		$("#addNewCue").hide();
		$("#updateCue").show();
		$("#backButton").hide();
		if(isDataNotConsistent){			  	 			
 			 $("#updateCue").hide();
 			 $("#backButton").show();
			 boxservice.util.openDialog("The fields appears to be inconsistent, not editable:"+isDataNotConsistent);
	  	     return;
  	    }
		else{
			boxservice.cue.editingcue=cue;
			try{
				$("video")[0].pause();
				$("video")[0].currentTime=cue.time;
			}
			catch(err){
				console.log(err);
			}
			
		}
			
	};
	boxservice.cue.update=function(episode){
		var deferred = $.Deferred();
		if(boxservice.util.form.valueHasChanged(boxservice.cue.editingcue,boxservice.cue.fields)){
			  boxservice.util.startWait();					  
			  boxservice.util.form.update(boxservice.cue.editingcue,boxservice.cue.fields);									 
			  boxservice.api.cue.update(episode,boxservice.cue.editingcue).done(function(){
				  boxservice.util.finishWait();
				  
				  $("#cancelCue").hide();
				  $("#addNewCue").show();
				  $("#updateCue").hide();
				  $("#backButton").show();
				  deferred.resolve(episode);
			   }).fail(function(err){				   
				   boxservice.util.finishWait();
				   boxservice.util.onError(err);
				   deferred.reject(err);
			   });			     				
		  }
		return deferred.promise();		
		 		
	};
});