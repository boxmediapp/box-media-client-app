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
	                         $("#calendarViewButton").click(function(){
	                             that.calendarView();	                             
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
	                     $('.scorrabletable').stickyTableHeaders();
	                     
	              });
		  		 
	          },
	          calendarView:function(){
	              if(!this.listdata.items || !this.listdata.items.length){
	                  return;
	              }
	              
	              var that=this;
                      if(!this.calendarViewHTMLContent){
                          boxservice.util.page.load("schedules/calendar/list.html").done(function(calendarViewHTMLContent){
                              that.calendarViewHTMLContent=calendarViewHTMLContent;
                              boxservice.util.page.load("schedules/calendar/th.html").done(function(thHTML){
                                  that.thHTML=thHTML;
                                  boxservice.util.page.load("schedules/calendar/tr.html").done(function(trHTML){
                                      that.trHTML=trHTML;
                                      boxservice.util.page.load("schedules/calendar/td.html").done(function(tdHTML){
                                          that.tdHTML=tdHTML;
                                          that.calendarView();
                                      });                                  
                                  });
                              });
                              
                              
                          });
                          return;
                      }
                      $("#content").html(boxservice.schedule.calendarViewHTMLContent);
                      var from=this.listdata.from;
                      var to=this.listdata.to;
                      this.listdata.newSort("scheduleTimestamp","asc");
                      this.listdata.listItemsFunction=this.calendarList.bind(this);
                      $('.scorrabletable').stickyTableHeaders();
                      this.listdata.onStartList=null;
                      this.listdata.startList();
                      this.firstDay=null;
	          },
	          calendarList:function(schedules){
	              boxservice.util.finishWait();
	              for(var i=0;i<schedules.length;i++){
	                   this.addScheduleToCalendar(schedules[i]);
	              }
	          },
	          readProgrammeFromTR:function(trElement,dateString,dateStringID){
	              var programmeNumberID=trElement.attr("id");
                      var programmeNumber=programmeNumberID.substring(1).replace("-","/");
                      return{
                          dateStringID:dateStringID,
                          dateString:dateString,
                          programmeNumber:programmeNumber,
                          programmeNumberID:programmeNumberID
                      }; 
                        
	          },
	          readScheduleFromTH:function(thElement, programmeNumber,programmeNumberID){	                                                                   
                      var dateStringID=thElement.attr("id");
                      var dateString=dateStringID.substring(1);
                      return{
                          dateStringID:dateStringID,
                          dateString:dateString,
                          programmeNumber:programmeNumber,
                          programmeNumberID:programmeNumberID
                      };
	           }, 
	           popularScheduleIds:function(schedule){
	               schedule.scheduleDate=new Date(schedule.scheduleDay);
	               schedule.dateStringID="D"+boxservice.util.getDateString(schedule.scheduleDate);
	               schedule.dateString=schedule.scheduleDate.getDate()+"/"+(schedule.scheduleDate.getMonth()+1)                    
	               schedule.programmeNumberID="P"+schedule.programmeNumber.replace("/","-");
	                      
	           },
	          addCalendarRow:function(schedule){
	              var that=this;
	              var trContent=boxservice.util.replaceVariables(this.trHTML,schedule);
                      $("#schedulelist").append(trContent);
                      $("th.calendarColumn").each(function(index){                          
                          var pSchedule=that.readScheduleFromTH($(this),schedule.programmeNumber,schedule.programmeNumberID);                          
                          var tdContent=boxservice.util.replaceVariables(that.tdHTML,pSchedule);
                          $("tr#"+schedule.programmeNumberID).append(tdContent);
                      });  
	          },
	          addCalendarHeader:function(schedule){
	              var that=this;
	              var thContent=boxservice.util.replaceVariables(that.thHTML,schedule);
                      $("#calendar-view-header").append(thContent);                      
                      $("tr.episodeRow").each(function(index){
                         var pSchedule=that.readProgrammeFromTR($(this),schedule.dateString,schedule.dateStringID);                              
                         var tdContent=boxservice.util.replaceVariables(that.tdHTML,pSchedule);
                         $(this).append(tdContent);
                      });
	          },
	          addScheduleToCalendar:function(schedule){
	              if(!schedule.programmeNumber){
	                  console.error("The schedule event does not have programmeNumber:"+JSON.stringify(schedule));
	                  return;
	              }
	              this.popularScheduleIds(schedule);
	              if(!$("th#"+schedule.dateStringID).length){
	                   this.addCalendarHeader(schedule);   	                      
	              }
	              if(!$("tr#"+schedule.programmeNumberID).length){
	                  this.addCalendarRow(schedule);	                  
	              }	
	              $("td#"+schedule.programmeNumberID+"_"+schedule.dateStringID+" div").addClass("scheduled");
	          }
	};
	
});
