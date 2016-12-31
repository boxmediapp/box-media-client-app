jQuery(document).ready(function ($) {
	boxservice.series={};
	
	
	boxservice.series.uploadImageFile = function (series,originalDeferred) {
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
		boxservice.api.masterimage.listFiles(imagefileName+".").done(function (imageData) {
			boxservice.util.finishWait();
			if (imageData.files.length) {
				boxservice.util.openDialog("Matching image is already exist in the bucket:" + imageData.files[0].file+":"+imagefileName);
			}
			else {
				$("#filennameForUpload").val(imagefileName + ".png");		
				var uploadRequest={
                                         file:boxservice.appinfo.appconfig.imageMasterFolder+"/"+imagefileName + ".png",
                                         bucket:boxservice.appinfo.appconfig.imageBucket                                                            
                                }; 
                                boxservice.api.upload(uploadRequest).done(function (data) {
                                    if (data) {
                                        var deferred = originalDeferred?originalDeferred:$.Deferred();
                                        boxservice.episode.editpage.showS3UploadUploadDialog(series,data,deferred);                                                            
                                    }
                                });

				
			}

		}).fail(boxservice.util.onError);
	};

    boxservice.series.seUpSeriesSortable=function(){
        boxservice.series.listdata.setupSortable(".sort-title",{attributename:"name",sortParametername:"name",loadFunction:boxservice.api.series.list,listItemsFunction:boxservice.series.listSeries});
        boxservice.series.listdata.setupSortable(".sort-contract-number",{attributename:"contractNumber",sortParametername:"contractNumber",loadFunction:boxservice.api.series.list,listItemsFunction:boxservice.series.listSeries});      
        boxservice.util.menu.resetSort();        
    };
    
    
       boxservice.series.listSeries=function(series){   	  
	  
           boxservice.util.finishWait();
	  	
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
		   boxservice.util.scrollPaging(function(){
		              boxservice.series.listdata.nextPage();
		              boxservice.util.startWait();                     
		              boxservice.api.series.list(boxservice.series.listdata).done(function(series){
		                 console.log(":::loaded series:"+series.length);
		                 boxservice.series.listdata.addtolist(series);
		                 boxservice.series.listSeries(series);
		                      
		             }).fail(boxservice.util.onError);
		              
		          },boxservice.series.listdata);
		   
	   });
	  
	  
	  
   };
   boxservice.series.reload=function(){
	   boxservice.series.loadSeriesList();
   };
   boxservice.series.show=function(){
	       boxservice.series.listdata=boxservice.recordlist.createlistdata("#serieslist");       
	       boxservice.series.loadSeriesList();
   };
   boxservice.series.loadSeriesList=function(){
	       		
		var showPage=function(){
			
			boxservice.util.startWait();		
                        $("#content").html(boxservice.series.htmlContent);
	 	        boxservice.api.series.list(boxservice.series.listdata).done(function(series){
        	 	        boxservice.series.listdata.newlist(series);
        	 	        boxservice.series.seUpSeriesSortable();
        	 	        boxservice.series.listSeries(series);
	 	         }).fail(boxservice.util.onError);
	 	        boxservice.util.search(boxservice.series.listdata.search).done(function(search){                                                  
	 	           boxservice.series.listdata.newSearch(search);                               
                           boxservice.series.loadSeriesList();
                        });

		};
		if(boxservice.series.htmlContent){
			showPage();
		}
		else{
				boxservice.util.page.load("series/list.html").done(function(htContent){
				        boxservice.series.htmlContent=htContent;
					showPage();
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
					      $("#confirmDeleteImageDialog .confirm").off("click").on("click", function(){						      
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
				   var getNextEpisodeNumber=function(){
				       var episodeNumber=series.nextEpisodeNumber;
				       if(episodeNumber<10){
				           return "00"+episodeNumber;
				       }
				       else if(episodeNumber<100){
				           return "0"+episodeNumber;
				       }
				       else
				           return ""+episodeNumber;
				   };        
					   
					   
					   var episode={
					    		title:"",
					    		number:"1",
					    		synopsis:"",
					    		programmeNumber:series.contractNumber+"/"+getNextEpisodeNumber(),
					    		warningText:"",
					    		txChannel:boxservice.appinfo.appconfig.autoSetTxChannel,
					    		certType:"ALL_TIMES",
					    		adsupport:"FREE",
					    		ingestProfile:"box-plus-network-1080p-profile",
					    		contentType:boxservice.appinfo.appconfig.autoSetContentType,
					    		series:{
					    			id:series.id										    					    			
					    		}
					    };
					   var htContent=boxservice.util.replaceVariables(htmlContent,series);
					   
					   $("#content").html(htContent);
					   $("#programmeNumber").val(episode.programmeNumber);
					   $("#episodeContentType").val(episode.contentType);
					   $("#txChannel").val(episode.txChannel);
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
			   
			   $("#importEpisodeFromBrightcove").click(function(){
				   boxservice.util.resetInput();
				   $("#importEpisodeFromBCDialog .confirm").off("click").on("click",function(){
					   var brigtcoveid=$("#brightcoveIdToImport").val();
					   if(brigtcoveid){
						   var episodeNumber=$("#episodeNumberForImport").val();
						   var command={
									 command:"import-brightcove-episode",
									 contractNumber:series.contractNumber,
									 brightcoveId:brigtcoveid,
									 episodeNumber:episodeNumber
							 };
							 boxservice.util.startWait();
							 boxservice.api.command(command).done(function(){
								 boxservice.util.finishWait();
								 boxservice.series.edit(series.id,deferred);							 
							 }).fail(boxservice.util.onError);
					   }
				   });
				   $("#importEpisodeFromBCDialog").openModal();
			   });
			   boxservice.episode.listdata.empty();
			   boxservice.episode.list(series.episodes,function(){
			       boxservice.series.edit(series.id,deferred);
			   });
			   
		     
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