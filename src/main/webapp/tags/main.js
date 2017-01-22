jQuery(document).ready(function ($) {
    boxservice.tags={            
            toSearchString:function(opts){
                if(!opts.tags || !opts.tags.length){
                    return null;
                }                
                if(opts.type=="any"){
                    var searchvalue="tags:\""+opts.tags[0]+"\"";
                    for(var i=1;i<opts.tags.length;i++){
                        searchvalue+=",";
                        searchvalue+="\""+opts.tags[i]+"\"";
                    }
                    return searchvalue;
                }
                else{  
                    var searchvalue="";
                    for(var i=0;i<opts.tags.length;i++){
                        searchvalue+=" +tags:";
                        searchvalue+="\""+opts.tags[i]+"\"";
                    }
                    return searchvalue;
                }
                
            },            
            parseSearchString:function(searchString, result){                
                if(!searchString){         
                     return;
                }
                searchString=searchString.trim();
                if(!searchString){         
                     return;
                }      
                if(searchString.startsWith("+tags:")){
                      if(result.type){
                          if(result.type!="all"){
                             result.error="searchtag contains the inconsistent type";                   
                          }               
                      }
                      else{
                         result.type="all";
                      }
                      this.parseSearchString(searchString.substring("+tags:".length),result);                       
                }
               else if(searchString.startsWith("tags:")){
                      if(result.type){
                          if(result.type!="any"){
                             result.error="searchtag contains the inconsistent type";                   
                          }               
                      }
                      else{
                         result.type="any";
                      }
                      this.parseSearchString(searchString.substring("tags:".length),result);                       
                }
                else if(searchString.startsWith(",")){
                      if(!result.type){                                                          
                             result.type="any";
                      }                          
                      this.parseSearchString(searchString.substring(1),result);                       
                }
                else if(searchString.startsWith('"')){
                    searchString=searchString.substring(1);
                      var ib=searchString.indexOf('"');
                      if(ib==-1){
                            result.error="quote is not closed in the search tag";                    
                            return;
                      }
                      var tagvalue=searchString.substring(0,ib);
                      if(!result.tags){
                          result.tags=[];            
                      }
                      result.tags.push(tagvalue);              
                      if((ib+1)<searchString.length){
                           this.parseSearchString(searchString.substring(ib+1),result); 
                      }                       
                }
                else{
                      result.error="searchtag value is in wrong format";
                }                    
            },
            getTagsFromUI:function(){
                return $(".tagslist .chip .tagitem").map(function(){
                    return $(this).attr("value");                            
                }).get();  
            },
            checkChanged:function(opts){                   
                   if(!opts.tags || !opts.tags.length){                            
                       if(opts.org.tags && opts.org.tags.length){
                           return true;
                       }
                    }                
                    else if(!opts.org.tags || !opts.org.tags.length){
                          return true;                       
                    }
                    else if(opts.org.tags.length!=opts.tags.length){
                        return true;                                            
                    }
                    else{
                            for(var i=0;i<opts.org.tags.length;i++){
                                if(opts.org.tags[i]!=opts.tags[i]){
                                    return true;
                                }
                            }
                     }
                     if(!opts.type){
                            if(opts.org.type){
                                return true;                         
                            }
                     }
                     else if(!opts.org.type){
                         return true;
                     }
                     else if(opts.type!=opts.org.type){
                         return true;                             
                      }                   
                    return false;                
            },
            
            listTags:function(opts){                                
                if(opts.tags && opts.tags.length>0){                     
                    var tags =[];
                    for(var i=0;i<opts.tags.length;i++){
                        t={tag:opts.tags[i]};
                        tags.push(t);
                    }
                    $(opts.taglistElement).empty();                    
                    boxservice.util.pageForEachRecord("tags/tag-li.html",tags,opts.taglistElement).done(function(){
                        $(".tagslist .delete").click(function(){
                               var tagToDelete=$(this).attr("value");
                               opts.onDeleteTag(tagToDelete);                               
                        });                        
                        if(opts.onComplete){
                            opts.onComplete();
                        }
                    });
                }
                else{
                    if(opts.onComplete){
                        opts.onComplete();
                    }
                }
            },
           
              cloneTags:function(tags){
                  var t=[];
                  if(tags && tags.length){
                      for(var i=0;i<tags.length;i++)
                      t.push(tags[i]);
                  }  
                  return t;
              },
             showSelectATagDialog:function(opts){
                 var that=this;             
                 if(!this.htmlContent){
                     boxservice.util.page.load("tags/add-tag-dialogue.html").done(function(html){
                         that.htmlContent=html;
                         that.showSelectATagDialog(opts);                         
                     });
                     return;
                 };
                 var gettaglist=function(listdata){
                     var that=this;
                     var deferred=$.Deferred();
                     boxservice.api.tags.list(listdata).done(function(tags){
                         var tagdata=[];
                         if(tags&& tags.length){
                             for(var i=0;i<tags.length;i++){
                                 tagdata.push({tag:tags[i]});
                             }
                         }
                         deferred.resolve(tagdata); 
                     });
                     return deferred.promise();
                 }
                 $("#selectATagDialog").remove();
                 $("body").append(this.htmlContent);                 
                 $("#selectATagDialog").openModal(); 
                 var createListDataRequest={
                         containerSelection:"#taglistContainer",
                         loadItemsFunction:gettaglist,
                         listItemsFunction:that.list.bind(that)                         
                 };
                 this.listdata=boxservice.recordlist.createlistdata(createListDataRequest);
                 this.listdata.startList();
                 this.initSortable();
                 $("#searchTagsInput").keyup(function(e){                  
                     var key = e.which;
                     if(key == 13){
                         $("#searchTagsInput").val("");
                         search="";                         
                     }
                     else{
                         search=$("#searchTagsInput").val();
                     }
                     
                     that.listdata.filter({field:"tag",startsWith:search});    
                     
                });
                 $("#selectATagDialog .cancel").click(function(){
                     $("#selectATagDialog").closeModal();
                     $("#selectATagDialog").remove();                     
                 });
                 $("#selectATagDialog .add").click(function(){
                     var selectedTag=$(".listrow.selected").attr("value");                     
                     $("#selectATagDialog").closeModal();
                     $("#selectATagDialog").remove();
                     opts.onAdd(selectedTag);
                 });
                 
             },
             initSortable:function(){
                 this.listdata.setupSortable({headerSection:".sort-tag",attributename:"tag"});                 
                 boxservice.util.menu.resetSort();
             },
             list:function(tags){
                 if(!tags || !tags.length){
                     return;
                 }                 
                 boxservice.util.pageForEachRecord("tags/tag-row.html",tags,"#taglistContainer").done(function(){
                     $(".listrow").click(function(){
                         $(".listrow").removeClass("selected");
                         $(this).addClass("selected"); 
                     });
                 });
             },
             requestEdit:function(opts){     
                     var that=this;
                     var listTagRequest={
                                         firsttime:true,
                                         tags:opts.tags,                           
                                         taglistElement:".tagslist",
                                         onDeleteTag:function(tag){
                                               opts.markEditing();
                                         },
                                         onComplete:function(){
                                                if(this.firsttime){
                                                    this.firsttime=false;
                                                    var tags=that.getTagsFromUI();                                                       
                                                    if(that.checkChanged({tags:tags,org:{tags:opts.tags}})){
                                                        opts.markDirty();
                                                    }   
                                                }
                                                else{
                                                        opts.markEditing();
                                                }                                                 
                                         }
                                     };                                  
                      this.listTags(listTagRequest);
                      $("#addNewTag").click(function(){                    
                              that.showSelectATagDialog({onAdd:function(tag){
                                  var tags=that.getTagsFromUI();
                                  tags.push(tag);
                                  listTagRequest.tags=tags;
                                  boxservice.tags.listTags(listTagRequest);                                    
                         }});                                
                         return false;
                     });
             }
             
             
            
    };        
});
