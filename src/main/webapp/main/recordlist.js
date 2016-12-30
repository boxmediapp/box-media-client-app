jQuery(document).ready(function ($) {
    boxservice.recordlist={};
    
    
    boxservice.recordlist.createlistdata=function(containerSelection){
        
        return{                      
            containerSelection:containerSelection,
            search:null,
            loadedall:false,
            start:0,
            items:[],
            newSearch:function(search){
                this.search=search;      
                this.start=0;
                this.loadedall=false;
            },
            nextPage:function(){
                if(!this.start)
                    this.start=0;
                else{
                    this.start=parseInt(this.start);
                }
                this.start+=boxservice.appinfo.appconfig.recordLimit;
            },
            newlist:function(items){
                this.start=0;
                $(containerSelection).empty();
                this.items=items;
            },
            addtolist:function(itms){
                
                if(!itms || !itms.length || itms.length<boxservice.appinfo.appconfig.recordLimit){
                    this.loadedall=true;
                }
                else{
                    this.loadedall=false;
                }
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
                    if(aa==null && bb==null){
                        return 0;
                    }
                    else if(aa==null){
                        return 1;
                    }
                    else if(bb==null){
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
                
                var reloadDataWithSort=function(sortOrder){
                        that.newSort(opts.sortParametername,sortOrder);
                        opts.loadFunction(that).done(function(itms){                        
                        that.newlist(itms);
                        opts.listItemsFunction(itms);                  
                        }).fail(boxservice.util.onError); 
                };
                var listSortedData=function(sortOrder){
                    that.newSort(opts.sortParametername,sortOrder);
                    that.items.sort(sortFunction);
                    if(sortOrder === "desc"){
                        that.items.reverse();    
                    }
                    that.start=0;                        
                    $(that.containerSelection).empty();
                    opts.listItemsFunction(that.items);
                };
               
                boxservice.util.menu.configSort(sortHeaderSelection,function(){                    
                    if(that.loadedall || (!opts.loadFunction)){                        
                        listSortedData("asc");
                    }
                    else{                              
                        reloadDataWithSort("asc");
                    }
                },function(){
                    if(that.loadedall || (!opts.loadFunction)){
                        listSortedData("desc");                        
                    }
                    else{                           
                        reloadDataWithSort("desc");
                    }
                });
                
           }
            
        };
        

    };
        
    
    
    
});