jQuery(document).ready(function ($) {
    boxservice.recordlist={};
    
    
    boxservice.recordlist.createlistdata=function(opts){
        
        return{                      
            containerSelection:opts.containerSelection,
            search:null,
            loadedall:false,
            backDeferred:opts.backDeferred,
            onStartList:opts.onStartList,
            scrollPosition:0,
            autoScroll:function(){
                if(this.scrollPosition){
                    $(window).scrollTop(this.scrollPosition);
                }                
            },
            getBackDeferred:function(){
                var that=this;
                if(that.backDeferred){
                    return that.backDeferred;
                }
                var deferred=$.Deferred();
                console.log("creating new deferred object");
                that.scrollPosition=$(window).scrollTop();
                
                deferred.promise().done(function(){                        
                        if(that.onStartList){
                            that.onStartList();
                        }
                        
                        that.listItemsFunction(that.items);
                });  
                return deferred;
            },
            start:0,
            items:[],
            sortBy:null,
            sortOrder:null,
            loadItemsFunction:opts.loadItemsFunction,
            listItemsFunction:opts.listItemsFunction,
            itemsInLoadItemsFunction:opts.itemsInLoadItemsFunction,
            urlFunction:opts.urlFunction,            
            newSearch:function(search){
                this.search=search;      
                this.start=0;
                this.loadedall=false;
                this.scrollPosition=0;
            },
            rangeSearch:function(from,to){
              this.from=from;
              this.to=to;
              this.loadedall=false;
              this.scrollPosition=0;
            },
            createListURL:function(url){    
                if(this.urlFunction){
                    url=this.urlFunction(url);
                }
                url=boxservice.api.addQueryParam(url,"search",this.search);
                url=boxservice.api.addQueryParam(url,"start",this.start);
                url=boxservice.api.addQueryParam(url,"sortBy",this.sortBy);
                url=boxservice.api.addQueryParam(url,"sortOrder",this.sortOrder);                
                return url;
            },
            createListURLWithPrefix:function(url){
                url=boxservice.api.addQueryParam(url,"prefix",this.search);
                url=boxservice.api.addQueryParam(url,"start",this.start);
                url=boxservice.api.addQueryParam(url,"sortBy",this.sortBy);
                url=boxservice.api.addQueryParam(url,"sortOrder",this.sortOrder);                
                return url;
            },
            createListWithRange:function(url){
                url=boxservice.api.addQueryParam(url,"from",this.from);
                url=boxservice.api.addQueryParam(url,"to",this.to);
                url=boxservice.api.addQueryParam(url,"start",this.start);
                url=boxservice.api.addQueryParam(url,"sortBy",this.sortBy);
                url=boxservice.api.addQueryParam(url,"sortOrder",this.sortOrder);                
                return url;
            },
            nextPage:function(){
                if(!this.start)
                    this.start=0;
                else{
                    this.start=parseInt(this.start);
                }
                this.start+=boxservice.appinfo.appconfig.recordLimit;
            },
            newlist:function(itms){                
                $(this.containerSelection).empty();
                this.checkThisBatch(itms);
                this.items=itms;                
            },
            filter:function(opts){
                var nitems=[];
                for(var i=0;i<this.items.length;i++){
                    var v=this.items[i][opts.field];                    
                    if(v&&v.startsWith(opts.startsWith)){
                        nitems.push(this.items[i]);
                    }                    
                }
                $(this.containerSelection).empty();
                this.listItemsFunction(nitems);                
            },
            completeItems:function(itms){
                $(this.containerSelection).empty();
                this.loadedall=true;
                this.items=itms;
            },
            checkThisBatch:function(itms){
                if(!itms || !itms.length || itms.length<boxservice.appinfo.appconfig.recordLimit){
                    console.log("list all loaded");
                    this.loadedall=true;
                }
                else{
                    console.log("list not all loaded");
                    this.loadedall=false;
                }  
            },
            addtolist:function(itms){                
                this.checkThisBatch(itms);
                this.items=this.items.concat(itms);
            },
            
            newSort:function(sortBy,sortOrder){
                this.sortBy=sortBy;
                this.sortOrder=sortOrder;
                this.start=0;  
                this.scrollPosition=0;
            },
            loadData:function(callback){
               var that=this;
               that.loadItemsFunction(that).done(function(itms){    
                    if(that.itemsInLoadItemsFunction){
                        itms=boxservice.util.getValueWithAttribute(itms,that.itemsInLoadItemsFunction);
                    }                    
                    callback(itms);
               }).fail(boxservice.util.onError);
            },
            loadNextPage:function(){
                var that=this;
                boxservice.util.startWait();
                that.nextPage();
                that.loadData(function(itms){                    
                    that.addtolist(itms);
                    that.listItemsFunction(itms);
                });  
             },             
             loadAllData:function(callback){
                 var that=this;
                 
                 var loadTheRest=function(){
                     if(that.loadedall){
                         callback();
                     }
                     else{
                         that.nextPage();
                         that.loadData(function(items){                             
                             that.addtolist(items);
                             loadTheRest();
                         });
                     }
                 };
                 that.newSort(null,null);                 
                 that.loadData(function(itms){
                     that.newlist(itms);
                     loadTheRest();
                 }); 
             },
            setupSortable:function(opts){                
                var that=this;                
                var sortFunction=function(a,b){
                    var aa=boxservice.util.getValueWithAttribute(a,opts.attributename);
                    var bb=boxservice.util.getValueWithAttribute(b,opts.attributename);
                    if((aa==null || aa =="undefined") && (bb==null || bb=="undefined")){
                        return 0;
                    }
                    else if(aa==null || aa =="undefined"){
                        return 1;
                    }
                    else if(bb==null || bb=="undefined"){
                        return -1;
                    }
                    else if (aa < bb) 
                        return 1; 
                    else if (aa > bb)
                       return -1;
                    else
                       return 0;
                };
                if(opts.sortFunction){
                    sortFunction= opts.sortFunction;                    
                }
                
                var listSortedData=function(sortOrder){                    
                    that.items.sort(sortFunction);
                    if(sortOrder === "desc"){
                        that.items.reverse();    
                    }
                    that.start=0;                        
                    $(that.containerSelection).empty();
                    that.listItemsFunction(that.items);
                };
                var processSort=function(sortOrder){                    
                    if(that.loadedall){                        
                        listSortedData(sortOrder);
                    }
                    else if(!that.loadItemsFunction){
                        console.log("loadFunction is missing so sorting only in what is already loaded");
                        listSortedData(sortOrder);
                    }
                    else if(opts.sortParametername){                        
                        that.newSort(opts.sortParametername,sortOrder);
                        that.loadData(function(itms){
                            that.newlist(itms);
                            that.listItemsFunction(itms);
                        });                        
                    }
                    else{  
                        
                        that.loadAllData(function(){
                            listSortedData(sortOrder);
                        });                                                                                 
                    }
                }; 
                var sortOpts={
                        headerSection:opts.headerSection,
                        ascFunction:function(){
                            boxservice.util.startWait();
                            processSort("asc"); 
                        },
                        descFunction:function(){
                            boxservice.util.startWait();
                            processSort("desc");                    
                        }
                };
                boxservice.util.menu.configSort(sortOpts);                
           },
           startList:function(){
                   var that=this;
                   if(that.onStartList){
                       that.onStartList();
                   }
                   
                   this.loadData(function(itms){
                       that.newlist(itms);                       
                       that.listItemsFunction(itms);
                   });                  
           },
           startListByLoadingAll:function(listRequest){
               var that=this;
               if(that.onStartList){
                   that.onStartList();
               }
               this.loadAllData(function(){
                   if(listRequest.sortFunction){
                       that.items.sort(listRequest.sortFunction);
                   }                   
                   if(listRequest.sortOrder && listRequest.sortOrder === "desc"){
                       that.items.reverse();    
                   }
                   that.start=0;                        
                   $(that.containerSelection).empty();
                   that.listItemsFunction(that.items);
               });
           },
           findItemIndexById:function(id){
               if(!this.items || !this.items.length){
                   return -1;
               }
               for(var i=0;i<this.items.length;i++){
                   if(this.items[i].id == id){
                       return i;
                   }
               }
           },
           findItemById:function(id){
             var index=this.findItemIndexById(id);
             if(index<0){
                 return null;
             }
             return this.items[index];
           },
           deleteItemById:function(id){
               var index=this.findItemIndexById(id);
               if(index>0){
                   this.items.splice(index,1);
               }               
           },

           getAllIds:function(){
             var ids=[];
             for(var i=0;i<this.items.length;i++){
                 ids.push(this.items[i].id);
             }
             return ids;
           },           
           isItemsHasChanged:function(ids){
               if(!ids || !ids.length){
                   if(!this.items || !this.items.length){
                       return false;
                   } 
                   else{
                       return true;
                   }
               }
               if(!this.items || !this.items.length){
                   if(!ids || !ids){
                       return false;
                   } 
                   else{
                       return true;
                   }
               }
               if(this.items.length!==ids.length){
                   return true;
               }
               for(var i=0;i<ids.length;i++){
                   if(ids[i]!=this.items[i].id){
                       return true;
                   }                               
               }
              
               return false;
           },
           
           moveUpById:function(id, callback){
               var ind=this.findItemIndexById(id);
               if(ind<0){
                   console.log("id could not be found from the list:"+ind);                     
                   return false;
               }
               if(ind==0){
                   console.log("it is already on the top of the list");
                   return false;
               }
               var item=this.items[ind];
               this.items.splice(ind,1);
               this.items.splice(ind-1,0,item);
               $(this.containerSelection).empty();
               this.listItemsFunction(this.items, callback);               
               return true;
           },
           moveDownById:function(id, callback){
               var ind=this.findItemIndexById(id);
               if(ind<0){
                   console.log("id could not be found from the list:"+ind);                     
                   return false;
               }
               if(ind==(this.items.length-1)){
                   console.log("it is already on the bottom of the list");
                   return false;
               }
               var item=this.items[ind];
               this.items.splice(ind,1);
               this.items.splice(ind+1,0,item);
               $(this.containerSelection).empty();
               this.listItemsFunction(this.items,callback);               
               return true;
           },
           deleteByIds:function(ids){
               for(var i=0;i<ids.length;i++){
                   var ind=this.findItemIndexById(ids[i]);                                      
                   this.items.splice(ind,1);
               }
               $(this.containerSelection).empty();
               this.listItemsFunction(this.items);               
           }
            
        };
        

    };
        
    
    
    
});