jQuery(document).ready(function ($) {
    boxservice.recordlist={};
    
    
    boxservice.recordlist.createlistdata=function(containerSelection){
        
        return{                      
            containerSelection:containerSelection,
            search:null,
            loadedall:false,
            start:0,
            items:[],
            sortBy:null,
            sortOrder:null,
            newSearch:function(search){
                this.search=search;      
                this.start=0;
                this.loadedall=false;
            },
            createListURL:function(url){
                url=boxservice.api.addQueryParam(url,"search",this.search);
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
                $(containerSelection).empty();
                this.checkThisBatch(itms);
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
            },
            setupSortable:function(sortHeaderSelection,opts){
                
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
                    opts.listItemsFunction(that.items);
                };
                
                
                
                var processSort=function(sortOrder){                    
                    if(that.loadedall){                        
                        listSortedData(sortOrder);
                    }
                    else if(!opts.loadFunction){
                        console.log("loadFunction is missing so sorting only in memory");
                        listSortedData(sortOrder);
                    }
                    else if(opts.sortParametername){                        
                        that.newSort(opts.sortParametername,sortOrder);
                        opts.loadFunction(that).done(function(itms){                        
                            that.newlist(itms);
                            opts.listItemsFunction(itms);                  
                        }).fail(boxservice.util.onError);
                    }
                    else{                                                                                 
                           that.nextPage();
                           opts.loadFunction(that).done(function(items){
                               console.log(":::loaded data:"+items.length);
                                   that.addtolist(items);
                                   processSort(sortOrder);                                    
                                }).fail(boxservice.util.onError);                            
                    }
                };                                
                boxservice.util.menu.configSort(sortHeaderSelection,function(){
                    boxservice.util.startWait();
                    processSort("asc"); 
                },function(){
                    boxservice.util.startWait();
                    processSort("desc");                    
                });
                
           }
            
        };
        

    };
        
    
    
    
});