  jQuery(document).ready(function ($) {

	
	
	boxservice.bc={};
	boxservice.bc.video={};
	
	boxservice.bc.videourl=function(videoid){
		return "https://studio.brightcove.com/products/videocloud/media/videos/"+videoid;
	};

	boxservice.bc.loadViewVideoPage=function(){    	    
    	return boxservice.util.page.load("bc/view.html");
    };
    
	boxservice.bc.show=function(htmlContent){
		boxservice.util.startWait();			    			    
		    boxservice.api.bc.video.list().done(function(videos){
		    	$("#content").html(htmlContent);
		    	boxservice.util.finishWait();
		    	boxservice.bc.video.show(videos);
		    		 	
			}).fail(function(err){
				
				boxservice.util.openDialog("error in loading the episodes"+err);
				
			});

			
    };

			   
	boxservice.bc.video.show=function(videos){
				  var videotable=[			                    
				                   {"title":"ID",                   "tag":"td",   "class":"videoname","element":{"tag":"a","attr":{"name":"href","value":["id"]},"body":{"value":["id"]}}},
				                   {"title":"Name",                   "tag":"td", "body":{"value":["name"]}},
				                   {"title":"reference_id",            "tag":"td", "body":{"value":["reference_id"]}},
				                   {"title":"Thumbnail",               "tag":"td", "element":{"tag":"img", "attr":{"name":"src", "value":["images","thumbnail","src"]}}}				                   
				                  ];
				  
				  boxservice.util.table.show(videos,videotable,"#bcvideolist");
				  
				  $("#bcvideolist .videoname a").click(function(){
					  var videoid=$(this).attr("href");
					  boxservice.bc.video.view(videoid);
					  return false;
				  });
     };
     
     boxservice.bc.video.view=function(videoid){
    	 if(!videoid){
  		   boxservice.util.openDialog("videoid is null:");
  		   return;
  	   }
    	 
    	 
    	 var videopromise=boxservice.api.bc.video.view(videoid);
    	 var pagepromise=boxservice.bc.loadViewVideoPage();
    	 var cueuePagePromise= boxservice.episode.cuepointsRowPage();
    	 
    	 
    	$.when(videopromise,pagepromise,cueuePagePromise).then(function(videoResult,htmlContentResult,cueuePageResult){  
    		var video=videoResult[0];
    		var htmlContent=htmlContentResult[0];
    		var cuPage=cueuePageResult[0];
    		$("#content").html(boxservice.util.replaceVariables(htmlContent,video));
    		if(video.cue_points && video.cue_points.length>0){
    			  var cueContent="";
				  for(var i=0;i<video.cue_points.length;i++){
					  cueContent=cueContent+boxservice.util.replaceVariables(cuPage,video.cue_points[i]);
				  }
				  $("#cuepointlist").append(cueContent);
    			
    		}
    		
    		
    		
    	});
    	       
    	 		
    	 		 
    	 
     };
     
			   
			   
				  	
});



