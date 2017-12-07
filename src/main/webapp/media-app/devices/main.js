jQuery(document).ready(function ($) {
    boxservice.devices={                       
            getFromUI:function(opts){
                return $(opts.containerElement+" .devicelist .chip .tagitem").map(function(){
                    return $(this).attr("value");                            
                }).get();  
            },
            checkChanged:function(opts){                   
                   if(!opts.devices || !opts.devices.length){                            
                       if(opts.org.devices && opts.org.devices.length){
                           return true;
                       }
                    }                
                    else if(!opts.org.devices || !opts.org.devices.length){
                          return true;                       
                    }
                    else if(opts.org.devices.length!=opts.devices.length){
                        return true;                                            
                    }
                    else{
                            for(var i=0;i<opts.org.devices.length;i++){
                                if(opts.org.devices[i]!=opts.devices[i]){
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
            
            list:function(opts){                                
                if(opts.devices && opts.devices.length>0){                     
                    var devices =[];
                    for(var i=0;i<opts.devices.length;i++){
                        t={device:opts.devices[i]};
                        devices.push(t);
                    }
                    $(opts.devicesElement).empty();                    
                    boxservice.util.pageForEachRecord("devices/device-li.html",devices,opts.devicesElement).done(function(){
                        $(opts.devicesElement+" .delete").click(function(){
                               var deviceToDelete=$(this).attr("value");
                               opts.onDelete(deviceToDelete);                               
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
           
           clone:function(devices){
                  var t=[];
                  if(devices && devices.length){
                      for(var i=0;i<devices.length;i++)
                      t.push(devices[i]);
                  }  
                  return t;
              },
             showSelectDialog:function(opts){
                 var that=this;             
                 if(!this.htmlContent){
                     boxservice.util.page.load("devices/add-device-dialogue.html").done(function(html){
                         that.htmlContent=html;
                         that.showSelectDialog(opts);                         
                     });
                     return;
                 };
                 var getdevicelist=function(listdata){
                     var that=this;
                     var deferred=$.Deferred();
                     boxservice.api.clientdevices.list(listdata).done(function(devices){
                         var devicedata=[];
                         if(devices&& devices.length){
                             for(var i=0;i<devices.length;i++){
                                 devicedata.push({device:devices[i].name});
                             }
                         }
                         deferred.resolve(devicedata); 
                     });
                     return deferred.promise();
                 }
                 $("#selectDeviceDialog").remove();
                 $("body").append(this.htmlContent);                 
                 $("#selectDeviceDialog").openModal(); 
                 var createListDataRequest={
                         containerSelection:"#selectDeviceDialog .devicelistContainer",
                         loadItemsFunction:getdevicelist,
                         listItemsFunction:that.listInDialog.bind(that)                         
                 };
                 this.listdata=boxservice.recordlist.createlistdata(createListDataRequest);
                 this.listdata.startList();
                 $("#selectDeviceDialog .cancel").click(function(){
                     $("#selectDeviceDialog").closeModal();
                     $("#selectDeviceDialog").remove();                     
                 });
                 $("#selectDeviceDialog .add").click(function(){
                     var selectedDevice=$(".listrow.selected").attr("value");                     
                     $("#selectDeviceDialog").closeModal();
                     $("#selectDeviceDialog").remove();
                     opts.onAdd(selectedDevice);
                 });                 
             },
             initSortable:function(){
                 this.listdata.setupSortable({headerSection:".sort-device",attributename:"device"});                 
                 boxservice.util.menu.resetSort();
             },
             listInDialog:function(devices){
                 if(!devices || !devices.length){
                     return;
                 }                 
                 boxservice.util.pageForEachRecord("devices/device-row.html",devices,"#devicelistContainer").done(function(){
                     $(".listrow").click(function(){
                         $(".listrow").removeClass("selected");
                         $(this).addClass("selected"); 
                     });
                 });
             },
             requestEdit:function(opts){     
                     var that=this;
                     var listDeviceRequest={
                                         firsttime:true,
                                         devices:opts.devices,                           
                                         devicesElement:opts.containerElement+" .devicelist",
                                         onDelete:function(device){
                                               opts.markEditing();
                                         },
                                         onComplete:function(){
                                                if(this.firsttime){
                                                    this.firsttime=false;
                                                    var devices=that.getFromUI(opts);                                                       
                                                    if(that.checkChanged({devices:devices,org:{devices:opts.devices}})){
                                                        opts.markDirty();
                                                    }   
                                                }
                                                else{
                                                        opts.markEditing();
                                                }                                                 
                                         }
                                     };                                  
                      this.list(listDeviceRequest);
                      $(opts.containerElement+" .addNewDevice").click(function(){                    
                              that.showSelectDialog({onAdd:function(device){
                                  var devices=that.getFromUI(opts);
                                  devices.push(device);
                                  listDeviceRequest.devices=devices;
                                  that.list(listDeviceRequest);                                    
                         }});                                
                         return false;
                     });
             }
    };        
});
