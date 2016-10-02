jQuery(document).ready(function ($) {	
			boxservice.availability={};
			boxservice.availability.getAvailabilityByIdFromTheList=function(availabilitylist, avid){
				if(availabilitylist==null ||availabilitylist.length==0){
					return null;
				}
				for(var i=0;i<availabilitylist.length;i++){
					if(availabilitylist[i].id==avid){
						return availabilitylist[i];
					}					
				}
				return null;
			};
			boxservice.availability.editingavailability=null;
			boxservice.availability.show=function(episode){
				var deferred = $.Deferred();
				boxservice.util.page.load("availability/editor.html").done(function(htmlContent){			  
						$("#content").html(htmlContent);			   
						boxservice.util.startWait();
						boxservice.api.availability.list(episode).done(function(avlist){
							boxservice.util.finishWait();
							$("#availabilitylist").empty();
							var rconfig={types:{start:"datetime",end:"datetime"}};
							boxservice.util.pageForEachRecord("availability/availability-row.html",avlist,"#availabilitylist",rconfig).done(function(){
								$("#availabilitylist .delete").click(function(){
										var availabilityid=$(this).attr("href");
										boxservice.availability.remove(episode,availabilityid).done(function(){
											boxservice.availability.show(episode).then(deferred.resolve,deferred.reject);
											
										}).fail(function(){
											boxservice.availability.show(episode).then(deferred.resolve,deferred.reject);											
										});
										return false;
								});
							}).fail(boxservice.util.onError);							
						}).fail(function(err){
							boxservice.util.finishWait();
				  	 		boxservice.util.onError(err);
						});
						$("#backButton").click(function(){
							deferred.resolve("done");
						});
						
						$("#addAvailabilityWindow").click(function(){
							boxservice.availability.create(episode).done(function(){
								boxservice.availability.show(episode).then(deferred.resolve,deferred.reject);
								
							}).fail(function(err){
								boxservice.availability.show(episode).then(deferred.resolve,deferred.reject);
							});
							
							
						});						
						 var availability={};						 
						 var tDate = new Date();
						 availability.start=tDate.getTime();						 
						 tDate.setDate(tDate.getDate() + 30);
						 availability.end=tDate.getTime();;
						 boxservice.availability.toInput(availability);
						 	
						
						boxservice.util.resetInput();
						
				});	
				return deferred.promise();
	};
	
	boxservice.availability.fromInput=function(availability){
		 var startdate=$("#availabilityStartdate").val();
		 var starttime=$("#availabilityStartTime").val();
		 var enddate=$("#availabilityEnddate").val();
		 var endtime=$("#availabilityEndTime").val();		 
		 availability.start = Date.parse(startdate+ " "+starttime);
		 availability.end =   Date.parse(enddate+ " "+endtime);
	};
	boxservice.availability.toInput=function(availability){
		if(!availability){
			return;
		}
		boxservice.util.timestampToInputs(availability.start,$("#availabilityStartdate"),$("#availabilityStartTime"));
		boxservice.util.timestampToInputs(availability.end,$("#availabilityEnddate"),$("#availabilityEndTime"));
	};
	boxservice.availability.create=function(episode){
		var deferred = $.Deferred();
		
		 var availability={				 
		 };
		 boxservice.availability.fromInput(availability);

		 boxservice.util.startWait();					  	 	 
  	 	 console.log(JSON.stringify(availability));
  	 	boxservice.api.availability.create(episode,availability).done(function(){
  	 		boxservice.util.finishWait();
  	 		deferred.resolve("done");  	 		
  	 	}).fail(function(err){
  	 		boxservice.util.finishWait();
  	 		boxservice.util.onError(err);
  	 		deferred.reject(err);
  	 		
  	 	});  	 	 
  	 	 return deferred.promise();
	};
	boxservice.availability.remove=function(episode,availabilityid){
		var deferred = $.Deferred();
		boxservice.util.startWait();
		boxservice.api.availability.remove(episode,availabilityid).done(function(){
			boxservice.util.finishWait();			
			deferred.resolve("done");
		}).fail(function(err){
			boxservice.util.finishWait();
  	 		boxservice.util.onError(err);
  	 		deferred.reject(err);

		});
		return deferred.promise(); 
	};
});