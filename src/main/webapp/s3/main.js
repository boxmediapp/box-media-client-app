jQuery(document).ready(function ($) {
	
	boxservice.s3={};
   
	var seUpS3Sortable=function(s3filelist){
		boxservice.util.menu.resetSort();
    	var setUpSortS3files=function(sortHeader, sortFunction){
    		boxservice.util.menu.configSort(sortHeader,sortFunction,s3filelist,boxservice.s3.list);
    	};
    	setUpSortS3files(".sort-file",function(a,b){
    		if (a.file < b.file) 
    			 return 1; 
    		else if (a.file > b.file)
    			return -1;
    		else
    			return 0;
    	});
    	setUpSortS3files(".sort-title",function(a,b){
    		if (a.episodeTitle < b.episodeTitle)
    		    return -1;
    		else if (a.episodeTitle > b.episodeTitle)
    		    return 1;
    		  return 0;
    	});
    	setUpSortS3files(".sort-last-modified",function(a,b){
    		if (a.lastModifidDate < b.lastModifidDate)
    		    return -1;
    		else if (a.lastModifidDate > b.lastModifidDate)
    		    return 1;
    		  return 0;
    	});
    	setUpSortS3files(".sort-duration-error",function(a,b){
    		if(typeof  a.durationError =="undefined"|| a.durationError == null ) {
    			if(typeof  b.durationError =="undefined" || b.durationError == null ) {
    				return 0;
    			}
    			else{
    				return -1;
    			}
    		}
    		else if(typeof  b.durationError =="undefined" || b.durationError == null ) {
				return 1;
			}
			else if (Math.abs(a.durationError) < Math.abs(b.durationError)){
    		    return -1;
			}
    		else if (Math.abs(a.durationError) > Math.abs(b.durationError)){
    		    return 1;
    		}
    		else {
    			return 0;
    		}
    	});
    	
    	
    	
    };
		
    
    boxservice.s3.list=function(s3filelist){

    	boxservice.util.finishWait();
    	
    	
    	var config={types:{"lastModifidDate":"datetime"}};	   
    	 $("#s3filelist").empty();
		  boxservice.util.pageForEachRecord("s3/row.html",s3filelist,"#s3filelist",config).done(function(){
			  $(".episodelink").click(function(){
				  var episodeid=$(this).attr("href");
				  boxservice.episode.edit(episodeid).done(function(){
					  boxservice.s3.show();
				  });
				  return false;
			  });
			  
			  $(".playSourceVideo").click(function(){				 
				  $("#playVideoDialog").openModal({
					  dismissible: true,
					  complete: function(){
				    		$("#playVideoDialog video")[0].pause();
				    		$('#playVideoDialog').closeModal();				    		
				    	}
					  
				  });
				  var sourceVideo=$(this).attr("value");
				  boxservice.api.boxvideo.presginedurl(boxservice.s3.baseUrl+"/"+sourceVideo).done(function(data){
		  				if(data && data.file){
		  				   $("#playVideoDialog video source").attr("src",data.file);
		  				    $("#playVideoDialog video")[0].load();
		  				  $("#playVideoDialog video")[0].play();
		  				}
		  		  });
				  
			  });
			  
			  
		  });
		  
		    
		  
 };
    

		boxservice.s3.show=function(htmlContent){
			if(!htmlContent){
				 boxservice.util.page.load("s3/list.html").done(function(htmlContent){
					 boxservice.s3.show(htmlContent);
				 });
			 }
				$("#content").html(htmlContent);
				
				var showS3Files=function(search){
					boxservice.api.boxvideo.listFiles(search).done(function(s3files){
				    	boxservice.s3.baseUrl=s3files.baseUrl;	    	
				    	seUpS3Sortable(s3files.files);
				    	boxservice.s3.list(s3files.files);
				    	
				    	boxservice.util.finishWait();
				    }).fail(boxservice.util.onError);
				};
				
				showS3Files();
				boxservice.util.startWait();
			    
				
			    boxservice.util.search().done(function(search){		    		
			    			showS3Files(search);
	        	 });
			    
		
         };
	
	
			   
	
     			  	
});



