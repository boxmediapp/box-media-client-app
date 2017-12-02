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
        boxservice.series.listdata.setupSortable({headerSection:".sort-title",attributename:"name",sortParametername:"name"});
        boxservice.series.listdata.setupSortable({headerSection:".sort-contract-number",attributename:"contractNumber",sortParametername:"contractNumber"});
        boxservice.util.menu.resetSort();
    };


       boxservice.series.listSeries=function(series){

           boxservice.util.finishWait();

	  boxservice.util.pageForEachRecord("series/series-row.html",series,"#serieslist").done(function(){
	           boxservice.series.listdata.autoScroll();
		   $(".serieslink").click(function(){
		       var deferred=boxservice.series.listdata.getBackDeferred();
		       boxservice.initForNewPage();
			var seriesid=$(this).attr("href");
			boxservice.series.edit(seriesid,deferred);
			return false;
		   });
		   $("#addNewSeries").click(function(){
			   boxservice.series.createNewSeries().done(function(){
				   boxservice.series.reload();
			   });
		   });
		   boxservice.util.scrollPaging(boxservice.series.listdata);
	   });



   };
   boxservice.series.reload=function(){
	   boxservice.series.loadSeriesList();
   };
   boxservice.series.createListData=function(opts){
       var createListDataRequest={
               containerSelection:"#serieslist",
               loadItemsFunction:boxservice.api.series.list,
               listItemsFunction:boxservice.series.listSeries,
               onStartList:function(){
                   boxservice.util.startWait();
                   $("#content").html(boxservice.series.htmlContent);
                   boxservice.series.seUpSeriesSortable();
                   boxservice.util.search(boxservice.series.listdata.search).done(function(search){
                      boxservice.series.listdata.newSearch(search);
                      boxservice.series.loadSeriesList();
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
	
   boxservice.series.show=function(){

	       boxservice.series.listdata= boxservice.series.createListData();
	       boxservice.series.loadSeriesList();
   };
   boxservice.series.loadSeriesList=function(){


		if(boxservice.series.htmlContent){
		    boxservice.series.listdata.startList();
		}
		else{
				boxservice.util.page.load("series/list.html").done(function(htContent){
				        boxservice.series.htmlContent=htContent;
				        boxservice.series.listdata.startList();
				});
		}

    };
    boxservice.series.editFields=[{input:{selection:"#seriesName"}, data:{value:["name"]}},
                                  {input:{selection:"#seriesSynopsis"}, data:{value:["synopsis"]}},
  			  		              {input:{selection:"#contractNumber"},  data:{value:["contractNumber"]}},
  			  		              {input:{selection:"#imageURL"},  data:{value:["imageURL"]}},
  			  		              {input:{selection:"#seriesNumber"},  data:{value:["seriesNumber"]}},
  			  		              {input:{selection:"#maxNumberOfEpisodes"},  data:{value:["maxNumberOfEpisodes"]}},
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
			$("#importEpisodeFromBrightcove").hide();

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
			if(series.episodes &&  series.episodes.length && series.maxNumberOfEpisodes && series.episodes.length >= series.maxNumberOfEpisodes){
			    $("#importEpisodeFromBrightcove").hide();
			    $("#addNewEpisodeToSeries").hide();
			}
			else{

			    $("#importEpisodeFromBrightcove").show();
                            $("#addNewEpisodeToSeries").show();
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

				   	  boxservice.util.form.initInputFields(series,boxservice.series.editFields);
				   	  var editTagRequest={
				   	          tags:series.tags,
				   	          markEditing:function(){
				   	             boxservice.series.inputDirty=true;
                                                     boxservice.series.checkStatus(series);
				   	          },
				   	          markDirty:function(){
				   	              console.log("tags are not consistent");
				   	              boxservice.series.inputDirty=true;
				   	              boxservice.util.openDialog("The tags appears to be inconsistent, not editable");
				   	          }
				   	  }
				   	boxservice.tags.requestEdit(editTagRequest);

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
				   var tags=boxservice.tags.getTagsFromUI();
		  			if(boxservice.util.form.valueHasChanged(series,boxservice.series.editFields) ||  boxservice.tags.checkChanged({tags:tags,org:{tags:series.tags}})){
		  				boxservice.util.form.update(series,boxservice.series.editFields);
		  				series.tags=tags;
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
					    		programmeNumber:series.contractNumber+"/"+getNextEpisodeNumber(),
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

					   boxservice.util.resetInput();


					   $("#createNewEpisode .cancel").click(function(){
						   boxservice.series.edit(series.id,deferred);
					   });
					   $("#createNewEpisode .create").click(function(){

					   	 	  episode.title=$("#episodeTitle").val();
					   	 	  episode.programmeNumber=$("#programmeNumber").val();
					   	 	  if(episode.title){
					   	 	     episode.title=episode.title.trim();
					   	 	  }
					   	 	  if(episode.programmeNumber){
					   	 	          episode.programmeNumber=episode.programmeNumber.trim();
					   	 	  }
					   	 	  if(!episode.title || !episode.programmeNumber){
					   	 	      return;
					   	 	  }
							  console.log(JSON.stringify(episode));
							  boxservice.util.startWait();
							  boxservice.api.episode.create(episode).done(function(createdEpisode){
							          boxservice.util.finishWait();
							          console.log("created::::"+JSON.stringify(createdEpisode));
							          var tdeferred=$.Deferred();
							           tdeferred.promise().done(function(){
							               boxservice.series.edit(series.id,deferred);
							           });

								  boxservice.episode.edit(createdEpisode.id,tdeferred);

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
			   boxservice.episode.listdata=boxservice.episode.createListData({backCallback:function(){
			       boxservice.series.edit(series.id,deferred);
			   }});


			   boxservice.episode.listdata.completeItems(series.episodes);
			   boxservice.episode.seUpEpisodeSortable();
			   boxservice.episode.listEpisodes(series.episodes);


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
