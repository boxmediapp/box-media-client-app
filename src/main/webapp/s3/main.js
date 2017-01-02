jQuery(document).ready(function ($) {
	
	boxservice.s3={};
	boxservice.s3.seUpS3Sortable=function(){
	     
	      boxservice.s3.listdata.setupSortable({headerSection:".sort-file",attributename:"file"});
	      boxservice.s3.listdata.setupSortable({headerSection:".sort-title",attributename:"episodeTitle"});
	      boxservice.s3.listdata.setupSortable({headerSection:".sort-last-modified",attributename:"lastModifidDate"});
	      boxservice.s3.listdata.setupSortable({headerSection:".sort-duration-error",attributename:"durationError"});	     
	};
    
	boxservice.s3.show=function(){
	     
	    boxservice.s3.listdata=boxservice.recordlist.createlistdata({containerSelection:"#s3filelist",loadItemsFunction:boxservice.api.boxvideo.listFiles,listItemsFunction:boxservice.s3.listVideoFiles,itemsInLoadItemsFunction:"files"});	    
            boxservice.s3.loadS3List();
	}
	
	boxservice.s3.loadS3List=function(){
        
	    var showS3Files=function(){
	        boxservice.util.startWait();
    	            $("#content").html(boxservice.s3.htmlContent);	        
                    boxservice.api.boxvideo.listFiles(boxservice.s3.listdata).done(function(s3files){
                    boxservice.s3.baseUrl=s3files.baseUrl;     
                    boxservice.s3.listdata.newlist(s3files.files);
                    boxservice.s3.seUpS3Sortable();                
                    boxservice.s3.listVideoFiles(s3files.files);
                 }).fail(boxservice.util.onError);
                boxservice.util.search(boxservice.s3.listdata.search).done(function(search){                             
                    boxservice.s3.listdata.newSearch(search);                
                    boxservice.s3.loadS3List();                    
                });                        
             };
              if(boxservice.s3.htmlContent){
                  showS3Files();
              }
              else{
                         boxservice.util.page.load("s3/list.html").done(function(htmlContent){
                             boxservice.s3.htmlContent=htmlContent;
                             showS3Files();
                         });
                 }
                        
       };

    boxservice.s3.listVideoFiles=function(s3filelist){

    	boxservice.util.finishWait();
    	var config={types:{"lastModifidDate":"datetime"}};	   
    	 
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
			 
			  boxservice.util.scrollPaging(boxservice.s3.listdata);			  
			  
		  });
		  
		    
		  
 };
    

		
	
	
			   
	
     			  	
});



