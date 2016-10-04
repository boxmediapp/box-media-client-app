jQuery(document).ready(function ($) {
	boxservice.series={};
	
	
	boxservice.series.uploadImageFile = function (series) {
		if (boxservice.series.inputDirty) {
			boxservice.util.openDialog("Please save it first: click on the 'save' button");
			return;
		}

		if (!series.contractNumber) {
			boxservice.util.openDialog("You have to provide the contractNumber in order to uniquely name the image");
			return;
		}
		var imagefileName = series.contractNumber.replace(/\//g, "_").replace(/ /g, "-");
		console.log("checking the exitence of the image:" + imagefileName);
		boxservice.util.startWait();
		boxservice.api.masterimage.listFiles(imagefileName).done(function (imageData) {
			boxservice.util.finishWait();
			if (imageData.files.length) {
				boxservice.util.openDialog("Matching image is already exist in the bucket:" + JSON.stringify(imageData.files[0].file));
			}
			else {
				$("#filennameForUpload").val(imagefileName + ".png");		
				$("#uploadFileNameDialog").openModal();
				boxservice.util.resetInput();
			}

		}).fail(boxservice.util.onError);
	};

	
	
	
	
var seUpSeriesSortable=function(series){
    	
    	var setUpSortSeries=function(sortHeader, sortFunction){
    		boxservice.util.menu.configSort(sortHeader,sortFunction,series,boxservice.series.display);
    	};
    	setUpSortSeries(".sort-title",function(a,b){
    		if (a.name < b.name) 
    			 return 1; 
    		else if (a.name > b.name)
    			return -1;
    		else
    			return 0;
    	});
    	setUpSortSeries(".sort-contract-number",function(a,b){
    		if (a.contractNumber < b.contractNumber) 
    			 return 1; 
    		else if (a.contractNumber > b.contractNumber)
    			return -1;
    		else
    			return 0;
    	});
    	boxservice.util.menu.resetSort();
    	
    };
    
    
    
	boxservice.series.display=function(series, search,startIndex){   	  
	  
	$("#serieslist").empty();	
	  boxservice.util.pageForEachRecord("series/series-row.html",series,"#serieslist").done(function(){
		  
		   $(".serieslink").click(function(){
			var seriesid=$(this).attr("href");
			boxservice.series.edit(seriesid).done(function(){
				boxservice.series.reload();
			});
			 return false;  
		   });
		   $("#addNewSeries").click(function(){
			   boxservice.series.createNewSeries().done(function(){
				   boxservice.series.reload();
			   });
		   });
		   
	   });
	  boxservice.util.scrollPaging("#serieslistContainer",series,function(){
		  
		  if(!startIndex){
			  startIndex=0;
	    	 }
	    	 else{
	    		 startIndex=parseInt(startIndex);
	    	 }
	    	 boxservice.appinfo.appconfig.recordLimit=parseInt(boxservice.appinfo.appconfig.recordLimit);
	    	 
		  
		  
	    	 boxservice.api.series.list(search, startIndex+boxservice.appinfo.appconfig.recordLimit).done(function(series){			    			 
	    		 boxservice.series.display(series,startIndex+boxservice.appinfo.appconfig.recordLimit);		    			 				    	  				    	  
	    	}).fail(boxservice.util.onError);
	     });
	  
	  
	  
   };
   boxservice.series.reload=function(){
	   boxservice.series.show(boxservice.api.series.search, boxservice.api.series.startIndex);
   };
	boxservice.series.show=function(search,startIndex){
		
		
		var showPage=function(htmlContent, search,startIndex){
			if(!startIndex){
				startIndex=0;	
			}
			boxservice.api.series.startIndex=startIndex;
			boxservice.api.series.search=search;
			boxservice.util.startWait();			
			boxservice.series.htmlContent=htmlContent;
	 	           boxservice.api.series.list(search,startIndex).done(function(series){
	 	        	  $("#content").html(htmlContent);
	 	        	 boxservice.util.finishWait();
	 	        	 seUpSeriesSortable(series);
	 	        	 boxservice.series.display(series, search,startIndex);
	 	        	boxservice.util.search(search).done(function(search){	 	 	  			  
	 	 	  			boxservice.series.show(search,0);
	 	 	        	 });
				}).fail(function(err){			
					boxservice.util.finishWait();
					boxservice.util.openDialog("error in loading the series"+err);					
				});
		};
		if(boxservice.series.htmlContent){
			showPage(boxservice.series.htmlContent,search,startIndex);
		}
		else{
				boxservice.util.page.load("series/list.html").done(function(htContent){
					showPage(htContent,search,startIndex);
				});
		}
		 	         
    };
    boxservice.series.editFields=[{input:{selection:"#seriesName"}, data:{value:["name"]}},
                                  {input:{selection:"#seriesSynopsis"}, data:{value:["synopsis"]}},
  			  		              {input:{selection:"#contractNumber"},  data:{value:["contractNumber"]}},
  			  		              {input:{selection:"#imageURL"},  data:{value:["imageURL"]}},
  			  		              {input:{selection:"#seriesNumber"},  data:{value:["seriesNumber"]}},
  			  		              {input:{selection:"#seriesTags"},  data:{value:["tags"]}},
  			  		              {input:{selection:"#seriesGroupTitle"}, data:{value:["seriesGroup", "title"]}, "notEditable":true}
  			  		            
      ];
    boxservice.series.resetStatus=function(){
		 boxservice.series.inputDirty=false;
	 };
    boxservice.series.checkStatus=function(series){
    	if(boxservice.series.inputDirty){
    		$("#cancelSaveSeries").show();    		
			$("#saveSeries").show();
			$("#deleteSeries").hide();
			$("#addNewEpisodeToSeries").hide();
			$("#editSeriesGroup").hide();
			$("#viewImage").hide();
			$("#deleteMasterImage").hide();
			
    	}
    	else{
    		$("#cancelSaveSeries").hide();    		
			$("#saveSeries").hide();
			if(series.seriesGroup && series.seriesGroup.id){
				$("#editSeriesGroup").show();
			}
			else{
				$("#editSeriesGroup").hide();
			}
			if(series.episodes && series.episodes.length>0){
				$("#deleteSeries").hide();
			}
			else{
				$("#deleteSeries").show();
			}
			$("#addNewEpisodeToSeries").show();
			if(series.imageURL){
				  $("#viewImage").show();
				  $("#deleteMasterImage").show();
			  }
			  else{
				  $("#viewImage").hide();
				  $("#deleteMasterImage").hide();
			  }
    	}
    	
    };
    
    boxservice.series.edit=function(seriesid,originalDeferred){
    			var deferred = originalDeferred?originalDeferred:$.Deferred();
				    	if(!seriesid){
				 		   	boxservice.util.openDialog("seriesid is null");
				 		   	deferred.reject("seriesid is null");				 		   	
				 	   }
				    	else{
				    			boxservice.util.page.load("series/edit.html").done(function(htmlContent){    	   				   
					    		   $("#content").html(htmlContent);
					    		   $("#backButton").click(function(){deferred.resolve("back");});
					    		   
								   boxservice.api.series.view(seriesid).done(function(series){
									   boxservice.series.editSeries(series,deferred);								   
								   });
						 	   });
				    	}
				return deferred.promise(); 	    	
	   };
	
	   boxservice.series.editSeries=function(series,deferred){
		       
			   boxservice.api.tags.list().done(function(tags){
				   	  boxservice.util.form.populateOptions(tags,"#seriesTags");
				   	  boxservice.util.form.initInputFields(series,boxservice.series.editFields);
				   	  boxservice.util.resetInput();
					   if(boxservice.util.form.valueHasChanged(series,boxservice.series.editFields)){
			    			boxservice.util.openDialog("The fields appears to be inconsistent, not editable");
			    			return;
			    		}
					   boxservice.series.resetStatus();
					   
					   boxservice.series.checkStatus(series);	
					   boxservice.util.tooltip();
					   boxservice.util.form.inputChangedCallback(boxservice.series.editFields, function(){
							  boxservice.series.inputDirty=true;
							  boxservice.series.checkStatus(series);
						});
			   });
			   
			   
				$("#uploadImageFile").click(function () {
					boxservice.series.uploadImageFile(series);
				});
				$("#uploadFileNameDialog .cancel").click(function () {

				});
				$("#uploadFileNameDialog .confirm").click(function () {
					
					boxservice.util.uploadFileDialog(boxservice.api.masterimage.listFiles,function(){
								boxservice.series.edit(series.id,deferred);
					  }, boxservice.api.masterimage.uploadfileurl());
				});
				$("#viewImage").click(function(){
					boxservice.images.show(series.imageURL,function(){
						boxservice.series.edit(series.id,deferred);				
					});
					return false;
				});
				$("#deleteMasterImage").click(function(){					   
					      $("#deleteMasterImage .confirm").off("click").on("click", function(){						      
							  boxservice.api.masterimage.deleteSeriesImage(series.id,series.imageURL).done(function(){
								  boxservice.series.edit(series.id,deferred);								  
							  });
							  return false;
						  });
					    $("#confirmDeleteImageDialog .filennameToDelete").val(series.imageURL);
						$("#confirmDeleteImageDialog").openModal();						
						return false;
				});
			   
				$("#editSeriesGroup").click(function(){
					var seriesgroupid=series.seriesGroup.id;
					boxservice.seriesgroup.edit(seriesgroupid).done(function(){
						boxservice.series.edit(series.id,deferred);
					});
	  				return false;
					
				});  
				
				boxservice.dialogs.setupSwitchToNewSeriesGroupDialog($("#switchSeriesGroup"), function(){
					var seriesGroupTitle=$("#seriesGroupTitleToSwitch").val();
		  			if(!seriesGroupTitle){
		  				return;
		  			}
		  			seriesGroupTitle=seriesGroupTitle.trim();
		  			if(!seriesGroupTitle.length){
		  				return;
		  			}
		  			boxservice.util.startWait();
		  			boxservice.api.seriesgroup.getByTitle(seriesGroupTitle).done(function(seriesgroup){		  				
		  				if(seriesgroup.length>0){			  					
		  					series.seriesGroup=seriesgroup[0];
		  				}
		  				else{
		  					series.seriesGroup={
		  							 title:seriesGroupTitle
		  					 };		  					 
		  				}
			  			var seriesdatapromise = boxservice.api.series.update(series.id, series, "switchseriesgroup");
			  					seriesdatapromise.done(function () {
			  						boxservice.util.finishWait();
			  						boxservice.series.edit(series.id,deferred);
			  					}).fail(function (err) {
			  						boxservice.util.openDialog("Failed" + JSON.stringify(err));
			  						boxservice.util.finishWait();
			  					});
		  				
		  			});
					
				});
				
			   $("#cancelSaveSeries").click(function(){
				   boxservice.series.inputDirty=false;
				   boxservice.series.edit(series.id,deferred);									   
			   });
			   $("#saveSeries").click(function(){
				   boxservice.series.inputDirty=false;
		  			if(boxservice.util.form.valueHasChanged(series,boxservice.series.editFields)){
		  				boxservice.util.form.update(series,boxservice.series.editFields);
		  				boxservice.util.startWait();
		  			    var seriesdatapromise=boxservice.api.series.update(series.id,series);
		  			  seriesdatapromise.done(function(){
		  				boxservice.util.finishWait();							  				
		  				boxservice.series.edit(series.id,deferred);
		  			   }).fail(boxservice.util.onError);							  			     							  				
		    		}
		  			else{
		  				boxservice.util.openDialog("Nothing has changed");					  				
		  			}
		  			
		  		});
			   $("#deleteSeries").unbind("click").click(function(){
				   boxservice.api.series.remove(series).done(function(){
						  boxservice.series.reload();
					  }).fail(boxservice.util.onError); 
			   });
			   
			   $("#addNewEpisodeToSeries").click(function(){
				   
				   boxservice.util.page.load("series/add-new-episode.html").done(function(htmlContent){
					
					   
					   
					   var episode={
					    		title:"",
					    		number:"1",
					    		synopsis:"",
					    		programmeNumber:"",
					    		warningText:"",
					    		txChannel:"Box Plus",
					    		certType:"ALL_TIMES",
					    		adsupport:"FREE",
					    		ingestProfile:"box-plus-network-1080p-profile",
					    		contentType:"Entertainment",
					    		series:{
					    			id:series.id										    					    			
					    		}
					    };
					   var htContent=boxservice.util.replaceVariables(htmlContent,series);
					   $("#content").html(htContent);
					   
					   boxservice.util.resetInput();
					   
					   var tagspromise=boxservice.api.tags.list();
					   tagspromise.done(function(tags){
						   	  boxservice.util.form.populateOptions(tags,"#episodeTags");
					   });
					   $("#createNewEpisode .cancel").click(function(){			   
						   boxservice.series.edit(series.id,deferred);
					   }); 
					  
					   $("#createtags").click(function(){
							  $("#createNewTagsDialog").openModal();
						  });
						  $("#confirmCreateNewTag").click(function(){
				    			var newvalue=$("#newtags").val();
				    			var tags=newvalue.split(",");
				    			for(var i=0;i<tags.length;i++){
				    				boxservice.util.form.addOption(tags[i],tags[i],"#episodeTags");
				    			}

				    			$('select').material_select();
				    	  });
					   
					   
					   $("#createNewEpisode .create").click(function(){			   
					   	 	  boxservice.util.startWait();					  
					   	 	  
					   	 	  boxservice.util.form.update(episode,boxservice.episode.editFields);
					   	 	  
					   	 	  if(episode.supplier && episode.supplier.toLowerCase()=="box tv network"){
					   	 		  episode.ingestProfile="box-plus-network-DRM-profile";
					   	 	  }
							  console.log(JSON.stringify(episode));
			                  
							  var episodedatapromise=boxservice.api.episode.create(episode);
							  episodedatapromise.done(function(){
								  boxservice.util.finishWait();
								  boxservice.series.edit(series.id,deferred);
							   }).fail(function(err){
								   boxservice.util.openDialog("Failed"+JSON.stringify(err));
								   boxservice.util.finishWait();
							   });
							  		     				
				 		 
					   });
					   
					   
					   $("#selectS3Files").on("click",function(){
				  			boxservice.api.boxvideo.listFiles().done(function(boxvideos){
				        		  boxservice.episode.selectFromS3File(boxvideos,episode);
				        	  }).fail(function(err){							
									boxservice.util.openDialog("error in loading the s3 files"+err);							
								});
				  			
				  		});
					   
					   
				   }).fail(boxservice.util.onError);
				   
			   });
			   boxservice.util.pageForEachRecord("series/episode-row.html",series.episodes,"#episodelistContainer").done(function(){
				      $("#episodelistContainer .episodelink a").click(function(){
						  var episodeid=$(this).attr("href");						  
						  boxservice.episode.edit(episodeid).done(function(){
							  boxservice.series.edit(series.id,deferred);
						  });						
						  return false;
					  });
			  }).fail(boxservice.util.onError);
		     
	   };
	   
	   boxservice.series.createNewSeries=function(originalDeferred){
		   var deferred = originalDeferred?originalDeferred:$.Deferred();
	    			boxservice.util.page.load("series/add-new-series.html").done(function(htmlContent){    	   				   
		    		   $("#content").html(htmlContent);
		    		   $("#backButton").click(function(){deferred.resolve("back");});
		    		   $("#cancelCreateSeries").click(function(){deferred.resolve("back");});
		    		   $("#createSeries").click(function(){
		    			   var contractNumber=$("#contractNumber").val();
		    			   var seriesTitle=$("#seriesTitle").val();
		    			   if(!contractNumber){
		    				   boxservice.util.openDialog("contractNumber  cannot be empty");
		    				   return;
		    			   }
		    			   if(!seriesTitle){
		    				   boxservice.util.openDialog("seriesTitle  cannot be empty");
		    				   return;
		    			   }
		    			   boxservice.util.startWait();
		    			   boxservice.api.series.getByContractNumber(contractNumber).done(function(contracts){
				    				 if(contracts.length>0){
				    					 boxservice.util.finishWait();
				    					 boxservice.util.openDialog("contract number already exists!");
				    				 }
				    				 else{
				    					 	var newseries={
				    							 contractNumber:contractNumber,
				    							 name:seriesTitle
				    					 	};
				    					 	boxservice.api.series.create(newseries).done(function(){
				    					 		boxservice.api.series.getByContractNumber(contractNumber).done(function(series){
				    					 			boxservice.util.finishWait();
				    					 			if(series.length>0){								    					 
				    					 				boxservice.series.edit(series[0].id,deferred);
								    				 }
				    					 			else{
				    					 				 boxservice.util.openDialog("contractNumber  cannot be found after creatd");
				    					 				 deferred.resolve("back");
				    					 			}
				    					 		});
				    					 						    					 		
				    					 	}).fail(boxservice.util.onError);	
				    					 }
				    				 });
				    			
		    			   });
		    		   });	    			
	    			return deferred.promise();
		   
	   };
	
});