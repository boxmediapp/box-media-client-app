$(function(){
	boxservice.schedule={};
var seUpSchedulesSortable=function(schedules){
    	
    	var setUpSortEpisode=function(sortHeader, sortFunction){
    		boxservice.util.menu.configSort(sortHeader,sortFunction,schedules,boxservice.schedule.list);
    	};
    	setUpSortEpisode(".sort-timestamp",function(a,b){
    		if (a.scheduleTimestamp < b.scheduleTimestamp) 
    			 return 1; 
    		else if (a.scheduleTimestamp > b.scheduleTimestamp)
    			return -1;
    		else
    			return 0;
    	});
    	setUpSortEpisode(".sort-episode-title",function(a,b){
    		if (a.scheduleTimestamp < b.scheduleTimestamp) 
    			 return 1; 
    		else if (a.episdeoTitle > b.episdeoTitle)
    			return -1;
    		else 
    			return 0;
    	});
    	setUpSortEpisode(".programme-number",function(a,b){
    		if (a.programmeNumber < b.programmeNumber) 
    			 return 1; 
    		else if (a.programmeNumber > b.programmeNumber)
    			return -1;
    		else
    		  return 0;
    	});
    	
    	
    	
    	boxservice.util.menu.resetSort();
    	
    };
    
	boxservice.schedule.show=function(htmlContent){
		boxservice.util.startWait();
 	   $("#content").html(htmlContent);
 	   boxservice.api.schedules.list().done(function(schedules){
 		  boxservice.util.finishWait();
 		 seUpSchedulesSortable(schedules);
 		   boxservice.schedule.list(schedules);
 		   boxservice.util.closeDialog();
			}).fail(function(err){
				boxservice.util.finishWait();
				boxservice.util.openDialog("error in loading the schedules"+JSON.stringify(err));
				
			});
 	   
    };
	
	boxservice.schedule.list=function(schedules, targetSelection){				      
		  
		  
		  $("#schedulelist").empty();
		  var config={types:{scheduleTimestamp:"datetime"}}
		  boxservice.util.pageForEachRecord("schedules/schedule-row.html",schedules,"#schedulelist",config).done(function(){
			  	
		  });
		  
		 
	   };
	
});
