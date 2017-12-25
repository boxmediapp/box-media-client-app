jQuery(document).ready(function ($) {
	boxservice.api={};
	boxservice.api.cue={};
	boxservice.api.episode={};
	boxservice.api.series={};
	boxservice.api.seriesgroup={};
	boxservice.api.c4={};
	boxservice.api.bc={};
	boxservice.api.bc.video={};
	boxservice.api.users={};


	boxservice.api.boxvideo={};


	boxservice.api.schedules={
	        list:function(listdata){
	              var path=apipath+"/schedules";
	              if(listdata){
	                  path=listdata.createListWithRange(path);
	              }
	              return boxservice.api.ajax("GET",path);
	         }

	};


	boxservice.api.masterimage={
	        uploadfileurl:function(){
	            return  apipath+"/box-images/master";
	        },
	        listFiles:function(prefix){
	            var path=apipath+"/box-images/master";
	                  if(prefix){
	                          path=path+"?prefix="+prefix;
	                  }
	                  return boxservice.api.ajax("GET",path);

	         },
	         deleteSeriesGroupImage:function(seriesgroupid,imagefile){
                     var path=apipath+"/box-images/master/seriesgroup/"+seriesgroupid+"/"+imagefile;
                     return boxservice.api.ajax("DELETE",path);
                  },
	         deleteSeriesImage:function(seriesid,imagefile){
	             var path=apipath+"/box-images/master/series/"+seriesid+"/"+imagefile;
	             return boxservice.api.ajax("DELETE",path);
	          },
	        deleteEpisodeImage:function(episodeid,imagefile){
	            var path=apipath+"/box-images/master/episode/"+episodeid+"/"+imagefile;
	            return boxservice.api.ajax("DELETE",path);
	        }

	};



	boxservice.api.task={};
	boxservice.api.episode={};
	boxservice.api.availability={};
	boxservice.api.report={};



	var apipath="/mule/boxtv";


	boxservice.api.tags={
	           list:function(listdata){
	               var path=apipath+"/tags";
	               if(listdata){
	                   path=listdata.createListURL(path);
	               }
	               return boxservice.api.ajax("GET",path);
	           },
	           remove:function(tag){
	               return boxservice.api.ajax("DELETE",apipath+"/tags/"+tag);
	           },
	           add:function(tag){
	               return boxservice.api.ajax("POST",apipath+"/tags",tag);
	           }

	   };
	boxservice.api.clientdevices={
                list:function(listdata){
                    var path=apipath+"/devices";
                    if(listdata){
                        path=listdata.createListURL(path);
                    }
                    return boxservice.api.ajax("GET",path);
                },
                remove:function(device){
                    return boxservice.api.ajax("DELETE",apipath+"/devices/"+device);
                },
                add:function(device){
                    return boxservice.api.ajax("POST",apipath+"/devices",device);
                }

        };


	boxservice.api.advertrules={
                list:function(){
                    var path=apipath+"/advertisement/settings/rule";
                    return boxservice.api.ajax("GET",path);
                },
                remove:function(rule){
                    return boxservice.api.ajax("DELETE",apipath+"/advertisement/settings/rule/"+rule.id);
                },
                add:function(rule){
                    return boxservice.api.ajax("POST",apipath+"/advertisement/settings/rule",rule);
                },
                update:function(rule){
                    return boxservice.api.ajax("PUT",apipath+"/advertisement/settings/rule/"+rule.id,rule);
                }
        };


	boxservice.api.addQueryParam=function(url, paramName,paramValue){
	    if(!paramValue || !paramName){
	        return url;
	    }
	    var notTheFirst=url.indexOf("?")>0;
	    if(notTheFirst){
	        return url+"&"+paramName+"="+paramValue;
	    }
	    else{
	        return url+"?"+paramName+"="+paramValue;
	    }
	};

	//apipath="http://localhost:9081"+apipath;
	boxservice.api.bc.getNotificationURL=function(episode){
		return apipath+"/bc/notification/"+episode.episodeStatus.transcodeJobId;
	};

	boxservice.api.episode.getDetailsUrl=function(episodid){
		return apipath+"/episodes/"+episodid;
	};


	boxservice.api.episode.soundMouseHeaderFileUrl=function(episodid){
		return apipath+"/soundmouse/"+episodid+"/header";
	};
	boxservice.api.episode.soundMouseSmurfFileUrl=function(episodid){
		return apipath+"/soundmouse/"+episodid+"/smurf";
	};
	boxservice.api.episode.bcAnalysticsUrl=function(videoid){
		return apipath+"/bc/analytics/data?videoid="+videoid;
	};

	boxservice.api.episode.soundMouseCommand=function(mediaCommand){
		  return boxservice.api.ajax("POST", apipath+"/soundmouse",mediaCommand);
	};


	boxservice.api.boxvideo.uploadfileurl=function(){
		   return apipath+"/box-video";
	};



	boxservice.api.ajax=function(methodname,path,data){
		 var userInfo=boxservice.globalInput.getUserInfo();
		 if(!userInfo){

					var deferred = $.Deferred();
					deferred.fail("The application is logged out");
					boxservice.util.finishWait();
					setTimeout(function(){boxservice.displayLoginWindow();},100);
					return deferred.promise();
		 }
		if(data){
			return $.ajax({
        		type: methodname,
        		url: path,
        		dataType: "json",
        		contentType:"application/json",
        		data: JSON.stringify(data),
        		beforeSend: function (xhr) {
	        	    if(userInfo.clientId && userInfo.clientSecret){
	        	    	xhr.setRequestHeader ("Authorization", "Basic " + btoa(userInfo.clientId+":"+userInfo.clientSecret));
	        	    }
	        	}
        		});
		}
		else{
			return $.ajax({
			    type: methodname,
			    url: path,
			    dataType: "json",
			    beforeSend: function (xhr) {
	        	    if(userInfo.clientId && userInfo.clientSecret){
	        	    	xhr.setRequestHeader ("Authorization", "Basic " + btoa(userInfo.clientId+":"+userInfo.clientSecret));
	        	    }
	        	}
			   });
		}
	};
	boxservice.api.cue.create=function(episode,cue){
	     return boxservice.api.ajax("POST",apipath+"/cue/"+episode.id,cue);
   };
   boxservice.api.cue.list=function(episode){
	     return boxservice.api.ajax("GET",apipath+"/cue/"+episode.id);
   };
   boxservice.api.cue.remove=function(episode,cueid){
	     return boxservice.api.ajax("DELETE",apipath+"/cue/"+episode.id+"/"+cueid);
   };

   boxservice.api.cue.update=function(episode,cue){
	   return boxservice.api.ajax("PUT",apipath+"/cue/"+episode.id+"/"+cue.id,cue);
   };



  boxservice.api.availability.create=function(episode,availability){
	     return boxservice.api.ajax("POST",apipath+"/availability/"+episode.id,availability);
  };
  boxservice.api.availability.list=function(episode){
	     return boxservice.api.ajax("GET",apipath+"/availability/"+episode.id);
  };
  boxservice.api.availability.remove=function(episode,availabilityid){
	     return boxservice.api.ajax("DELETE",apipath+"/availability/"+episode.id+"/"+availabilityid);
  };

  boxservice.api.availability.update=function(episode,availability){
	   return boxservice.api.ajax("PUT",apipath+"/availability/"+episode.id+"/"+availability.id,availability);
  };



  boxservice.api.episode.changePublishedStatus=function(episodeid, publishedStatus){
	    	 var episode={
	    			 id:episodeid,
	    			 episodeStatus:{
	    				 publishedStatus:publishedStatus
	    			  }
	    	 };
	    	 return boxservice.api.episode.create(episode);
   };
   boxservice.api.episode.addEditorNotes=function(episodeid, editorNotes){
	 if(!editorNotes){
		 editorNotes="null";
	 }
  	 var episode={
  			 id:episodeid,
  			 editorNotes:editorNotes
  	 };
  	 return boxservice.api.episode.create(episode);
   };


        boxservice.api.episode.list=function(listdata){
		 var path=apipath+"/episodes";
		 if(listdata){
		     path=listdata.createListURL(path);
                 }
		 return boxservice.api.ajax("GET",path);
	};

	boxservice.api.series.list=function(listdata){
	    var path=apipath+"/series";
            if(listdata){
                path=listdata.createListURL(path);
            }
            return boxservice.api.ajax("GET",path);
	};
	boxservice.api.series.getByContractNumber=function(contractNumber){
		 var path=apipath+"/series?contractNumber="+contractNumber;
		 return boxservice.api.ajax("GET",path);
	};


	boxservice.api.series.remove=function(series){
		return boxservice.api.ajax("DELETE",apipath+"/series/"+series.id);
	};
	boxservice.api.series.create=function(series){
	     return boxservice.api.ajax("POST",apipath+"/series",series);
    };


    boxservice.api.seriesgroup.list=function(listdata){
	    var path=apipath+"/seriesgroup";
            if(listdata){
                path=listdata.createListURL(path);
            }
            return boxservice.api.ajax("GET",path);
    };
    boxservice.api.seriesgroup.update=function(seriesgroupid,seriesgroup){
		   return boxservice.api.ajax("PUT",apipath+"/seriesgroup/"+seriesgroupid,seriesgroup);
    };

    boxservice.api.seriesgroup.create=function(seriesgroup){
		   return boxservice.api.ajax("POST",apipath+"/seriesgroup",seriesgroup);
    };

    boxservice.api.seriesgroup.remove=function(seriesgroup){
		   return boxservice.api.ajax("DELETE",apipath+"/seriesgroup/"+seriesgroup.id);
    };

    boxservice.api.seriesgroup.view=function(seriesgroupid){
		   return boxservice.api.ajax("GET",apipath+"/seriesgroup/"+seriesgroupid);
     };
    boxservice.api.seriesgroup.getByTitle=function(seriesGroupTitle){
		   return boxservice.api.ajax("GET",apipath+"/seriesgroup?title="+seriesGroupTitle);
   };





	boxservice.api.episode.view=function(episodeid){
		return boxservice.api.ajax("GET",apipath+"/episodes/"+episodeid);
	};
    boxservice.api.series.view=function(seriesid){
	       return boxservice.api.ajax("GET",apipath+"/series/"+seriesid);
   };
   boxservice.api.series.update=function(seriesid, series,updatetype){
	   if(updatetype){
		   return boxservice.api.ajax("PUT",apipath+"/series/"+seriesid+"?update="+updatetype,series);
	   }
	   else{
		   return boxservice.api.ajax("PUT",apipath+"/series/"+seriesid,series);
	   }

   };
   boxservice.api.episode.update=function(episodeid, episode, updatetype){
	   if(updatetype){
		   	return boxservice.api.ajax("PUT",apipath+"/episodes/"+episodeid+"?update="+updatetype,episode);
	   }
	   else{
	       	return boxservice.api.ajax("PUT",apipath+"/episodes/"+episodeid,episode);
	   }
   };


  boxservice.api.episode.create=function(episode){
      return boxservice.api.ajax("POST",apipath+"/episodes",episode);
  };

  boxservice.api.episode.remove=function(episode){
	  return boxservice.api.ajax("DELETE",apipath+"/episodes/"+episode.id);
  };

  boxservice.api.c4.import=function(scheduleRequest){
	  return boxservice.api.ajax("POST",apipath+"/import/schedules",scheduleRequest);
  };

   boxservice.api.task.create=function(task){
	   return boxservice.api.ajax("POST",apipath+"/tasks",task);
  };


  boxservice.api.task.list=function(){
	   return boxservice.api.ajax("GET",apipath+"/tasks?channel=1865244993");
  };

  boxservice.api.task.remove=function(id){
	   return boxservice.api.ajax("DELETE",apipath+"/tasks/"+id);
  };


  boxservice.api.task.appinfo=function(){
	   return boxservice.api.ajax("GET", apipath+"/app/info");
  };
  boxservice.api.task.updateappinfo=function(appinfo){
	   return boxservice.api.ajax("PUT",apipath+"/app/info",appinfo);
 };

  boxservice.api.command=function(command){
	   return boxservice.api.ajax("POST",apipath+"/commands",command);
 };


 boxservice.api.bc.video.list=function(){
	  return boxservice.api.ajax("GET",apipath+"/bc/video?limit=30");
  };


  boxservice.api.bc.video.view=function(videoid){
	  return boxservice.api.ajax("GET",apipath+"/bc/video/"+videoid);
  };

  boxservice.api.bc.publish=function(episode){
	  return boxservice.api.ajax("POST",apipath+"/bc/publish/"+episode.id,episode);
  };
  boxservice.api.bc.unpublish=function(episode){
	  return boxservice.api.ajax("DELETE",apipath+"/bc/publish/"+episode.id,episode);
  };
  boxservice.api.bc.ingest=function(ingestRequest){
	  return boxservice.api.ajax("POST",apipath+"/bc/ingest",ingestRequest);
  };

  boxservice.api.bc.importcsv=function(csvContent){
		  var userInfo=boxservice.globalInput.getUserInfo();
	  return $.ajax({
  		type: "POST",
  		url: apipath+"/bc/import/csv",
  		contentType:"txt/plain",
  		data:csvContent,
  		beforeSend: function (xhr) {
      	    if(userInfo.clientId && userInfo.clientSecret){
      	    	xhr.setRequestHeader ("Authorization", "Basic " + btoa(userInfo.clientId+":"+userInfo.clientSecret));
      	    }
      	}
  		});

  };


  boxservice.api.boxvideo.listFiles=function(listdata){
		    var path=apipath+"/dbbox-video";
	            if(listdata){
	                path=listdata.createListURLWithPrefix(path);
	            }
	            return boxservice.api.ajax("GET",path);



  };
  boxservice.api.boxvideo.searchFiles=function(prefix){
      var url=apipath+"/dbbox-video";
      url=boxservice.api.addQueryParam(url,"prefix",prefix);
      return boxservice.api.ajax("GET",url);



};

  boxservice.api.boxvideo.deleteEpisodeVideoFile=function(episodeid,videofile){
      var path=apipath+"/box-video/episode/"+episodeid+"/"+videofile;
      return boxservice.api.ajax("DELETE",path);
 };





  boxservice.api.boxvideo.presginedurl=function(url){
           return boxservice.api.ajax("GET",apipath+"/presigned?url="+url);
  };

  boxservice.api.upload=function(uploadRequest){
       return boxservice.api.ajax("POST",apipath+"/presigned", uploadRequest);
  };




   boxservice.api.users.list=function(){
	   return boxservice.api.ajax("GET", apipath+"/users");
	};

	boxservice.api.users.create=function(user){
			  return boxservice.api.ajax("POST", apipath+"/users",user);
	};
	boxservice.api.users.deleteUser=function(username){
			  return boxservice.api.ajax("DELETE", apipath+"/users/"+username);
	};
	boxservice.api.users.updateUser=function(user){
		  return boxservice.api.ajax("PUT", apipath+"/users/"+user.username,user);
	};

	boxservice.api.users.signoutUser=function(){
			var userInfo=boxservice.globalInput.getUserInfo();
			if(boxservice.globalInput.isUserInfoValid(userInfo)){
					return boxservice.api.ajax("POST", apipath+"/user-logout",userInfo);
			}
	 };
		boxservice.api.users.login=function(username,password){

			return $.ajax({
	        	type: "POST",
	        	url: apipath+"/login",
						async:false,
						contentType:"application/json",
        		data: JSON.stringify({username:username}),
	        	beforeSend: function (xhr) {
	        	    xhr.setRequestHeader ("Authorization", "Basic " + btoa(username+":"+password));
	        	}
	            });
		};
		boxservice.api.users.refreshLogin=function(userInfo){
			return boxservice.api.ajax("POST", apipath+"/refresh-login",userInfo);
    };
		boxservice.api.report.get=function(){
                    return $.ajax({
                        type: "GET",
                        url: apipath+"/reports"
                    });
                };

                boxservice.api.bc.playlist={
                        list:function(listdata){
                            var path=apipath+"/bc/playlist";
                            if(listdata){
                                path=listdata.createListURL(path);
                            }
                            return boxservice.api.ajax("GET",path);
                         },
                         get:function(playlistid){
                             var path=apipath+"/bc/playlist/"+playlistid;
                             return boxservice.api.ajax("GET",path);
                         },
                         patch:function(playlistid, playlistdata){
                             var path=apipath+"/bc/playlist/"+playlistid;
                             return boxservice.api.ajax("PATCH",path,playlistdata);
                         },
                         remove:function(playlistid){
                             var path=apipath+"/bc/playlist/"+playlistid;
                             return boxservice.api.ajax("DELETE",path);
                         },
                         create:function(playlist){
                             var path=apipath+"/bc/playlists";
                             return boxservice.api.ajax("POST",path,playlist);
                         }
                }
});
