$(function(){
	boxservice.schedule={};
	
	boxservice.schedule={
        	 seUpSchedulesSortable:function(){
        	
        	        this.listdata.setupSortable({headerSection:".sort-timestamp",attributename:"scheduleTimestamp",sortParametername:"scheduleTimestamp"});
        	        this.listdata.setupSortable({headerSection:".sort-episode-title",attributename:"episdeoTitle",sortParametername:"episdeoTitle"});
        	        this.listdata.setupSortable({headerSection:".programme-number",attributename:"programmeNumber",sortParametername:"programmeNumber"});
        	        boxservice.util.menu.resetSort();        
        	 },
	         show:function(){
	                 var that=this;
	                 var listdataRequest={
	                     containerSelection:"#schedulelist",
	                     loadItemsFunction:boxservice.api.schedules.list,
	                     listItemsFunction:this.listSchedules.bind(this),
	                     onStartList:function(){
	                         boxservice.util.startWait();
	                         $("#content").html(boxservice.schedule.htmlContent);
	                         that.seUpSchedulesSortable();
	                         $("#searchButton").click(function(){
	                              var fromDate=$("#fromInput").val();
	                              var toDate=$("#toInput").val();
	                              var from=new Date(fromDate+" 00:00:00");
	                              var to=new Date(toDate+" 23:59:59");
	                              that.listdata.rangeSearch(from.getTime(),to.getTime());
	                              that.loadScheduleList();
	                         });
	                         
	                        
	                     }	                    
	                  };	    
        	       this.listdata=boxservice.recordlist.createlistdata(listdataRequest);       
        	       this.loadScheduleList();
	         },
	         loadScheduleList:function(){
	             var that=this;
	                 if(this.htmlContent){
	                         this.listdata.startList();
	                 }
	                 else{
	                     boxservice.util.page.load("schedules/list.html").done(function(html){
	                         that.htmlContent=html;
	                         that.listdata.startList();                                
	                     });
	                 }
	          },
	          listSchedules:function(schedules){
	              if(this.listdata.from){
	                  var datevalue=new Date(this.listdata.from);
	                  var datestringvalue=boxservice.util.getDateString(datevalue);
                          $("#fromInput").val(datestringvalue);                              
                      }
                      if(this.listdata.to){
                          var datevalue=new Date(this.listdata.to);
                          var datestringvalue=boxservice.util.getDateString(datevalue);
                          $("#toInput").val(datestringvalue);
                          
                                                        
                      }
	              boxservice.util.finishWait();	
	              var that=this;
	              var config={types:{scheduleTimestamp:"datetime"}}
	              boxservice.util.pageForEachRecord("schedules/schedule-row.html",schedules,"#schedulelist",config).done(function(){
		             boxservice.util.resetInput();
	                     boxservice.util.scrollPaging(boxservice.schedule.listdata);
	                     $("a.episodlink").click(function(){
                                 var deferred=that.listdata.getBackDeferred();
                                 boxservice.initForNewPage();
                                 var episodeid=$(this).attr("href");
                                 boxservice.episode.edit(episodeid,deferred);
                                 return false;
                              });
	                     
	                     
	              });
		  		 
	          }
	};
	
});
