jQuery(document).ready(function ($) {
	
	boxservice.s3={};
	boxservice.s3.seUpS3Sortable=function(){
	     
	      boxservice.s3.listdata.setupSortable({headerSection:".sort-file",attributename:"file"});
	      boxservice.s3.listdata.setupSortable({headerSection:".sort-title",attributename:"episodeTitle"});
	      boxservice.s3.listdata.setupSortable({headerSection:".sort-last-modified",attributename:"lastModifidDate"});
	      boxservice.s3.listdata.setupSortable({headerSection:".sort-duration-error",attributename:"durationError"});	     
	};
    
	boxservice.s3.show=function(){
	       var createListDataRequest={
	               containerSelection:"#s3filelist",
	               loadItemsFunction:boxservice.api.boxvideo.listFiles,
	               listItemsFunction:boxservice.s3.listVideoFiles,
	               itemsInLoadItemsFunction:"files",
	               onStartList:function(){
	                   boxservice.util.startWait();
	                    $("#content").html(boxservice.s3.htmlContent);
	                    boxservice.s3.seUpS3Sortable();
	                    boxservice.util.search(boxservice.s3.listdata.search).done(function(search){                             
	                       boxservice.s3.listdata.newSearch(search);                
	                        boxservice.s3.loadS3List();                    
	                    });                       
	               }
	       };
	    boxservice.s3.listdata=boxservice.recordlist.createlistdata(createListDataRequest);	    
            boxservice.s3.loadS3List();
	}
	
	boxservice.s3.loadS3List=function(){
	    
              if(boxservice.s3.htmlContent){
                  boxservice.s3.listdata.startList();
              }
              else{
                         boxservice.util.page.load("s3/list.html").done(function(htmlContent){
                             boxservice.s3.htmlContent=htmlContent;
                             boxservice.s3.listdata.startList();
                         });
                 }
                        
       };

    boxservice.s3.listVideoFiles=function(s3filelist){

    	boxservice.util.finishWait();
    	var config={types:{"lastModifidDate":"datetime"}};	   
    	 
		  boxservice.util.pageForEachRecord("s3/row.html",s3filelist,"#s3filelist",config).done(function(){
		          boxservice.s3.listdata.autoScroll();
			  $(".episodelink").click(function(){
			          var deferred=boxservice.s3.listdata.getBackDeferred();
                                  boxservice.initForNewPage();
				  var episodeid=$(this).attr("href");
				  boxservice.episode.edit(episodeid,deferred);
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
				  boxservice.api.boxvideo.presginedurl(boxservice.appinfo.appconfig.s3videoURL+"/"+sourceVideo).done(function(data){
		  				if(data && data.file){
		  				   $("#playVideoDialog video source").attr("src",data.file);
		  				    $("#playVideoDialog video")[0].load();
		  				  $("#playVideoDialog video")[0].play();
		  				}
		  		  });
				  
			  });
			 
			  boxservice.util.scrollPaging(boxservice.s3.listdata);			  
			  
		  });
		  
		    
		  
 };
    

		
	
	
			   
	
     			  	
});



