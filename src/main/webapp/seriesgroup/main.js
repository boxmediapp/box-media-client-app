jQuery(document).ready(function ($) {
	boxservice.seriesgroup={};
	
	
	boxservice.seriesgroup.loadEditSeriesGroupPage=function(){    	    
    	return boxservice.util.page.load("seriesgroup/edit.html");
    };
    boxservice.seriesgroup.reload=function(){
    	boxservice.seriesgroup.loadSeriesGroupList();
    };
    
    
    
    
    
    
    
    boxservice.seriesgroup.uploadImageFile=function(seriesgroup,deferred){
    	if (boxservice.seriesgroup.inputDirty) {
			boxservice.util.openDialog("Please save it first: click on the 'save' button");
			return;
		}

		if (!seriesgroup.title) {
			boxservice.util.openDialog("You have to provide a unique title in order to uniquely name the image");
			return;
		}
		var imagefileName =boxservice.util.websafeTitle(seriesgroup.title);
		console.log("checking the exitence of the image:" + imagefileName);
		boxservice.util.startWait();
		boxservice.api.masterimage.listFiles(imagefileName).done(function (imageData) {
			boxservice.util.finishWait();
			if (imageData.files.length) {
				boxservice.util.openDialog("Matching image is already exist in the bucket:" + imageData.files[0].file);
			}
			else {
				$("#filennameForUpload").val(imagefileName + ".png");		
				boxservice.episode.editpage.processFileNameDialog(seriesgroup,boxservice.api.masterimage.listFiles, function(uploadFilename){
                                    var uploadRequest={
                                            file:boxservice.appinfo.appconfig.imageMasterFolder+"/"+uploadFilename,
                                            bucket:boxservice.appinfo.appconfig.imageBucket                                                            
                                    }; 
                                    boxservice.api.upload(uploadRequest).done(function (data) {                                                    
                                        if (data) {
                                            boxservice.episode.editpage.showS3UploadUploadDialog(seriesgroup,data,deferred);                                                            
                                        }
                                    });
                                  }); 
				
			}

		}).fail(boxservice.util.onError);
    };
    
    
    
    
    
    boxservice.seriesgroup.editFields=[{input:{selection:"#seriesGroupTitle"}, data:{value:["title"]}},
                                       {input:{selection:"#seriesGroupSynopsis"}, data:{value:["synopsis"]}},                                       
                                       {input:{selection:"#imageURL"}, data:{value:["imageURL"]}}
                                       ];
    
    
    boxservice.seriesgroup.seUpSeriesGroupSortable=function(){
        boxservice.seriesgroup.listdata.setupSortable({headerSection:".sort-title",attributename:"title",sortParametername:"title"});              
        boxservice.util.menu.resetSort();        
    };
    
    
	boxservice.seriesgroup.show=function(){
	    var createListDataRequest={
	             containerSelection:"#seriesgroupslist",
	             loadItemsFunction:boxservice.api.seriesgroup.list,
	             listItemsFunction:boxservice.seriesgroup.listSeriesGroup,
	             onStartList:function(){
	                     boxservice.util.startWait();
	                     $("#content").html(boxservice.seriesgroup.htmlContent);
                             boxservice.seriesgroup.seUpSeriesGroupSortable();                             
                             boxservice.util.search(boxservice.seriesgroup.listdata.search).done(function(search){
                                   boxservice.seriesgroup.listdata.newSearch(search);                                   
                                   boxservice.seriesgroup.loadSeriesGroupList();
                             });
	             }
	    };
	    boxservice.seriesgroup.listdata=boxservice.recordlist.createlistdata(createListDataRequest);
            boxservice.seriesgroup.loadSeriesGroupList();
	};
	boxservice.seriesgroup.loadSeriesGroupList=function(){	    
		
		if(boxservice.seriesgroup.htmlContent){
		    boxservice.seriesgroup.listdata.startList();
		}
		else{
			boxservice.util.page.load("seriesgroup/list.html").done(function(htContent){
			        boxservice.seriesgroup.htmlContent=htContent;
			        boxservice.seriesgroup.listdata.startList();
			});			
		}
       };
    boxservice.seriesgroup.listSeriesGroup=function(seriesgroup){
                boxservice.util.finishWait();       
                boxservice.util.pageForEachRecord("seriesgroup/series-group-row.html",seriesgroup,"#seriesgroupslist").done(function(){
                    boxservice.seriesgroup.listdata.autoScroll();
                        $(".seriesgrouplink").click(function(){
                                var deferred=boxservice.seriesgroup.listdata.getBackDeferred();
                                boxservice.initForNewPage();
                                var seriesgroupid=$(this).attr("href");
                                boxservice.seriesgroup.edit(seriesgroupid,deferred);
                                return false;
                        }); 
                        boxservice.util.scrollPaging(boxservice.seriesgroup.listdata);
                        
                        
                });
                
                 
                $("#addNewSeriesGroup").click(function(){
                        boxservice.util.page.load("seriesgroup/create-new-series-group.html").done(function(htmlContent){
                                 var seriesgroup={
                                              title:"",                                                                               
                                              synopsis:""                                                             
                                  };                                             
                                 
                                 $("#content").html(htmlContent);
                                 $("#cancelCreateSeriesGroup").click(function(){
                                         boxservice.seriesgroup.reload();
                                 });
                                 $("#crateNewSeriesGroup").click(function(){                     
                                                boxservice.util.startWait();                                    
                                                boxservice.util.form.update(seriesgroup,boxservice.seriesgroup.editFields);
                                                console.log(JSON.stringify(seriesgroup));
                                
                                                var seriesgroupdatapromise=boxservice.api.seriesgroup.create(seriesgroup);
                                                seriesgroupdatapromise.done(function(){
                                                        boxservice.util.finishWait();
                                                        boxservice.seriesgroup.reload();
                                                 }).fail(function(err){
                                                         boxservice.util.openDialog("Failed"+JSON.stringify(err));
                                                         boxservice.util.finishWait();
                                                 });
                                                                                              
                                       
                                 });
                                         
                                 
                        });
                        
                });
                
    }
    
    boxservice.seriesgroup.resetStatus=function(){
		 boxservice.seriesgroup.inputDirty=false;
	 };
   boxservice.seriesgroup.checkStatus=function(seriesgroup){
   	if(boxservice.seriesgroup.inputDirty){
   		$("#saveSeriesGroup").show();    		
			$("#cancelSaveSeriesGroup").show();
			$("#deleteSeriesGroup").hide();
			$("#viewImage").hide();
			
			
   	}
   	else{
   			$("#saveSeriesGroup").hide();    		
			$("#cancelSaveSeriesGroup").hide();
			if(seriesgroup.series && seriesgroup.series.length>0){
				$("#deleteSeriesGroup").hide();
			}
			else{
				$("#deleteSeriesGroup").show();
			}
			if(seriesgroup.imageURL){
				  $("#viewImage").show();					  
			  }
			  else{
				  $("#viewImage").hide();
			  }
   	}
   	
   };
    
    
    
    boxservice.seriesgroup.edit=function(seriesgroupid,originalDeferred){    	
    	var deferred = originalDeferred?originalDeferred:$.Deferred();    	
    	if(!seriesgroupid){
 		   boxservice.util.openDialog("seriesgroupid is null");
 		   deferred.reject("seriesgroupid is null"); 		    		   
 	    }
    	else{
    		boxservice.seriesgroup.loadEditSeriesGroupPage().done(function(htmlContent){    	   				   
    			$("#content").html(htmlContent);
    			$("#backButton").click(function(){deferred.resolve("back");});
	    		boxservice.api.seriesgroup.view(seriesgroupid).done(function(seriesgroup){
	    			boxservice.seriesgroup.editSeriesGroup(seriesgroup,deferred);
	    		}).fail(boxservice.util.onError);       
    		});
    	}    	
    	return deferred.promise();    	    
    };
    
    boxservice.seriesgroup.editSeriesGroup=function(seriesgroup,deferred){
			   	 
			   	  boxservice.util.form.initInputFields(seriesgroup,boxservice.seriesgroup.editFields);
			   	  
			   	var editTagRequest={
                                        tags:seriesgroup.tags,
                                        markEditing:function(){
                                            boxservice.seriesgroup.inputDirty=true;
                                            boxservice.seriesgroup.checkStatus(seriesgroup);
                                        },
                                        markDirty:function(){
                                            console.log("tags are not consistent");
                                            boxservice.seriesgroup.inputDirty=true;
                                            boxservice.util.openDialog("The tags appears to be inconsistent, not editable");
                                        }
                                }
                              boxservice.tags.requestEdit(editTagRequest);
			   	  
				  boxservice.util.resetInput();				  
					  

				  
				  var isDataNotConsistent=boxservice.util.form.valueHasChanged(seriesgroup,boxservice.seriesgroup.editFields);			  
				  if(isDataNotConsistent){
					  	 $("#saveSeriesGroup").hide();
			  			 boxservice.util.openDialog("The fields appears to be inconsistent, not editable:"+isDataNotConsistent);		  			
		    			return;
		    	  }
			   
				  boxservice.seriesgroup.resetStatus();
				  boxservice.seriesgroup.checkStatus(seriesgroup);
				  
				  boxservice.util.form.inputChangedCallback(boxservice.seriesgroup.editFields, function(){
					  boxservice.seriesgroup.inputDirty=true;
					  boxservice.seriesgroup.checkStatus(seriesgroup);
				  });
				  boxservice.util.tooltip();
				
				  
				  
		   
		   boxservice.series.listdata=boxservice.series.createListData({backCallback:function(){                           
                       boxservice.seriesgroup.edit(seriesgroup.id,deferred);
                   }});
		   boxservice.series.listdata.completeItems(seriesgroup.series);                           
		   boxservice.series.seUpSeriesSortable();                               
		   boxservice.series.listSeries(seriesgroup.series);
		     
			  $("#uploadImageFile").click(function () {
					boxservice.seriesgroup.uploadImageFile(seriesgroup,deferred);
				});
			  
			 
			 
			  
			  
			  
			  
			  
			  
			  
			  $("#cancelSaveSeriesGroup").click(function(){
				  boxservice.seriesgroup.inputDirty=false;
				  boxservice.seriesgroup.edit(seriesgroup.id,deferred);
				  return false;
	    	  });
			  
			  
			  $("#viewImage").click(function(){
					boxservice.images.show(seriesgroup.imageURL,function(){
						boxservice.seriesgroup.edit(seriesgroup.id,deferred);				
					});
					return false;
				});
			  
			  
			  
			  
			  
			  
			  $("#saveSeriesGroup").click(function(){
				  boxservice.seriesgroup.inputDirty=false;
				  var tags=boxservice.tags.getTagsFromUI();					  
				  if(boxservice.util.form.valueHasChanged(seriesgroup,boxservice.seriesgroup.editFields) || boxservice.tags.checkChanged({tags:tags,org:{tags:seriesgroup.tags}})){
					    boxservice.util.startWait();
					    boxservice.util.form.update(seriesgroup,boxservice.seriesgroup.editFields);
					    seriesgroup.tags=tags;
					    var updatepromise=boxservice.api.seriesgroup.update(seriesgroup.id,seriesgroup);
					    updatepromise.done(function(){
							  boxservice.util.finishWait();
							  boxservice.seriesgroup.edit(seriesgroup.id,deferred);
						   }).fail(function(err){
							   boxservice.util.openDialog("Failed"+JSON.stringify(err));
							   boxservice.util.finishWait();
						   });
				  }
				  else{
					  boxservice.seriesgroup.edit(seriesgroup.id,deferred);
				  }
				  
				  
	    	  });
			  $("#deleteSeriesGroup").unbind("click").click(function(){
				  		boxservice.api.seriesgroup.remove(seriesgroup).done(function(){
					   	boxservice.seriesgroup.reload();
					  }).fail(boxservice.util.onError); 
			   });
			  
			   
			  $("#addNewSeriesToSeriesGroup").click(function(){
				   
				   boxservice.util.page.load("seriesgroup/create-new-series.html").done(function(htmlContent){
					
					   
					   
					   var series={
					    		name:"",								    		
					    		synopsis:"",
					    		contractNumber:"",								    		
					    		seriesGroup:{
					    			id:seriesgroup.id										    					    			
					    		}
					    };
					   
					   var htContent=boxservice.util.replaceVariables(htmlContent,seriesgroup);
					   $("#content").html(htContent);
					   
					   $("#cancelCreateSeries").click(function(){			   
						   boxservice.seriesgroup.edit(seriesgroup.id,deferred);
					   }); 
					   
					   $("#crateNewSeries").click(function(){			   
					   	 	  boxservice.util.startWait();					  
							  boxservice.util.form.update(series,boxservice.series.editFields);
							  console.log(JSON.stringify(series));
			                  
							  var seriesdatapromise=boxservice.api.series.create(series);
							  seriesdatapromise.done(function(){
								  boxservice.util.finishWait();
								  boxservice.seriesgroup.edit(seriesgroup.id,deferred);
							   }).fail(function(err){
								   boxservice.util.openDialog("Failed"+JSON.stringify(err));
								   boxservice.util.finishWait();
							   });
							  		     				
				 		 
					   });
					   
					   
					   
					   
				   }).fail(boxservice.util.onError);
				   
			   });
    };
	
	
});