jQuery(document).ready(function ($) {	
	boxservice.api={};
	boxservice.api.cue={};
	boxservice.api.episode={};
	boxservice.api.schedules={};
	boxservice.api.series={};
	boxservice.api.seriesgroup={};
	boxservice.api.c4={};
	boxservice.api.bc={};
	boxservice.api.bc.video={};
	boxservice.api.users={};
	
	
	boxservice.api.boxvideo={};
	boxservice.api.masterimage={};
	
	boxservice.api.tags={};
	boxservice.api.task={};
	boxservice.api.episode={};
	boxservice.api.availability={};

	var apipath="/mule/boxtv";
	
	//apipath="http://localhost:9081"+apipath;
	boxservice.api.bc.getNotificationURL=function(episode){
		return apipath+"/bc/notification/"+episode.episodeStatus.transcodeJobId;
	};
	
	boxservice.api.episode.getDetailsUrl=function(episodid){
		return apipath+"/episodes/"+episodid;
	};
	
	
	boxservice.api.episode.soundMouseHeaderFileUrl=function(episodid){
		return apipath+"/soundmouse/"+episodid+"/header";
	};
	boxservice.api.episode.soundMouseSmurfFileUrl=function(episodid){
		return apipath+"/soundmouse/"+episodid+"/smurf";
	};
	boxservice.api.episode.bcAnalysticsUrl=function(videoid){
		return apipath+"/bc/analytics/data?videoid="+videoid;		
	};
	
	boxservice.api.episode.soundMouseCommand=function(mediaCommand){		  
		  return boxservice.api.ajax("POST", apipath+"/soundmouse",mediaCommand);			
	};

	
	boxservice.api.boxvideo.uploadfileurl=function(){		
		   return apipath+"/box-video";			
	};	
	boxservice.api.masterimage.uploadfileurl=function(){			
	     return  apipath+"/box-images/master";		 
	};
	 
	  
	boxservice.api.ajax=function(methodname,path,data){
		if(data){
			return $.ajax({
        		type: methodname,
        		url: path,
        		dataType: "json",	
        		contentType:"application/json",
        		data: JSON.stringify(data),
        		beforeSend: function (xhr) {
	        	    if(boxservice.api.username&& boxservice.api.password){
	        	    	xhr.setRequestHeader ("Authorization", "Basic " + btoa(boxservice.api.username+":"+boxservice.api.password));
	        	    }
	        	}
        		});
		}
		else{
			return $.ajax({
			    type: methodname,
			    url: path,
			    dataType: "json",
			    beforeSend: function (xhr) {
	        	    if(boxservice.api.username&& boxservice.api.password){
	        	    	xhr.setRequestHeader ("Authorization", "Basic " + btoa(boxservice.api.username+":"+boxservice.api.password));
	        	    }
	        	}
			   });	
		}
	};
	boxservice.api.cue.create=function(episode,cue){
	     return boxservice.api.ajax("POST",apipath+"/cue/"+episode.id,cue);
   };
   boxservice.api.cue.list=function(episode){
	     return boxservice.api.ajax("GET",apipath+"/cue/"+episode.id);
   };
   boxservice.api.cue.remove=function(episode,cueid){
	     return boxservice.api.ajax("DELETE",apipath+"/cue/"+episode.id+"/"+cueid);
   };
   
   boxservice.api.cue.update=function(episode,cue){
	   return boxservice.api.ajax("PUT",apipath+"/cue/"+episode.id+"/"+cue.id,cue);
   };
 

   
  boxservice.api.availability.create=function(episode,availability){
	     return boxservice.api.ajax("POST",apipath+"/availability/"+episode.id,availability);
  };
  boxservice.api.availability.list=function(episode){
	     return boxservice.api.ajax("GET",apipath+"/availability/"+episode.id);
  };
  boxservice.api.availability.remove=function(episode,availabilityid){
	     return boxservice.api.ajax("DELETE",apipath+"/availability/"+episode.id+"/"+availabilityid);
  };
  
  boxservice.api.availability.update=function(episode,availability){
	   return boxservice.api.ajax("PUT",apipath+"/availability/"+episode.id+"/"+availability.id,availability);
  };

   
   
  boxservice.api.episode.changePublishedStatus=function(episodeid, publishedStatus){ 	  	  	  
	    	 var episode={
	    			 id:episodeid,
	    			 episodeStatus:{
	    				 publishedStatus:publishedStatus
	    			  }	    			  
	    	 };
	    	 return boxservice.api.episode.create(episode); 
   };
   boxservice.api.episode.addEditorNotes=function(episodeid, editorNotes){
	 if(!editorNotes){
		 editorNotes="null"; 
	 }
  	 var episode={
  			 id:episodeid,
  			 editorNotes:editorNotes		  
  	 };
  	 return boxservice.api.episode.create(episode); 
   };
 
	boxservice.api.episode.list=function(search, start){
		 var path=apipath+"/episodes";
		 if(search){
			 path=path+"?search="+search;
			 if(start){
				 path=path+"&start="+start;
			 }			 
		 }
		 else{
			 if(start){
				 path=path+"?start="+start;
			 }
		 }
		 
		 return boxservice.api.ajax("GET",path);		 			   
	};
    	 
	boxservice.api.series.list=function(search, start){
		 var path=apipath+"/series";
		 if(search){
			 path=path+"?search="+search;
			 if(start){
				 path=path+"&start="+start;
			 }			 
		 }
		 else{
			 if(start){
				 path=path+"?start="+start;
			 }
		 }
		 
		 return boxservice.api.ajax("GET",path);		 			   
	};
	boxservice.api.series.getByContractNumber=function(contractNumber){
		 var path=apipath+"/series?contractNumber="+contractNumber;
		 return boxservice.api.ajax("GET",path);		 			   
	};

	
	boxservice.api.series.remove=function(series){
		return boxservice.api.ajax("DELETE",apipath+"/series/"+series.id);
	};
	boxservice.api.series.create=function(series){
	     return boxservice.api.ajax("POST",apipath+"/series",series);
    };

	
	boxservice.api.seriesgroup.list=function(search,start){		   
		   var path=apipath+"/seriesgroup";
			 if(search){
				 path=path+"?search="+search;
				 if(start){
					 path=path+"&start="+start;
				 }			 
			 }
			 else{
				 if(start){
					 path=path+"?start="+start;
				 }
			 }
			 
			 return boxservice.api.ajax("GET",path);
    };
    boxservice.api.seriesgroup.update=function(seriesgroupid,seriesgroup){
		   return boxservice.api.ajax("PUT",apipath+"/seriesgroup/"+seriesgroupid,seriesgroup);		   
    };
    
    boxservice.api.seriesgroup.create=function(seriesgroup){
		   return boxservice.api.ajax("POST",apipath+"/seriesgroup",seriesgroup);		   
    };
    
    boxservice.api.seriesgroup.remove=function(seriesgroup){
		   return boxservice.api.ajax("DELETE",apipath+"/seriesgroup/"+seriesgroup.id);		   
    };
    
    boxservice.api.seriesgroup.view=function(seriesgroupid){
		   return boxservice.api.ajax("GET",apipath+"/seriesgroup/"+seriesgroupid);		   			   
     };
    boxservice.api.seriesgroup.getByTitle=function(seriesGroupTitle){
		   return boxservice.api.ajax("GET",apipath+"/seriesgroup?title="+seriesGroupTitle);		   			   
   };
     
	boxservice.api.tags.list=function(){
		return boxservice.api.ajax("GET",apipath+"/tags");		   			   
	};
	boxservice.api.tags.remove=function(tag){
		return boxservice.api.ajax("DELETE",apipath+"/tags/"+tag);		   			   
	};
	boxservice.api.tags.add=function(tag){
		return boxservice.api.ajax("POST",apipath+"/tags",tag);
	}; 
	boxservice.api.episode.view=function(episodeid){  	  
		return boxservice.api.ajax("GET",apipath+"/episodes/"+episodeid);	        
	};	   
    boxservice.api.series.view=function(seriesid){  	   
	       return boxservice.api.ajax("GET",apipath+"/series/"+seriesid);	        
   };
   boxservice.api.series.update=function(seriesid, series,updatetype){
	   if(updatetype){
		   return boxservice.api.ajax("PUT",apipath+"/series/"+seriesid+"?update="+updatetype,series);
	   }
	   else{
		   return boxservice.api.ajax("PUT",apipath+"/series/"+seriesid,series);
	   }
      	        
   };  
   boxservice.api.episode.update=function(episodeid, episode, updatetype){
	   if(updatetype){
		   	return boxservice.api.ajax("PUT",apipath+"/episodes/"+episodeid+"?update="+updatetype,episode);
	   }
	   else{
	       	return boxservice.api.ajax("PUT",apipath+"/episodes/"+episodeid,episode);
	   }
   };
   
   
  boxservice.api.episode.create=function(episode){ 	   
      return boxservice.api.ajax("POST",apipath+"/episodes",episode);	        
  };
  
  boxservice.api.episode.remove=function(episode){
	  return boxservice.api.ajax("DELETE",apipath+"/episodes/"+episode.id);
  };
  boxservice.api.schedules.list=function(){
	  return boxservice.api.ajax("GET",apipath+"/schedules");		    
  };
  boxservice.api.c4.import=function(scheduleRequest){
	  return boxservice.api.ajax("POST",apipath+"/import/schedules",scheduleRequest);		    			 			 
  };
  
   boxservice.api.task.create=function(task){
	   return boxservice.api.ajax("POST",apipath+"/tasks",task);			 			 			
  };
  
		
  boxservice.api.task.list=function(){
	   return boxservice.api.ajax("GET",apipath+"/tasks");			 			 			 
  };
  
  boxservice.api.task.remove=function(id){
	   return boxservice.api.ajax("DELETE",apipath+"/tasks/"+id);			 			 			 
  };
  
  
  boxservice.api.task.appinfo=function(){
	   return boxservice.api.ajax("GET", apipath+"/app/info");			
  };
  boxservice.api.task.updateappinfo=function(appinfo){	   			
	   return boxservice.api.ajax("PUT",apipath+"/app/info",appinfo);
 };
 
  boxservice.api.command=function(command){
	   return boxservice.api.ajax("POST",apipath+"/commands",command);			 			 			
 };
  
  
 boxservice.api.bc.video.list=function(){
	  return boxservice.api.ajax("GET",apipath+"/bc/video?limit=30");			
  };
  
 
  boxservice.api.bc.video.view=function(videoid){
	  return boxservice.api.ajax("GET",apipath+"/bc/video/"+videoid);			
  };
  
  boxservice.api.bc.publish=function(episode){			
	  return boxservice.api.ajax("POST",apipath+"/bc/publish/"+episode.id,episode);			
  };
  boxservice.api.bc.unpublish=function(episode){			
	  return boxservice.api.ajax("DELETE",apipath+"/bc/publish/"+episode.id,episode);			
  };		
  boxservice.api.bc.ingest=function(ingestRequest){				
	  return boxservice.api.ajax("POST",apipath+"/bc/ingest",ingestRequest);	       
  };
  
  boxservice.api.bc.importcsv=function(csvContent){				
	  
	  return $.ajax({
  		type: "POST",
  		url: apipath+"/bc/import/csv",  			
  		contentType:"txt/plain",
  		data:csvContent,
  		beforeSend: function (xhr) {
      	    if(boxservice.api.username&& boxservice.api.password){
      	    	xhr.setRequestHeader ("Authorization", "Basic " + btoa(boxservice.api.username+":"+boxservice.api.password));
      	    }
      	}
  		});
	  
  };
  
  
  boxservice.api.boxvideo.listFiles=function(prefix){			
	  var path=apipath+"/box-video";
		 if(prefix){
			 path=path+"?prefix="+prefix;			 			 
		 }
		 return boxservice.api.ajax("GET",path);
		 
  };

  boxservice.api.masterimage.listFiles=function(prefix){			
	  var path=apipath+"/box-images/master";
		 if(prefix){
			 path=path+"?prefix="+prefix;			 			 
		 }
		 return boxservice.api.ajax("GET",path);
		 
  };
  boxservice.api.masterimage.deleteSeriesImage=function(seriesid,imagefile){
	     var path=apipath+"/box-images/master/series/"+seriesid+"/"+imagefile;		 
		 return boxservice.api.ajax("DELETE",path);
  };
  boxservice.api.masterimage.deleteEpisodeImage=function(episodeid,imagefile){
	     var path=apipath+"/box-images/master/episode/"+episodeid+"/"+imagefile;		 
		 return boxservice.api.ajax("DELETE",path);
  };

  
  boxservice.api.boxvideo.presginedurl=function(url, httpMethod){
       if(httpMethod){
           return boxservice.api.ajax("GET",apipath+"/presigned?httpMethod="+httpMethod+"&url="+url);
       }
       else{
           return boxservice.api.ajax("GET",apipath+"/presigned?url="+url);
       }
	   			
  };		
  
  
  
  

   boxservice.api.users.list=function(){
	   return boxservice.api.ajax("GET", apipath+"/users");			
	};
	
	boxservice.api.users.create=function(user){
			  return boxservice.api.ajax("POST", apipath+"/users",user);			
	};
	boxservice.api.users.deleteUser=function(username){
			  return boxservice.api.ajax("DELETE", apipath+"/users/"+username);			
	};
	boxservice.api.users.updateUser=function(user){
		  return boxservice.api.ajax("PUT", apipath+"/users/"+user.username,user);		  
	};
		
	boxservice.api.users.signoutUser=function(){
			return $.ajax({
	        	type: "GET",
	        	url: apipath+"/users",	        	
	        	beforeSend: function (xhr) {
	        	    xhr.setRequestHeader ("Authorization", "Basic " + btoa("root:rootisinvalid"));
	        	}
	        });
	 };
		boxservice.api.users.signinUser=function(username,password){
			
			return $.ajax({
	        	type: "GET",
	        	url: apipath+"/users",	        	
	        	beforeSend: function (xhr) {
	        	    xhr.setRequestHeader ("Authorization", "Basic " + btoa(username+":"+password));
	        	}
	        });
		};
		
			  	
});