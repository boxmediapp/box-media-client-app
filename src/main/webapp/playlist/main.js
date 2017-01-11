jQuery(document).ready(function ($) {
 
        boxservice.bc.playlist={
                show:function(){
                    this.listdata=this.createListData();
                    this.startlist();
                },
                initSortable:function(){
                    this.listdata.setupSortable({headerSection:".sort-name",attributename:"playListData.name",sortParametername:"name"});
                    this.listdata.setupSortable({headerSection:".sort-type",attributename:"playListData.type",sortParametername:"type"});
                    this.listdata.setupSortable({headerSection:".sort-favourite",attributename:"playListData.favourite",sortParametername:"favourite"});
                    this.listdata.setupSortable({headerSection:".sort-updated_at",attributename:"playListData.updated_at",sortParametername:"updated_at"});
                    this.listdata.setupSortable({headerSection:".sort-videocount",attributename:"videoCount"});
                    boxservice.util.menu.resetSort();
                },
                list:function(playlists){
                    boxservice.util.finishWait();
                    var that=this;
                    boxservice.util.pageForEachRecord("playlist/playlist-row.html",playlists,"#playlistContainer").done(function(){
                        that.listdata.autoScroll();
                        boxservice.util.scrollPaging(that.listdata);
                        $("a.playlistlink").click(function(){
                            var deferred=that.listdata.getBackDeferred();
                            boxservice.initForNewPage();
                            var playlistid=$(this).attr("href");
                            var playlist=that.listdata.findItemById(playlistid);                            
                            boxservice.bc.playlist.edit.show({playlist:playlist,backDeferred:deferred});                            
                            return false;
                         });
                        
                        $(".selectableCheckbox").click(function(){
                            that.checkButtons();
                        });
                        that.checkButtons();
                    });
                },
                startlist:function(){
                    var that=this;
                    if(that.htmlContent){
                        that.listdata.startList();
                    }
                    else{
                            boxservice.util.page.load("playlist/list.html").done(function(html){
                                    that.htmlContent=html;
                                    that.listdata.startList();
                                    
                                    
                            });
                    }
                },
                deletePlaylist:function(){
                    var that=this;
                    var playlistid=$(".selectableCheckbox:checked").val();
                    if(!playlistid){
                        console.log("select value is null");
                        return;                     
                    }
                    if(playlistid.length<4){
                        console.log("playlistid is too short fot delete");
                    }
                    console.log("going to delete:"+playlistid);
                    boxservice.util.startWait();
                    boxservice.api.bc.playlist.remove(playlistid).done(function(){
                        that.show();
                    }).fail(boxservice.util.onError);
                    
                },
                onStartList:function(){
                    var that=this;
                    boxservice.util.startWait();
                    $("#content").html(that.htmlContent);
                    that.initSortable();
                    boxservice.util.search(that.listdata.search).done(function(search){
                            that.listdata.newSearch(search);                          
                            that.startlist();
                     });  
                    $("#newPlaylist").click(function(){
                        var deferred=that.listdata.getBackDeferred();
                        boxservice.initForNewPage();                                                    
                        boxservice.bc.playlist.newPlaylist.show({backDeferred:deferred});                            
                        return false;
                    });
                    $("#deletePlayLists").click(function(){
                        $("#deletePlaylistDialog").openModal();
                    });
                    $("#deletePlaylistDialog .confirm").click(function(){
                        that.deletePlaylist();                        
                    });
                },
                createListData:function(opts){
                    var that=this;
                    var listfunction=function(itms){
                        that.list(itms);
                    };
                    var createListDataRequest={
                            containerSelection:"#playlistContainer",
                            loadItemsFunction:boxservice.api.bc.playlist.list,
                            listItemsFunction:listfunction,
                            onStartList:that.onStartList.bind(that)
                      };
                      if(opts && opts.backCallback){
                          var deferred=$.Deferred();           
                          deferred.promise().done(function(){
                               opts.backCallback(); 
                          }); 
                        createListDataRequest.backDeferred=deferred;
                      }
                      return boxservice.recordlist.createlistdata(createListDataRequest);
                 },
                 checkButtons:function(){
                     
                     
                     if(!$(".selectableCheckbox:checked").length){
                         $("#deletePlayLists").hide();                         
                     }
                     else if($(".selectableCheckbox:checked").length==1){
                         $("#deletePlayLists").show();
                     }
                     else{                         
                         $("#deletePlayLists").hide();
                     }
                     
                 },
                
                
        };

     boxservice.bc.playlist.edit={
             show:function(opts){
                 this.listdata=this.createListData(opts);
                 this.playlist=opts.playlist;                   
                 this.startlist();
             },  
             hasChanged:function(){
                 var title=$("#playlistname").val();
                                  
                 if(title!=this.playlist.playListData.name){
                     return true;                    
                 }
                 if(this.playlist.playListData.type=="EXPLICIT"){
                     if(this.listdata.isItemsHasChanged(this.playlist.playListData.video_ids)){
                         return true;
                     }
                     else
                         return false;
                 }
                 else{
                     return false;
                 }
             },
             checkButtons:function(){
               
                 if(this.hasChanged()){
                     $("#savePlaylist").show();
                     $("#cancelPlaylist").show();
                 }
                 else{
                     $("#savePlaylist").hide();
                     $("#cancelPlaylist").hide();
                 }
                 if(!$(".selectableCheckbox:checked").length){
                     $("#moveUpFromList").hide();
                     $("#moveDownFromList").hide();
                     $("#removeFromList").hide();
                 }
                 else{
                       $("#removeFromList").show();
                       if($(".selectableCheckbox").length==1){
                           $("#moveUpFromList").hide();
                           $("#moveDownFromList").hide();
                       }
                       else if($(".selectableCheckbox:checked").length==1){
                           $("#moveUpFromList").show();
                           $("#moveDownFromList").show();
                       }
                       else{
                           $("#moveUpFromList").hide();
                           $("#moveDownFromList").hide();
                       }
                 }
                 
             },
             
             moveUpFromList:function(){
                 var videoid=$(".selectableCheckbox:checked").val();
                 if(!videoid){
                     console.log("select value is null");
                     return;                     
                 }
                 if(this.listdata.moveUpById(videoid)){                     
                     console.log("moved up");
                 }
             },
             moveDownFromList:function(){
                 var videoid=$(".selectableCheckbox:checked").val();
                 if(!videoid){
                     console.log("select value is null");
                     return;                     
                 }
                 if(this.listdata.moveDownById(videoid)){                     
                     console.log("moved down");
                 }
             },
             saveChanges:function(){
                 var that=this;
                 var hasChanged=false;
                 var title=$("#playlistname").val();
                 
                 if(title!=this.playlist.playListData.name){
                     this.playlist.playListData.name=title;
                     hasChanged=true;
                 }
                 
                 if(this.listdata.isItemsHasChanged(this.playlist.playListData.video_ids)){
                     this.playlist.playListData.video_ids=this.listdata.getAllIds();
                     hasChanged=true;                    
                  }
                 if(hasChanged){
                     boxservice.util.startWait();
                     boxservice.api.bc.playlist.patch(this.playlist.id,this.playlist).done(function(){
                         var deferred=that.listdata.getBackDeferred();
                         that.show({playlist:that.playlist,backDeferred:deferred});
                     }).fail(boxservice.util.onError);
                 }
                 
             },
             removeFromList:function(){
                 var selectedids=$(".selectableCheckbox:checked").map(function(){
                     return $(this).val();                     
                 }).get();                 
                 if(selectedids && selectedids.length){                     
                     this.listdata.deleteByIds(selectedids);                     
                 }
                 
                 
             },
             list:function(items){                 
                 boxservice.util.finishWait();
                 var that=this;
                 boxservice.util.pageForEachRecord("playlist/video-row.html",items,"#playlistContainer").done(function(){
                     that.listdata.autoScroll();
                     if(that.playlist.playListData.type=="EXPLICIT"){                         
                         $(".selectableCheckbox").click(function(){
                             that.checkButtons();
                         });
                     }
                     else{
                         $(".selectableCheckbox").hide();
                         $("#addEpisodeToList").hide();
                     }
                     that.checkButtons();
                 });
             },
             startlist:function(){
                 var that=this;
                 if(that.htmlContent){
                     that.listdata.startList();
                 }
                 else{
                         boxservice.util.page.load("playlist/playlist-edit.html").done(function(html){
                                 that.htmlContent=html;
                                 that.listdata.startList();                                
                         });
                 }
             },
            
             onStartList:function(){
                 var that=this;
                 boxservice.util.startWait();
                 $("#content").html(this.htmlContent);
                 $("#playlistname").val(this.playlist.playListData.name);
                 $(".playListType").html(this.playlist.playListData.type);                   
                 boxservice.util.resetInput();
                 $("#backButton").click(function(){
                     that.listdata.getBackDeferred().resolve("back");
                 });
                 
                 $("#playlistname").off("input").on('input', this.checkButtons.bind(this));
                 $("#playlistname").off("change").on('change', this.checkButtons.bind(this));
                 
                 
                 $("#savePlaylist").hide();
                 $("#cancelPlaylist").hide();
                 $("#moveUpFromList").hide();
                 $("#moveDownFromList").hide();
                 $("#removeFromList").hide();
                 
                 
                 
                 $("#cancelPlaylist").click(function(){
                     that.startlist();                     
                 });
                 $("#moveUpFromList").click(function(){
                     that.moveUpFromList();
                 });
                 $("#moveDownFromList").click(function(){
                     that.moveDownFromList();
                 });
                 $("#savePlaylist").click(function(){
                     that.saveChanges();                     
                 });
                 
                 $("#removeFromList").click(function(){
                     that.removeFromList();
                 });
                 
                 $("#addEpisodeToList").click(function(){                     
                     boxservice.bc.playlist.episode.show({playlist:that.playlist,backCallback:function(){
                         that.show({playlist:that.playlist,backDeferred:that.listdata.getBackDeferred});
                     }});                     
                 });
                 
                 
             },
             createListData:function(opts){
                 var that=this;                 
                 
                 
                 var createUrl=function(url){
                     return url+"/"+that.playlist.id+"/videos";
                 }
                 var createListDataRequest={
                         containerSelection:"#playlistContainer",
                         loadItemsFunction:boxservice.api.bc.playlist.list,
                         listItemsFunction:that.list.bind(that),
                         urlFunction:createUrl,
                         onStartList:that.onStartList.bind(that),
                         backDeferred:opts.backDeferred
                   };
                   if(opts && opts.backCallback){
                       var deferred=$.Deferred();           
                       deferred.promise().done(function(){
                            opts.backCallback(); 
                       }); 
                     createListDataRequest.backDeferred=deferred;
                   }
                   return boxservice.recordlist.createlistdata(createListDataRequest);
              }
             
             
     };
     boxservice.bc.playlist.episode={
             show:function(opts){
                 this.listdata=this.createListData(opts);
                 this.playlist=opts.playlist;                 
                 this.startlist();
             },
             startlist:function(){
                 var that=this;
                 if(that.htmlContent){
                     that.listdata.startList();
                 }
                 else{
                         boxservice.util.page.load("playlist/playlist-episode.html").done(function(html){
                                 that.htmlContent=html;
                                 that.listdata.startList();                                
                         });
                 }
             },
             checkButtons:function(){                 
                 if(!$(".selectableCheckbox:checked").length){
                     $("#addToList").hide();
                     
                 }
                 else{
                     $("#addToList").show();
                 }                 
             },
             addSelectedToTheList:function(){
                 var selectedids=$(".selectableCheckbox:checked").map(function(){
                     return $(this).val();                     
                 }).get();
                 var bcids=[];
                 if(selectedids && selectedids.length){
                     for(var i=0;i<selectedids.length;i++){
                         var selectedItem=this.listdata.findItemById(selectedids[i]);
                         if(selectedItem && selectedItem.brightcoveId){
                             if(this.playlist.playListData.video_ids.indexOf(selectedItem.brightcoveId)>=0){
                                 console.log("already added to the list");
                             }
                             else{
                                 bcids.push(selectedItem.brightcoveId);
                             }
                         }
                         else{
                             console.log("not piblished episodes")
                         }
                     }
                 }
                 if(bcids.length){
                     var that=this;
                   for(var i=0;i<bcids.length;i++){
                       this.playlist.playListData.video_ids.push(bcids[i]);
                       boxservice.api.bc.playlist.patch(this.playlist.id,this.playlist).done(function(){
                           that.listdata.getBackDeferred().resolve();
                       }).fail(boxservice.util.onError);
                   }  
                 }
             },            
             onStartList:function(){
                 var that=this;
                 $("#addToList").hide();
                 boxservice.util.startWait();
                 $("#content").html(this.htmlContent);
                 $("#playlistname").html(this.playlist.playListData.name);
                 $(".playListType").html(this.playlist.playListData.type);                   
                 boxservice.util.resetInput();
                 $("#backButton").click(function(){
                     that.listdata.getBackDeferred().resolve("back");
                 });
                 boxservice.util.search(that.listdata.search).done(function(search){
                     that.listdata.newSearch(search);                          
                     that.startlist();
                 });
                 $("#addToList").click(function(){
                     that.addSelectedToTheList();
                 });
             },
             list:function(items){                 
                 boxservice.util.finishWait();
                 var that=this;
                 boxservice.util.pageForEachRecord("playlist/episode-row.html",items,"#episodelistContainer").done(function(){
                     that.listdata.autoScroll();
                     boxservice.util.scrollPaging(that.listdata);
                     $(".selectableCheckbox").click(function(){
                         that.checkButtons();
                     });
                     that.checkButtons();
                 });
             },
             createListData:function(opts){
                 var that=this;   
                 
                 var createUrl=function(url){
                     return url+"?notnull=brightcoveId";
                 }
                 
                 var createListDataRequest={
                         containerSelection:"#episodelistContainer",
                         loadItemsFunction:boxservice.api.episode.list,
                         listItemsFunction:that.list.bind(that),
                         urlFunction:createUrl,
                         onStartList:that.onStartList.bind(that),
                         backDeferred:opts.backDeferred
                   };
                   if(opts && opts.backCallback){
                       var deferred=$.Deferred();           
                       deferred.promise().done(function(){
                            opts.backCallback(); 
                       }); 
                     createListDataRequest.backDeferred=deferred;
                   }
                   return boxservice.recordlist.createlistdata(createListDataRequest);
              }          
     };
     boxservice.bc.playlist.newPlaylist={
             show:function(opts){                 
                 this.backDeferred=opts.backDeferred;
                 var that=this;
                 if(that.htmlContent){
                     $("#content").html(that.htmlContent);
                     that.startShow();
                 }
                 else{
                         boxservice.util.page.load("playlist/playlist-create.html").done(function(html){
                             that.htmlContent=html;
                             $("#content").html(that.htmlContent);
                             that.startShow();                                                                    
                         });
                 }
                 
             },
             checkType:function(){
                 if($("#playlist_type").val()=="smart"){
                     $("#smart-playlist-settings").show();
                     
                 }
                 else{
                     $("#smart-playlist-settings").hide();
                 }
                 
             },
             createPlaylist:function(){
                 var that=this;
                 var playListData={
                   name:$("#playlist-name").val(),
                   description:$("#playlist-description").val(),
                   reference_id:$("#playlist-reference-id").val(),                   
                 };                 
                 if(!playListData.name){
                     boxservice.util.openDialog("Please fill in the informartion");
                     return;
                 }
                 if($("#isFavourite:checked").val){
                     playListData.favorite=true;
                 }
                 if($("#playlist_type").val()=="smart"){
                     playListData.type=$("#playlist-play-order").val();
                     var tagtype=$("#playlist-tags-type").val();
                     var searchvalue=$("#playlist-tags-search").val();
                     if(searchvalue){
                        var tags=searchvalue.split(",");
                        if(tags.length){
                            if(tagtype=="all"){
                                playListData.search="+tags:\""+tags[0]+"\"";                               
                            }
                            else{
                                playListData.search="tags:\""+tags[0]+"\"";
                            }
                            
                            
                           if(tags.length>1){
                                 for(var i=1;i<tags.length;i++){
                                     if(tags[i]){
                                         playListData.search+=",\""+tags[i]+"\"";
                                     }
                                 }                             
                           }
                            
                        }
                        
                     }
                     
                 }
                 else{
                     playListData.type="EXPLICIT"; 
                 }                 
                 console.log("creating:"+JSON.stringify(playListData));
                 boxservice.util.startWait();
                 var playlist={
                         playListData:playListData
                 }
                 boxservice.api.bc.playlist.create(playlist).done(function(){
                     that.backDeferred.resolve("created");
                 }).fail(boxservice.util.onError);
             },
             cancelPlaylist:function(){
                 this.backDeferred.resolve("back");
             },
             
             startShow:function(){
                  
                 $("#playlist_type").off("change").on('change', this.checkType.bind(this));
                 $("#playlist_type").off("input").on('input', this.checkType.bind(this));
                 $("#playlist-tags-type").val("any");
                 $("#playlist-play-order").val("ACTIVATED_OLDEST_TO_NEWEST");
                 $("#playlist_type").val("Manual");
                 var that=this;
                 $("#createPlaylist").click(function(){
                     that.createPlaylist();
                 });
                 $("#cancelPlaylist").click(function(){
                     that.cancelPlaylist();
                 });
                 this.checkType();
                 boxservice.util.resetInput();
             }
     
     };
});