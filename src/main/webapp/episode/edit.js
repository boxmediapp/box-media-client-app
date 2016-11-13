jQuery(document).ready(function ($) {
        if (!boxservice.episode) {
                boxservice.episode = {};
        }
        boxservice.episode.editpage = {};
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
} ;   
        
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
                        boxservice.api.episode.remove(episode).done(function () {
                                boxservice.episode.reload();
                        }).fail(boxservice.util.onError);
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
                        boxservice.episode.editpage.checkS3WithmaterialId(episode, boxservice.episode.editpage.videoFileName,boxservice.api.boxvideo.listFiles,function(fileNamebase){                                                          
                                                                                                        
                                        $("#filennameForUpload").val(fileNamebase + ".mp4");
                                        $("#uploadFileNameDialog .confirm").unbind("click").click(function (uploadFilename) {
                                                boxservice.episode.editpage.processFileNameDialog(episode,boxservice.api.boxvideo.listFiles, function(uploadFilename){
                                                    
                                                        boxservice.episode.editpage.showDragAndDropUploadDialog(episode, boxservice.api.boxvideo.uploadfileurl(),uploadFilename,deferred);
                                                    
                                                        
                                                });
                                        });
                                        boxservice.util.resetInput();
                                        $("#uploadFileNameDialog").openModal();
                                        
                                        
                                        
                                        
                                        
                        });
                });
                $("#uploadImageFile").click(function (fileNamebase) {
                        var filenameConstructor=function(episode){
                                return episode.materialId.replace(/\//g, "_").replace(/ /g, "-");
                        };
                        
                        boxservice.episode.editpage.checkS3WithmaterialId(episode, filenameConstructor,boxservice.api.masterimage.listFiles,function(fileNamebase){                                                                     
                                        $("#filennameForUpload").val(fileNamebase + ".png");
                                        $("#uploadFileNameDialog .confirm").unbind("click").click(function (uploadFilename) {
                                                boxservice.episode.editpage.processFileNameDialog(episode,boxservice.api.masterimage.listFiles, function(uploadFilename){
                                                        boxservice.episode.editpage.showDragAndDropUploadDialog(episode, boxservice.api.masterimage.uploadfileurl(),uploadFilename,deferred);                                                           
                                                });
                                        });
                                        boxservice.util.resetInput();                                   
                                        $("#uploadFileNameDialog").openModal();
                                        
                                        
                        });
                });
                $("#uploadFileNameDialog .cancel").click(function () {

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
                $("#fileupload").attr("data-url",uploadapiurl);
                
                $("#fileupload").fileupload({                        
                       progressall: function (e, data) {
                            var progress = parseInt(data.loaded / data.total * 100, 10);
                            $('.progress .bar').css(
                                'width',
                                progress + '%'
                            );
                        }
                        
                });

        };
        boxservice.episode.editpage.showS3UploadDialog=function(episode, uploadapiurl,uploadFilename,deferred){
            $("#uploadFileNameDialog").closeModal();
            

            $("#fileUploaderDialog .fileuploader").uploadFile({
                    url: uploadapiurl,
                    fileName: uploadFilename
            });

    };

        
});