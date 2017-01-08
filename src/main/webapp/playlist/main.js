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
                createListData:function(opts){
                    var that=this;
                    var listfunction=function(itms){
                        that.list(itms);
                    };
                    var createListDataRequest={
                            containerSelection:"#playlistContainer",
                            loadItemsFunction:boxservice.api.bc.playlist.list,
                            listItemsFunction:listfunction,
                            onStartList:function(){
                                boxservice.util.startWait();
                                $("#content").html(that.htmlContent);
                                that.initSortable();
                                boxservice.util.search(that.listdata.search).done(function(search){
                                        that.listdata.newSearch(search);                          
                                        that.startlist();
                                 });                
                            }
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
                 
                 if(this.listdata.isItemsHasChanged(this.playlist.playListData.video_ids)){
                     return true;
                 }
                 else
                     return false;
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
             list:function(items){                 
                 boxservice.util.finishWait();
                 var that=this;
                 boxservice.util.pageForEachRecord("playlist/video-row.html",items,"#playlistContainer").done(function(){
                     that.listdata.autoScroll();  
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
    
});