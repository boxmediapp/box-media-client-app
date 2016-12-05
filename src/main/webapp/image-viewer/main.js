jQuery(document).ready(function ($) {
	
	
	boxservice.images = {};
	boxservice.images.availableSizes=[{width:"288",height:"162"},
	                                  {width:"256",height:"144"},
	                                  {width:"320",height:"180"},
	                                  {width:"400",height:"225"},
	                                  {width:"432",height:"243"},
	                                  {width:"512",height:"288"},
	                                  {width:"640",height:"360"},
	                                  {width:"786",height:"406"},
	                                  {width:"824",height:"426"},
	                                  {width:"1089",height:"563"},
	                                  {width:"1160",height:"508"},
	                                  {width:"1280",height:"720"},
	                                  {width:"1920",height:"1080"}
	                                  ];
	
	boxservice.images.getImageUrl=function(image){
		var ib=image.name.indexOf(".");
		var basefileName = image.name.substring(0, ib);
   		var ext = image.name.substring(ib + 1);
 		var imagetemplate=boxservice.appinfo.appconfig.imagetemplateurl;	 		
		var imageurl=imagetemplate.replace("{image_name}", basefileName);
		imageurl=imageurl.replace("{width}",image.width);
		imageurl=imageurl.replace("{height}",image.height);
		imageurl=imageurl.replace("{ext}",ext);
		return imageurl;
        };
        boxservice.images.getS3ImageUrl=function(cdnURL){
            var ib=cdnURL.indexOf("//");
            if(ib<=0){
                return cdnURL;
            }
            ib+=2;            
            var ie=cdnURL.indexOf("/",ib);
            if(ie<=(ib+1)){
                return cdnURL;
            }
            return boxservice.appinfo.appconfig.s3imagesURL+cdnURL.substring(ie);            
      };
	
	
	boxservice.images.getAllAvailableImages=function(imagename){
		var images=[];
		for(var i=0;i<boxservice.images.availableSizes.length;i++){
			var image={
					name:imagename,
					width:boxservice.images.availableSizes[i].width,
					height:boxservice.images.availableSizes[i].height
						};
			image.cdnurl=boxservice.images.getImageUrl(image);
			image.s3url=boxservice.images.getS3ImageUrl(image.cdnurl);
			images.push(image);			
		}
		return images;
		
	};
	boxservice.images.show=function(imagename,goback){		
		
		boxservice.util.page.load("image-viewer/view.html").done(function(htmlContent){			
				$("#content").html(htmlContent);			
				var images=boxservice.images.getAllAvailableImages(imagename);			
				$("masterImageName").text(imagename);
				$("#back").click(function(){
						goback();					
				});
				boxservice.util.pageForEachRecord("image-viewer/image-record.html",images,"#imagelist").done(function(){
			
				
			}).fail(boxservice.util.onError);
			
			
		}).fail(boxservice.util.onError);
	};
	
	
	
});