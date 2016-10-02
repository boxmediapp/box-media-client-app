jQuery(document).ready(function ($) {
	boxservice.import={};	
	boxservice.task={};
	
	
	boxservice.import.reload=function(){
		
		boxservice.import.show(boxservice.import.htmlContent);		
	};
	
	boxservice.import.show=function(htmlContent){	  	
	   boxservice.import.htmlContent=htmlContent;		
 	   $("#content").html(htmlContent);	    	   
 	   $("#importSchedule").on("click",boxservice.import.initiate);
 	   $("#createTimedTask").on("click", boxservice.task.create);

  	  var fromD = new Date();
  	  fromD.setDate(fromD.getDate() +2);  	  
  	  $("#fromDate").val(fromD.toISOString().substring(0,10));
  	  
  	var toD = new Date();
	  toD.setDate(fromD.getDate() +5);  	  
	  $("#toDate").val(fromD.toISOString().substring(0,10));
  	 
	  boxservice.util.resetInput();
 	   
 	   
 	   boxservice.api.task.list().done(boxservice.task.show);
 	   
    };
	
    boxservice.import.initiate=function(){	    		   
    		   var schedulerequest={
    				   "fromDate": $("#fromDate").val(),
    				   "toDate": $("#toDate").val(),
    				   "channelId": "1865244993",
    				   "type": "Press",
    				   "info": "Episode"};
    		   
    		   var c4importpromise =boxservice.api.c4.import(schedulerequest);		    		   
    		   c4importpromise.done(function(response){
    			   boxservice.util.openDialog("Import Schedule has been started");	    			   
    		   }).fail(function(error){
    			   boxservice.util.openDialog("Failed to import the schedules:"+JSON.stringify(error));
    		   });	    		   
      };
    	   
      
      boxservice.task.create=function(){
    		   
    		   var taskRequest={
    			   "taskType":"REPEATED",
    			   "runOnTime":$("#runOnTime").val(),
    			   "importScheduleTask":{
    				            "fromDayOffset":$("#fromDayOffset").val(),
    				            "toDayOffset":$("#toDayOffset").val(),
    				            "channelId":"1865244993",
    		    				"type":"Press",
    		    				"info":"Episode"
    				            
    			      }
    		   };
    		   console.log("adding task....");
    		   var taskpromise=boxservice.api.task.create(taskRequest);
    		   taskpromise.done(function(response){	    			   
    			    console.log("completed the task addeding");
    			    boxservice.import.reload();
    		   }).fail(function(error){
    			   boxservice.util.openDialog("Failed to schedule the task:"+JSON.stringify(error));
    			   boxservice.import.reload();
    		   });
    		   
    		   
    	};
    	
    	
    	boxservice.task.show=function(tasks){		
    		   
    		   var tasktable=[			                    
			                   {"title":"Time",                   "tag":"td", "body":{"value":["runOnTime"]}},
			                   {"title":"From (days)",                     "tag":"td", "body":{"value":["importScheduleTask", "fromDayOffset"]}},
			                   {"title":"To (days)",                     "tag":"td", "body":{"value":["importScheduleTask", "toDayOffset"]}},
			                   {"title":" ",                          "tag":"td", "element":{"tag":"a","attr":{"name":"value","value":["id"]}, "body":{"value":"remove"}}},
			                   
			    ];
    		   
			   $("#taskList").html("");
			   //boxservice.util.table.show(tasks,tasktable,"#taskList");
			   boxservice.util.pageForEachRecord("import/task-record.html",tasks,"#taskList").done(function(){
					  
				   $("#taskList a").click(function(){
					   var taskid=$(this).attr("href");
					   var deletepromise=boxservice.api.task.remove(taskid);
					   deletepromise.done(function(){
						   boxservice.import.reload();
					   }).fail(function(err){
						   console.log(err);
						   boxservice.import.reload();					   
					   });
					 return false;  
				   });
			   });
			   
			   
			   	  
			   
		   };
	
	       	       	       
});



