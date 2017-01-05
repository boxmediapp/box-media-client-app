jQuery(document).ready(function ($) {
        if (!boxservice.episode) {
                boxservice.episode = {};
        }
        boxservice.episode.editpage = {};
        
        boxservice.episode.editFields=[{input:{selection:"#episodeTitle"}, data:{value:["title"]}},                                                                 
            {input:{selection:"#episodeNumber"}, data:{value:["number"]}},
            {input:{selection:"#episodeSequenceNumber"}, data:{value:["episodeSequenceNumber"]}},
            {input:{selection:"#episodeSynopsis"}, data:{value:["synopsis"]}},
            {input:{selection:"#programmeNumber"}, data:{value:["programmeNumber"]}},                               
            {input:{selection:"#episodeContentType"}, data:{value:["contentType"]}},                                
            {input:{selection:"#txChannel"}, data:{value:["txChannel"]}},
          
                {input:{selection:"#supplier"},        data:{value:["supplier"]}},
            {input:{selection:"#certType"},        data:{value:["certType"]}},
            {input:{selection:"#episodeTags"},     data:{type:"array", value:["tags"]}},
            {input:{selection:"#warningText"},     data:{value:["warningText"]}},                                                                                                   
            {input:{selection:"#adsupport"},       data:{value:["adsupport"]}}, 
            {input:{selection:"#showType"},        data:{value:["showType"]}},
            {input:{selection:"#brightcoveId"},    data:{value:["brightcoveId"]}},
            
            {input:{selection:"#ingestProfile"}, data:{value:["ingestProfile"]}},
            {input:{selection:"#ingestSource"}, data:{value:["ingestSource"]}},
            {input:{selection:"#imageURL"}, data:{value:["imageURL"]}},
            
            {input:{selection:"#durationScheduled"}, data:{value:["durationScheduled"]}},
            {input:{selection:"#durationUploaded"}, data:{value:["durationUploaded"]}},
            {input:{selection:"#prAuk"}, data:{value:["prAuk"]}},
            {input:{selection:"#materialId"}, data:{value:["materialId"]}},
            {input:{selection:"#excludeddevices"}, data:{value:["excludeddevices"]}},
            {input:{selection:"#geoAllowedCountries"}, data:{value:["geoAllowedCountries"]}},
            {input:{selection:"#numberOfAdsPerBreak"}, data:{value:["numberOfAdsPerBreak"]}},
            {input:{selection:"#firstTXDate"}, data:{value:["firstTXDate"], type:"datetime-local"}},
            {input:{selection:"#recordedAt"}, data:{value:["recordedAt"], type:"datetime-local"}},
          
            {input:{selection:"#seriesTitle"},         data:{value:["series","name"]}, "notEditable":true},
            {input:{selection:"#editorNotes"}, data:{value:["editorNotes"]}}
            
            ];
        
        boxservice.episode.edit=function(episodeid, originalDeferred){
            var deferred =null;
            
            if(originalDeferred){
                    deferred=originalDeferred;
            }
            else{
                    deferred=$.Deferred();
            }
            
                    
            if(!episodeid){
                    boxservice.util.openDialog("epsiodeid is null:");
                    deferred.reject("episodeid is null");
                    return deferred.promise();
            }
            var pagePromise=boxservice.episode.loadEditEpisodePage();
            var episodedatapromise= boxservice.api.episode.view(episodeid);
            var tagspromise=boxservice.api.tags.list();
            var compliancePromise=boxservice.episode.loadCompliancePage();
            var cuepointsRowPagePromise=boxservice.episode.cuepointsRowPage();
            
            $.when(pagePromise,episodedatapromise,tagspromise,compliancePromise,cuepointsRowPagePromise).then(function(htmlContentResult,episodeRsult,tagResult,compliancePageRsult, cuspointsRowPageResult){
                       var htmlContent=htmlContentResult[0];
                       var episode=episodeRsult[0];
                       var tags=tagResult[0];
                       var compliancePage=compliancePageRsult[0];
                       var cueRowPage=cuspointsRowPageResult[0];
                       
                       var configpage={types:{lastModifiedAt:"datetime","createdAt":"datetime"} };
                                       
                           $("#content").html(htmlContent);                        
                           boxservice.util.form.initInputFields(episode,boxservice.episode.editFields);                                                          
                           var scheduleconfig={"types":{"scheduleTimestamp":"datetime"}};
                                                   
                           boxservice.util.pageForEachRecord("episode/schedule-record.html",episode.scheduleEvents,"#scheduleslist",scheduleconfig).done(function(){
                                   
                                   console.log("schedule event is added");
                           });
                           var rconfig={types:{start:"datetime",end:"datetime"}};
                           
                           boxservice.util.pageForEachRecord("episode/availability-row.html",episode.availabilities,"#availabilitylist",rconfig).done(function(){
                                   
                                   console.log("schedule event is added");
                           });
                           
                           $("#statusArea").empty();
                           var chipElemen=$("<div/>").attr({"class":"chip"});
                           chipElemen.html("Metadata:"+episode.episodeStatus.metadataStatus);
                           $("#statusArea").append(chipElemen);
                           boxservice.episode.dislayStatus(episode);
                           
                           
                           if(episode.complianceInformations){
                                   var complianceContent="";
                                   for(var i=0;i<episode.complianceInformations.length;i++){
                                           complianceContent=complianceContent+boxservice.util.replaceVariables(compliancePage,episode.complianceInformations[i]);
                                           
                                   }
                                   $("#complianceInformation").append(complianceContent);
                           }
                           boxservice.episode.editpage.init(episode,deferred);
                                   
                          
                           
                           
                           
                           boxservice.util.form.populateOptions(tags,"#episodeTags");
                           boxservice.util.form.selectOptions(episode.tags,"#episodeTags");
                           /*
                           if(episode.cuePoints && episode.cuePoints.length>0){
                                   var cueContent="";
                                   for(var i=0;i<episode.cuePoints.length;i++){
                                           cueContent=cueContent+boxservice.util.replaceVariables(cueRowPage,episode.cuePoints[i]);
                                   }
                                   $("#cuepoints").append(cueContent);
                           }
                           */
                           boxservice.util.resetInput();
                           
                           
                           
                           
                   
                           
                           
                           
                           
                           
                           
                           
                           var isDataNotConsistent=boxservice.util.form.valueHasChanged(episode,boxservice.episode.editFields);                    
                           if(isDataNotConsistent){
                                      boxservice.episode.editpage.markDirty();
                                          boxservice.util.openDialog("The fields appears to be inconsistent, not editable:"+isDataNotConsistent);                                        
                                 return;
                   }
                           boxservice.episode.resetStatus();
                           boxservice.episode.checkStatus(episode);
                           
                           boxservice.util.form.inputChangedCallback(boxservice.episode.editFields, function(){                                                            
                                   boxservice.episode.editpage.markEditing();
                                   boxservice.episode.checkStatus(episode);
                           });
                           
                           var changePublishedStatus=function(episodeid, publishedStatus){                                 
                           var statusContainer= $("#episodeEditor");
                           var statusTextContainer=$(".publishedStatusValue");
                           boxservice.episode.changePublishedStatus(publishedStatus,episodeid,statusContainer,statusTextContainer);  
                           };
                           
                           
                           
                           $("#publishToBC").click(function(){
                                         boxservice.util.startWait();
                                         var publishpromise=boxservice.api.bc.publish(episode);
                                         publishpromise.done(function(){
                                                 boxservice.util.finishWait();                                           
                                                 boxservice.episode.edit(episode.id,deferred);                                           
                                         });
                                         publishpromise.fail(function(err){                                                              
                                                 boxservice.util.finishWait();
                                                 boxservice.util.openDialog("failed to  pulished to Brifghtcove video cloud:"+JSON.stringify(err));
                                         });
                                         return false;
                                 });
                                 $("#updateToBC").click(function(){
                                         boxservice.util.startWait();
                                         var publishpromise=boxservice.api.bc.publish(episode);
                                         publishpromise.done(function(){
                                                 boxservice.util.finishWait();                                           
                                                 boxservice.episode.edit(episode.id,deferred);
                                         });
                                         publishpromise.fail(function(err){              
                                                 boxservice.util.finishWait();
                                                 boxservice.util.openDialog("failed to  update the Brifghtcove video cloud:"+JSON.stringify(err));
                                         });
                                         return false;
                                 });
                                 boxservice.dialogs.setupDeleteMediaEntryDialog($("#unpublishFromBC"), function(){                                       
                                         boxservice.util.startWait();
                                         console.log("going to delete the media entry");
                                         var publishpromise=boxservice.api.bc.unpublish(episode);
                                         publishpromise.done(function(response){                                                 
                                                 boxservice.util.finishWait();
                                                 console.log(response);
                                                 if(response && typeof response ==="object"){
                                                     if(response.code==="EpisodeNotFound"){
                                                         boxservice.util.openDialog("Episode itself does not exist in the database anymore");
                                                     }
                                                     else if(response.code==="EpisodeNotPublished"){                                                     
                                                         boxservice.util.openDialog("Episode seems already removed from the brightcove");
                                                     }
                                                     else if(response.code==="EntryDoesNotExists"){                                                     
                                                         boxservice.util.openDialog("The corresponding media entry in the brightcove seems deleted from the brightcove directly, please scroll down to find the 'Brightcove ID' field, and clear its value and then click on save to correct this inconsistency with the brifghtcove, in the future please avoid to delete the media entry directly from the brightcove");
                                                     }                                                     
                                                 }
                                                 boxservice.episode.edit(episode.id,deferred);
                                         });
                                         publishpromise.fail(function(err){
                                                 boxservice.util.finishWait();
                                                 boxservice.util.openDialog("failed to  remove from the Brifghtcove video cloud:"+JSON.stringify(err));                                          
                                         });
                                 });
                                 boxservice.dialogs.setupSwitchToNewSeriesDialog($("#switchSeries"), function(){
                                         var contractNumber=$("#seriesContractNumber").val();
                                         if(!contractNumber){
                                                 return;
                                         }
                                         contractNumber=contractNumber.trim();
                                         if(!contractNumber.length){
                                                 return;
                                         }
                                         boxservice.util.startWait();
                                         boxservice.api.series.getByContractNumber(contractNumber).done(function(series){                                                
                                                 if(series.length>0){
                                                                 
                                                                 episode.series=series[0];                                                               
                                                                 var episodedatapromise = boxservice.api.episode.update(episode.id, episode, "switchseries");
                                                                 episodedatapromise.done(function () {
                                                                         boxservice.util.finishWait();
                                                                         boxservice.episode.edit(episode.id,deferred);
                                                                 }).fail(function (err) {
                                                                         boxservice.util.openDialog("Failed" + JSON.stringify(err));
                                                                         boxservice.util.finishWait();
                                                                 });
                                                 }
                                                 else{
                                                         boxservice.util.finishWait();
                                                         boxservice.util.openDialog("The series could not be found");                                                    
                                                 }
                                         });     
                                 });
                                 
                                 
                                 
                                 
                                 $("#viewInBrightcove").click(function(){
                                         var url=boxservice.bc.videourl(episode.brightcoveId);
                                         window.open(url,"_blank");
                                         return false;
                                 });
                                 $("#jsonview").click(function(){
                                         var url=boxservice.api.episode.getDetailsUrl(episode.id);
                                         window.open(url,"_blank");
                                         return false;
                                 });
                                 $("#soundMouseHeaderview").click(function(){
                                         var url=boxservice.api.episode.soundMouseHeaderFileUrl(episode.id);
                                         window.open(url,"_blank");
                                         return false;
                                 });
                                 $("#soundMouseSmurfview").click(function(){
                                         var url=boxservice.api.episode.soundMouseSmurfFileUrl(episode.id);
                                         window.open(url,"_blank");
                                         return false;
                                 });
                                 $("#bcAnalycsData").click(function(){                                   
                                         var url=boxservice.api.episode.bcAnalysticsUrl(episode.brightcoveId);
                                         window.open(url,"_blank");
                                         return false;
                                 });
                                 
                                 
                                 
                                 
                                 
                                 
                                 
                                 
                                 
                                 
                                 
                                 
                                 $("#editSeries").off("click").on("click", function(){                                           
                                                 boxservice.series.edit(episode.series.id).done(function(){
                                                         boxservice.episode.edit(episode.id,deferred);
                                                 });                                             
                                                 return false;
                                 }); 
                                 
                                 
                                 
                                                                                                     
                           if(episode.brightcoveId){
                                          var videopromise=boxservice.api.bc.video.view(episode.brightcoveId);
                                  var pagepromise=boxservice.bc.loadViewVideoPage();
                                 $.when(videopromise,pagepromise).then(function(videoResult,htmlContentResult){  
                                         var video=videoResult[0];
                                         var htmlContent=htmlContentResult[0];
                                         $("#bcView").html(boxservice.util.replaceVariables(htmlContent,video));
                                 });
                          
                            }
                                 
                                 
                                 
            },function(htmlError,episodeError,tagError,compliancePageError,cueRowPageError){
                    boxservice.util.openDialog("error loading the data from the server:"+htmlError+":"+  episodeError+":"+tagError+":"+compliancePageError+":"+cueRowPageError);            
            });
            return deferred.promise();      
        };
        
        boxservice.episode.editpage.switchPublishedStatus=function(targetButton, publishedStatus,episode){
                
                if(!boxservice.episode.checkRule(episode,publishedStatus)){
                        return;
                }               
                targetButton.parents(".statusAction").removeClass("active");
                boxservice.util.startWait();
                boxservice.api.episode.changePublishedStatus(episode.id,publishedStatus).done(function(updatedEpisode){                 
                        boxservice.episode.setPublishedClassName($("#episodeEditor"),updatedEpisode.episodeStatus.publishedStatus);                     
                        episode.episodeStatus.publishedStatus=updatedEpisode.episodeStatus.publishedStatus;                     
                        boxservice.util.finishWait();
                 }).fail(boxservice.util.onError);
        };   
        
        boxservice.episode.editpage.markEditing=function(){
                $("#episodeEditor").addClass("editing");
        };
        boxservice.episode.editpage.markDirty=function(){
                $("#episodeEditor").addClass("dirty");
                $("#episodeEditor").removeClass("editing");
        };
        
        
    boxservice.episode.editpage.doneEditing=function(){
        $("#episodeEditor").removeClass("editing");
        };
    boxservice.episode.editpage.isEditing=function(){
                return $("#episodeEditor").hasClass("editing");
        };
                

        boxservice.episode.editpage.init = function (episode, deferred) {                                         
                $("#backButton").click(function(){
                        deferred.resolve("back");
                });
                
                $(".approve").click(function(){                  
             boxservice.episode.editpage.switchPublishedStatus($(this),"APPROVED",episode);
             return false;
          });
          $(".disapprove").click(function(){    
                  boxservice.episode.editpage.switchPublishedStatus($(this),"NOT_APPROVED",episode);
                  return false;
         });
          $(".approveinprogress").click(function(){     
                  boxservice.episode.editpage.switchPublishedStatus($(this),"IN_PROGRESS",episode);
                  return false;
         });
          
          $(".activate").click(function(){                         
                  boxservice.episode.editpage.switchPublishedStatus($(this),"ACTIVE",episode);
                 
          });
          $(".deactivate").click(function(){                     
                  boxservice.episode.editpage.switchPublishedStatus($(this),"INACTIVE",episode);                                                                                 
          });
          
          
          boxservice.util.setupDropdownMenu($(".trafficLight"));
           
          
          boxservice.episode.setAvailabilityClassName($("#episodeEditor"),episode.currentAvailabilityStatus);
          boxservice.episode.setRequiredFieldClassName($("#episodeEditor"),episode.requiredFieldsStatus);
          if(episode.requiredFieldsMissing){
                  $(".requiredFieldsStatus .tooltiptext").text("Missing the required fields: "+episode.requiredFieldsMissing);
          }
                boxservice.episode.editpage.intPlayVideo(episode);
                $("#transcodeMedia").click(function () {
                        boxservice.episode.startTranscodeMedia(episode);
                });
                /*
                $("#createtags").click(function () {
                        $("#createNewTagsDialog").openModal();
                });
                */
                $("#admintags").click(function () {
                        if(boxservice.episode.editpage.isEditing()){
                                boxservice.util.openDialog("Please save your changes first");
                        }
                        else{
                                boxservice.admin.tags().done(function(){
                                        boxservice.api.tags.list().done(function(availtags){
                                                boxservice.episode.edit(episode.id,deferred);
                                        });
                                });
                        }
                        
                });
                
                boxservice.episode.editpage.initTagDialog(episode);
                $("#cancelEditEpisode").unbind("click").click(function () {
                        
                        boxservice.episode.editpage.doneEditing();
                        boxservice.episode.edit(episode.id,deferred);

                });

                $("#deleteEpisode").unbind("click").click(function () {
                        $("#deleteEpisodeDialog").openModal();
                        var warningMessageTemplate = "This episode '${title}' ${programmeNumber} is going to be deleted permanently, are you sure you going to delete this episode?";
                        var warningMessage = boxservice.util.replaceVariables(warningMessageTemplate, episode);
                        $("#deleteEpisodeDialog .message").html(warningMessage);
                });
                $("#deleteEpisodeDialog .cancel").unbind("click").click(function () {

                });
                $("#deleteEpisodeDialog .confirm").unbind("click").click(function () {
                        boxservice.util.startWait();
                        var deleteEpisode=function(){
                            boxservice.api.episode.remove(episode).done(function () {
                                boxservice.util.finishWait();
                                boxservice.episode.listdata.deleteItemById(episode.id);
                                deferred.resolve("back");                                
                             }).fail(boxservice.util.onError);
                        }
                        if(episode.brightcoveId){
                            if(boxservice.appinfo.appconfig.autoCreatePlaceHolder){
                                boxservice.api.bc.unpublish(episode).done(function(){
                                    deleteEpisode();
                                }).fail(function(err){
                                    boxservice.util.finishWait();
                                    boxservice.util.openDialog("failed to  remove from the Brifghtcove video cloud:"+JSON.stringify(err));                                          
                                });   
                            }
                            else{
                                boxservice.util.finishWait();
                                boxservice.util.openDialog("You need to delete the media entry first");
                            }                            
                            return;
                        }
                        else{
                            deleteEpisode();
                        }
                        
                });
                $("#showCueEditor").click(function () {
                        boxservice.cue.show(episode).done(function(){
                                console.log("cue editor has called the callback on episode");
                                boxservice.episode.edit(episode.id, deferred);
                        }).fail(function(){
                                boxservice.episode.edit(episode.id, deferred);
                        });
                        
                        
                });
                var addModifyAvailabilityWindows=function () {
                        
                        boxservice.availability.show(episode).done(function(){
                                boxservice.episode.edit(episode.id, deferred);
                        }).fail(function(){
                                boxservice.episode.edit(episode.id, deferred);
                        });
                };
                $("#addModifyAvailabilityWindows").click(addModifyAvailabilityWindows);
        $(".addModifyAvailabilityWindows").click(addModifyAvailabilityWindows);
        
                $("#uploadVideoFile").click(function () {
                        boxservice.episode.editpage.checkS3WithmaterialId(episode, boxservice.episode.editpage.videoFileName,boxservice.api.boxvideo.searchFiles,function(fileNamebase){
                                        $("#filennameForUpload").val(fileNamebase + ".mp4");
                                                boxservice.episode.editpage.processFileNameDialog(episode,boxservice.api.boxvideo.searchFiles, function(uploadFilename){
                                                    var videoURL=boxservice.appinfo.appconfig.s3videoURL+"/"+uploadFilename;
                                                    console.log("**going to upload to:"+videoURL);
                                                    var uploadRequest={
                                                            file:uploadFilename,
                                                            bucket:boxservice.appinfo.appconfig.videoBucket                                                            
                                                    };                                                    
                                                    boxservice.api.upload(uploadRequest).done(function (data) {
                                                        if (data) {
                                                            boxservice.episode.editpage.showS3UploadUploadDialog(episode,data,deferred);                                                            
                                                        }
                                                    });
                                                    
                                                        
                                                });                                        
                                        
                        });
                });
                $("#uploadImageFile").click(function (fileNamebase) {
                        var filenameConstructor=function(episode){
                                return episode.materialId.replace(/\//g, "_").replace(/ /g, "-");
                        };
                        
                        boxservice.episode.editpage.checkS3WithmaterialId(episode, filenameConstructor,boxservice.api.masterimage.listFiles,function(fileNamebase){                                                                     
                                        $("#filennameForUpload").val(fileNamebase + ".png");
                                        
                                                boxservice.episode.editpage.processFileNameDialog(episode,boxservice.api.masterimage.listFiles, function(uploadFilename){
                                                    var uploadRequest={
                                                            file:boxservice.appinfo.appconfig.imageMasterFolder+"/"+uploadFilename,
                                                            bucket:boxservice.appinfo.appconfig.imageBucket                                                            
                                                    }; 
                                                    boxservice.api.upload(uploadRequest).done(function (data) {                                                    
                                                        if (data) {
                                                            boxservice.episode.editpage.showS3UploadUploadDialog(episode,data,deferred);                                                            
                                                        }
                                                    });
                                                });                                                                                                             
                        });
                });
                                
                $("#importImageFromBC").click(function () {
                        var filenameConstructor=function(episode){
                                return episode.materialId.replace(/\//g, "_").replace(/ /g, "-");
                        };
                        
                        boxservice.episode.editpage.checkS3WithmaterialId(episode, filenameConstructor, boxservice.api.masterimage.listFiles,function(fileNamebase){
                                $("#filennameForUpload").val(fileNamebase + ".jpg");
                                $("#uploadFileNameDialog .confirm").unbind("click").click(function (uploadFilename) {
                                        boxservice.episode.editpage.processFileNameDialog(episode,boxservice.api.masterimage.listFiles, function(uploadFilename){
                                                
                                                var command={
                                                                 command:"import-brightcove-image",
                                                                 episodeid:episode.id,
                                                                 filename:uploadFilename
                                                 };
                                                 boxservice.util.startWait();
                                                 boxservice.api.command(command).done(function(){
                                                         boxservice.util.finishWait();
                                                         boxservice.episode.edit(episode.id,deferred);                                                   
                                                 }).fail(boxservice.util.onError);
                                                
                                                
                                        });
                                });
                                boxservice.util.resetInput();                                   
                                $("#uploadFileNameDialog").openModal();
                                
                        });
                });
                
                
                
                $("#viewImage").click(function(){
                        boxservice.images.show(episode.imageURL,function(){
                                boxservice.episode.edit(episode.id,deferred);                           
                        });
                        return false;
                });
                $("#deleteMasterImage").click(function(){                                          
                      $("#confirmDeleteImageDialog .confirm").off("click").on("click", function(){                                                    
                                  boxservice.api.masterimage.deleteEpisodeImage(episode.id,episode.imageURL).done(function(){
                                          boxservice.episode.edit(episode.id,deferred);                                                           
                                  });
                                  return false;
                          });
                    $("#confirmDeleteImageDialog .filennameToDelete").val(episode.imageURL);
                        $("#confirmDeleteImageDialog").openModal();                                             
                        return false;
                });
                
                $("#deleteSourceVideo").click(function(){                                          
                    var videofilename=episode.ingestSource;
                    var ib=videofilename.lastIndexOf("/");
                    if(ib!=-1){
                        videofilename=videofilename.substring(ib+1);
                    }
                    $("#confirmDeleteVideoDialog .confirm").off("click").on("click", function(){                                                    
                        boxservice.api.boxvideo.deleteEpisodeVideoFile(episode.id,videofilename).done(function(){
                                        boxservice.episode.edit(episode.id,deferred);                                                 
                                });
                                return false;
                        });
                    
                    if(videofilename.length>0){
                        $("#confirmDeleteVideoDialog .filennameToDelete").val(videofilename);
                        $("#confirmDeleteVideoDialog").openModal();    
                    }  
                                             
                      return false;
              });
              
                
                $("#saveEpisode").click(function () {                   
                        boxservice.episode.editpage.doneEditing();
                        if (boxservice.util.form.valueHasChanged(episode, boxservice.episode.editFields)) {
                                boxservice.util.startWait();
                                boxservice.util.form.update(episode, boxservice.episode.editFields);
                                if(episode.supplier && episode.supplier.toLowerCase()=="box tv network"){
                                          episode.ingestProfile="box-plus-network-DRM-profile";
                                }
                                var episodedatapromise = boxservice.api.episode.update(episode.id, episode);
                                episodedatapromise.done(function () {
                                        boxservice.util.finishWait();
                                        boxservice.episode.edit(episode.id,deferred);
                                }).fail(function (err) {
                                        boxservice.util.openDialog("Failed" + JSON.stringify(err));
                                        boxservice.util.finishWait();
                                });
                        }
                        else {

                                boxservice.episode.edit(episode.id,deferred);
                        }
                });
                
                
                

        /*
                var iconText = "<i class=\"material-icons\">help_outline</i>";
                $(".help").prepend(iconText);
                */
                boxservice.util.tooltip();  
                boxservice.episode.editpage.markMissingFields(episode);
        };
        
        boxservice.episode.editpage.markMissingFields=function(episode){
            var missingFields=boxservice.episode.getMissingFields(episode);            
            if(!missingFields){
                return;                    
            }            
            for(var i=0;i<missingFields.length;i++){
                var missingField=missingFields[i];                
                var inutSelection=null;
                for(var k=0;k<boxservice.episode.editFields.length;k++){
                    var inp=boxservice.episode.editFields[k];
                    if(inp.data.value[0]==missingField){
                        inutSelection=inp.input.selection;
                        break;
                    }
                }
                console.log(missingField+" ---> "+inutSelection);
                $(inutSelection).parent().addClass("requiredFieldMissing");
            }
        };
        boxservice.episode.editpage.intPlayVideo = function (episode) {
                $("#playSourceVideo").click(function () {
                        $("#playVideoDialog").openModal({
                                dismissible: true,
                                complete: function () {
                                        $("#playVideoDialog video")[0].pause();
                                        $('#playVideoDialog').closeModal();
                                }
                        });
                        boxservice.api.boxvideo.presginedurl(episode.ingestSource).done(function (data) {
                                if (data && data.file) {
                                        $("#playVideoDialog video source").attr("src", data.file);
                                        $("#playVideoDialog video")[0].load();
                                        $("#playVideoDialog video")[0].play();
                                }
                        });

                });

        };


        boxservice.episode.editpage.initTagDialog = function (episode) {
                $("#confirmCreateNewTag").click(function () {
                        var newvalue = $("#newtags").val();
                        var tags = newvalue.split(",");
                        for (var i = 0; i < tags.length; i++) {
                                tags[i]=tags[i].toLowerCase();
                                boxservice.util.form.addOption(tags[i], tags[i], "#episodeTags");
                        }

                        $('select').material_select();                  
                        boxservice.episode.editpage.markEditing();
                        boxservice.episode.checkStatus();
                });
        };

        

        boxservice.episode.editpage.checkS3WithmaterialId = function (episode,filenameConstructor,s3caller,callback) {
                
                if (boxservice.episode.editpage.isEditing()) {
                        boxservice.util.openDialog("Please save it first: click on the 'save' button");
                        return;
                }

                if (!episode.materialId) {
                        boxservice.util.openDialog("You have to provide the materialid in order to uniquely name the image");
                        return;
                }
                var mediafileName = filenameConstructor(episode);
                console.log("checking the exitence of the image:" + mediafileName);
                boxservice.util.startWait();
                s3caller(mediafileName).done(function (mediafiles) {
                        boxservice.util.finishWait();
                        if (mediafiles.files.length) {
                                boxservice.util.openDialog("Matching image is already exist in the bucket:" + JSON.stringify(mediafiles.files[0].file) +" You need to either delete the file from the s3 if you do not want it or you can change the material id to different value and save it");
                        }
                        else {
                                 callback(mediafileName);                               
                        }

                }).fail(boxservice.util.onError);
        };
                
        
        boxservice.episode.editpage.processFileNameDialog = function (episode,s3caller,callback) {
                var uploadFilename = $("#filennameForUpload").val();
                if (!uploadFilename) {
                        boxservice.util.openDialog("You have to provide a valid file name");
                        return;
                }
                var ib = uploadFilename.lastIndexOf(".");
                if (ib <= 0) {
                        boxservice.util.openDialog("Invalid  file name, has to have a valid extension");
                        return;
                }

                var basefileName = uploadFilename.substring(0, ib);
                var ext = uploadFilename.substring(ib + 1);
                var regx = /^[A-Za-z0-9_\-]+$/;
                if (!regx.test(basefileName)) {
                        boxservice.util.openDialog("Only alpha numeric character is allowed in the filename");
                        return;
                }
                if (basefileName.length <= 3) {
                        boxservice.util.openDialog("file name is too short");
                        return;
                }
                if (ext.length == 0) {
                        boxservice.util.openDialog("file name has to have extension");
                        return;
                }
                
                        s3caller(basefileName).done(function (mediadata) {
                                
                                if (mediadata.files.length) {
                                        boxservice.util.openDialog("There is already a matching file in s3:" + imageData.files[0].file);
                                }
                                else {
                                        callback(uploadFilename);                                       
                                }
                        }).fail(boxservice.util.onError);

        };
        
        

        boxservice.episode.editpage.videoFileName = function (episode) {
                var videofileName = episode.materialId.replace(/\//g, "_").replace(/ /g, "-");
                return "V_" + videofileName;
        };
        
        boxservice.episode.editpage.showDragAndDropUploadDialog=function(episode, uploadapiurl,uploadFilename,deferred){
                $("#uploadFileNameDialog").closeModal();
                $("#fileUploaderDialog").openModal({
                        dismissible: true,
                        complete: function () {                                
                            boxservice.episode.edit(episode.id,deferred);                                
                        }
                        
                });

                $("#fileUploaderDialog .fileuploader").uploadFile({
                        url: uploadapiurl,
                        fileName: uploadFilename                        
                });

        };
        boxservice.episode.editpage.showS3UploadUploadDialog=function(metadata, data,deferred){
            $("#uploadFileNameDialog").closeModal();
            $("#fileUploaderDialog").openModal({
                    dismissible: true,
                    complete: function () {
                           if(metadata && metadata.series){
                               boxservice.episode.edit(metadata.id,deferred); 
                           }
                           else if(metadata){
                               boxservice.series.edit(metadata.id,deferred); 
                           }
                                
                                                      
                    }
                     
            });             
            var formData={};
            if(data.file){
                formData["key"]=data.file;                
            }
            if(data.acl){
                formData["acl"]=data.acl;                
            }
            if(data.successActionStatus){
                formData["success_action_status"]=data.successActionStatus;                
            }
            if(data.policy){
                formData["policy"]=data.policy;                
            }
            if(data.xamzAlgorithm){
                formData["x-amz-algorithm"]=data.xamzAlgorithm;                
            }            
            if(data.xamzCredential){
                formData["x-amz-credential"]=data.xamzCredential;                
            }
            if(data.xamzDate){
                formData["x-amz-date"]=data.xamzDate;                
            }
            if(data.xamzSignature){
                formData["x-amz-signature"]=data.xamzSignature;                
            }
            console.log("formData:"+JSON.stringify(formData));
            
            console.log("endpoint:"+data.baseURL);
            $("#fileupload").attr("data-url",data.baseURL);            
            $("#fileupload").fileupload({                    
                    formData:formData,
                    paramName:"file",
                    url:data.baseURL,
                    dataType:"video/mp4",
                    acceptFileTypes:"/.*/i;",
                    progressall: function (e, data) {
                        var progress = parseInt(data.loaded / data.total * 100, 10);
                        $('.progress .bar').css(
                            'width',
                            progress + '%'
                        );
                        if(data.loaded>=data.total){
                            setTimeout(function(){
                                $("#fileUploaderDialog").closeModal();
                                if(metadata.series){
                                    boxservice.episode.edit(metadata.id,deferred);
                                }
                                else{
                                    boxservice.series.edit(metadata.id,deferred);
                                }
                            }, 5000);
                            
                        }
                        
                    },
                    done: function (e, data) {
                        console.log("**** completed download.....");
                        $("#fileUploaderDialog").closeModal();
                    }
                    
            });

      };

        
});