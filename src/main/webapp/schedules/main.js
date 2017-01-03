$(function(){
	boxservice.schedule={};
	
	boxservice.schedule.seUpSchedulesSortable=function(){
	        boxservice.schedule.listdata.setupSortable({headerSection:".sort-timestamp",attributename:"scheduleTimestamp",sortParametername:"scheduleTimestamp"});
	        boxservice.schedule.listdata.setupSortable({headerSection:".sort-episode-title",attributename:"episdeoTitle",sortParametername:"episdeoTitle"});
	        boxservice.schedule.listdata.setupSortable({headerSection:".programme-number",attributename:"programmeNumber",sortParametername:"programmeNumber"});
	        boxservice.util.menu.resetSort();        
	};
	
	boxservice.schedule.show=function(){
	       boxservice.schedule.listdata=boxservice.recordlist.createlistdata({containerSelection:"#schedulelist",loadItemsFunction:boxservice.api.schedules.list,listItemsFunction:boxservice.schedule.listSchedules});       
	       boxservice.schedule.loadScheduleList();
	};
	boxservice.schedule.loadScheduleList=function(){
	    var showPage=function(){
	        boxservice.util.startWait();
	        $("#content").html(boxservice.schedule.htmlContent);
	        boxservice.api.schedules.list(boxservice.schedule.listdata).done(function(schedules){
	            boxservice.schedule.listdata.newlist(schedules);    
                    boxservice.schedule.seUpSchedulesSortable();
                    boxservice.schedule.listSchedules(schedules);
	                        }).fail(boxservice.util.onError);
	    };
	    if(boxservice.schedule.htmlContent){
                showPage();
             }
             else{
                boxservice.util.page.load("schedules/list.html").done(function(html){
                        boxservice.schedule.htmlContent=html;
                        showPage();                             
                });
             }
    };
	
	boxservice.schedule.listSchedules=function(schedules){				      		  
	         boxservice.util.finishWait();		  
		  var config={types:{scheduleTimestamp:"datetime"}}
		  boxservice.util.pageForEachRecord("schedules/schedule-row.html",schedules,"#schedulelist",config).done(function(){
		             boxservice.util.resetInput();
	                     boxservice.util.scrollPaging(boxservice.schedule.listdata);  	
		  });
		  
		 
	   };
	
});
