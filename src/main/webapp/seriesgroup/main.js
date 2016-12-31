jQuery(document).ready(function ($) {
	boxservice.seriesgroup={};
	
	
	boxservice.seriesgroup.loadEditSeriesGroupPage=function(){    	    
    	return boxservice.util.page.load("seriesgroup/edit.html");
    };
    boxservice.seriesgroup.reload=function(){
    	boxservice.seriesgroup.loadSeriesGroupList();
    };
    
    
    
    
    boxservice.seriesgroup.uploadImageFile=function(seriesgroup){
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
				$("#uploadFileNameDialog").openModal();
				boxservice.util.resetInput();
			}

		}).fail(boxservice.util.onError);
    };
    
    
    
    
    
    boxservice.seriesgroup.editFields=[{input:{selection:"#seriesGroupTitle"}, data:{value:["title"]}},
                                       {input:{selection:"#seriesGroupSynopsis"}, data:{value:["synopsis"]}},
                                       {input:{selection:"#seriesGroupTags"}, data:{value:["tags"]}},
                                       {input:{selection:"#imageURL"}, data:{value:["imageURL"]}}
                                       ];
    
    boxservice.seriesgroup.seUpSeriesGroupSortable=function(){
        boxservice.seriesgroup.listdata.setupSortable(".sort-title",{attributename:"title",sortParametername:"title",loadFunction:boxservice.api.seriesgroup.list,listItemsFunction:boxservice.seriesgroup.listSeriesGroup});              
        boxservice.util.menu.resetSort();        
    };
	boxservice.seriesgroup.show=function(){
	    boxservice.seriesgroup.listdata=boxservice.recordlist.createlistdata("#seriesgroupslist");       
            boxservice.seriesgroup.loadSeriesGroupList();
	};
	boxservice.seriesgroup.loadSeriesGroupList=function(){	    
		var showPage=function(){
			       boxservice.util.startWait();
			       $("#content").html(boxservice.seriesgroup.htmlContent);
			       
			       boxservice.api.seriesgroup.list(boxservice.seriesgroup.listdata).done(function(seriesgroup){
    			          boxservice.seriesgroup.listdata.newlist(seriesgroup);
    			          boxservice.seriesgroup.seUpSeriesGroupSortable();
    			          boxservice.seriesgroup.listSeriesGroup(seriesgroup);
				}).fail(boxservice.util.onError);
			       boxservice.util.search(boxservice.seriesgroup.listdata.search).done(function(search){
			                boxservice.seriesgroup.listdata.newSearch(search);
			                boxservice.seriesgroup.show(search,0);
			                boxservice.seriesgroup.loadSeriesGroupList();
			        });
			        
		};
		if(boxservice.seriesgroup.htmlContent){
			showPage();
		}
		else{
			boxservice.util.page.load("seriesgroup/list.html").done(function(htContent){
			        boxservice.seriesgroup.htmlContent=htContent;
				showPage();
			});			
		}
		
		
    };
    boxservice.seriesgroup.listSeriesGroup=function(seriesgroup){
                boxservice.util.finishWait();       
                boxservice.util.pageForEachRecord("seriesgroup/series-group-row.html",seriesgroup,"#seriesgroupslist").done(function(){
                        $(".seriesgrouplink").click(function(){
                                var seriesgroupid=$(this).attr("href");
                                boxservice.seriesgroup.edit(seriesgroupid).done(function(){                                                             
                                        boxservice.seriesgroup.reload();
                                });
                                return false;
                        }); 
                        boxservice.util.scrollPaging(function(){
                            boxservice.seriesgroup.listdata.nextPage();
                            boxservice.util.startWait();                     
                            boxservice.api.seriesgroup.list(boxservice.seriesgroup.listdata).done(function(seriesgroup){
                               console.log(":::loaded seriesgroup:"+seriesgroup.length);
                               boxservice.seriesgroup.listdata.addtolist(seriesgroup);
                               boxservice.seriesgroup.listSeriesGroup(seriesgroup);                                    
                           }).fail(boxservice.util.onError);
                            
                        },boxservice.seriesgroup.listdata);
                        
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
		   
		   boxservice.api.tags.list().done(function(tags){
			   	  boxservice.util.form.populateOptions(tags,"#seriesGroupTags");
			   	  boxservice.util.form.initInputFields(seriesgroup,boxservice.seriesgroup.editFields);
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
				
				  
				  
		   });
		   
		   
		   boxservice.util.pageForEachRecord("seriesgroup/series-row.html",seriesgroup.series,"#serieslist").done(function(){
			  $("#serieslist a").click(function(){
				  var seriesid=$(this).attr("href");
				  console.log("**:"+seriesid);
				  try{
					  boxservice.series.edit(seriesid).done(function(){
						  boxservice.seriesgroup.edit(seriesgroup.id,deferred);
					  });
				  }
				  catch(err){
					  console.log(err);
				  }
				  
				  return false;
			  }); 
			   
		   });
		   
		   
		     
			  $("#uploadImageFile").click(function () {
					boxservice.seriesgroup.uploadImageFile(seriesgroup);
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
			  
			  
			  $("#uploadFileNameDialog .cancel").click(function () {

			  });
			  $("#uploadFileNameDialog .confirm").click(function () {
				  boxservice.util.uploadFileDialog(boxservice.api.masterimage.listFiles,function(){
					  boxservice.seriesgroup.edit(seriesgroup.id,deferred);
				  }, boxservice.api.masterimage.uploadfileurl());							 
			  });

			  
			  
			  
			  $("#saveSeriesGroup").click(function(){
				  boxservice.seriesgroup.inputDirty=false;
				  					  
				  if(boxservice.util.form.valueHasChanged(seriesgroup,boxservice.seriesgroup.editFields)){
					    boxservice.util.startWait();
					    boxservice.util.form.update(seriesgroup,boxservice.seriesgroup.editFields);
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