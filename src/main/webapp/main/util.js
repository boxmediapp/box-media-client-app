jQuery(document).ready(function ($) {	
	boxservice.util={};	
	boxservice.util.table={};
	boxservice.util.form={};
	boxservice.util.view={};
	boxservice.util.page={};
	boxservice.util.menu={};
	boxservice.util.notify={};
	boxservice.util.episode={};
	
	
	boxservice.util.startWait=function(){
		$("#loaderPage").show();
		$("#loaderPage").css("opacity", "0");
		$("#loaderPage").animate({
			opacity: "0.7"
		}, 200);
	};
	boxservice.util.finishWait=function(){
		$("#loaderPage").animate({
			opacity: "0"
		}, 200, function(){
			$("#loaderPage").hide();
		});		
	};
	boxservice.util.onError=function(err){
		$("#loaderPage").hide();
		boxservice.util.openDialog(" error with "+JSON.stringify(err));
	};
	
	
	/* convert the datatime to string */
	boxservice.util.datetimeToString=function(value){
		if(!value){
			return "";
		}
		var d=new Date(value);
		return d.getDate()+"/"+(d.getMonth()+1)+"/"+d.getFullYear()+" "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
    };
    boxservice.util.dateToString=function(value){
		if(!value){
			return "";
		}
		var dateobj=new Date(value);
		
		var fullYear=dateobj.getFullYear();
	    var month=""+(dateobj.getMonth()+1);
	    var datevalue=""+dateobj.getDate();
	    
		if(month.length<2){
			month="0"+month;			
		}
		if(datevalue.length<2){
			datevalue="0"+datevalue;			
		}
		return fullYear+"-"+month+"-"+datevalue;
    };
    
    boxservice.util.timestampToUTCString=function(value){
		if(!value){
			return "";
		}
		var dateobj=new Date(value);
		
		var fullYear=dateobj.getFullYear();
	    var month=""+(dateobj.getMonth()+1);
	    var datevalue=""+dateobj.getDate();
	    
		if(month.length<2){
			month="0"+month;			
		}
		if(datevalue.length<2){
			datevalue="0"+datevalue;			
		}
		var hours = ("0"+dateobj.getHours()).slice(-2);
	    var minutes = ("0"+dateobj.getMinutes()).slice(-2);
		var seconds = ("0"+dateobj.getSeconds()).slice(-2);
		   
		   
		return fullYear+"-"+month+"-"+datevalue+"T"+hours+":"+minutes+":"+seconds;
    };
    /* convert the string to datetime */
    boxservice.util.stringToDateTime=function(value){		
		if(value=="" || value==null){
			return null;
		}
    	var dateandtimeparts=value.split(" ");
		
		var dateparts=null;
		var timeparts=null;
		var dateType=null;
		if(dateandtimeparts[0].indexOf("/")!=-1){
			dateparts=dateandtimeparts[0].split("/");
			dateType="uk";
		}
		else if(dateandtimeparts[0].indexOf("-")!=-1){
			dateparts=dateandtimeparts[0].split("-");
			dateType="us";
		}
		else{
			return (new Date(value)).getTime();
		}
		if(dateandtimeparts.length>1){
			timeparts=dateandtimeparts[1].split(":");			
		}
		var d=new Date();
		if(dateType=="uk"){
			d.setDate(dateparts[0]);
			d.setMonth(dateparts[1]-1);
			d.setFullYear(dateparts[2]);
		}
		else if(dateType=="us"){
			d.setFullYear(dateparts[0]);
			d.setMonth(dateparts[1]-1);
			d.setDate(dateparts[2]);
		}
		if(timeparts!=null){
			d.setHours(timeparts[0]);
			d.setMinutes(timeparts[1]);
			d.setSeconds(timeparts[2]);
		}
		return d;
   };
   boxservice.util.stringToDate=function(value){		
		if(value=="" || value==null){
			return null;
		}
		var dateandparts=value.split("-");		
		var d=new Date();
		d.setFullYear(dateandparts[0]);
		d.setMonth(dateandparts[1]-1);
		d.setDate(dateandparts[2]);		
		return d.getTime();
  };
   boxservice.util.timestampToInputs=function(timstamp,dateTarget,timeTarget){
	   if(!timstamp){
		   dateTarget.val(null);
		   timeTarget.val(null);
	   }	   
	   var now = new Date(timstamp);
	   var day = ("0" + now.getDate()).slice(-2);
	   var month = ("0" + (now.getMonth() + 1)).slice(-2);
	   
	   
	   var hours = ("0"+now.getHours()).slice(-2);
	   var minutes = ("0"+now.getMinutes()).slice(-2);
	   var seconds = ("0"+now.getSeconds()).slice(-2);
	   
	   
	   var datepart = now.getFullYear()+"-"+(month)+"-"+(day) ;
	   var timepart=hours+":"+minutes+":"+seconds;	   
	   dateTarget.val(datepart);	   
	   timeTarget.val(timepart);	   
   };
   
   boxservice.util.getValueWithAttribute=function(dataitem,attributeName){                             
       if(attributeName.indexOf(".")==-1){
               return dataitem[attributeName];
       }               
       var path=attributeName.split(".");
       
       for(var k=0;k<path.length;k++){
               if(dataitem==null){
                  return null; 
               }                       
               dataitem=dataitem[path[k]];                           
       }
       return dataitem;           
  };
    
	/*Get the value in the dataitem specified in the path */
	boxservice.util.getValueAtPath=function(dataitem,path){		
		var value=dataitem;
		if(typeof path === 'string'){
			return path;
		}		
		for(var k=0;k<path.length;k++){
			if(value==null){
			   return null;	
			}			
			value=value[path[k]];    			
		}
		return value;		
	};
	/*Get the value in the dataitem specified in the path */
	boxservice.util.setValueAtPath=function(dataitem,path, inputvalue){
		if(inputvalue==""){
			inputvalue=null;
		}
		var obj=dataitem;				
		for(var k=0;k<(path.length-1);k++){		
			if(obj[path[k]] ==undefined){
				obj={};
			}
			else{
				obj=obj[path[k]];
			}
		}
		
		obj[path[path.length-1]]=inputvalue;		
	};
    
    /*Get the value in the dataitem specified in the config */
	boxservice.util.getValueWithConfig=function(dataitem, configitem){
		var value=boxservice.util.getValueAtPath(dataitem,configitem["value"]);
		if(configitem["type"]=="datetime"){
			return boxservice.util.datetimeToString(value);    			
		}
		else if(configitem["type"]=="date"){
			
			return boxservice.util.dateToString(value);
		}
		
		else if(configitem["type"]=="datetime-local"){		
			console.log("******get datetime local:"+value);
			return boxservice.util.timestampToUTCString(value);
		}
		
		else if(configitem["type"]=="boolean"){
			if(configitem["enum"]){
				if(value){
					return configitem["enum"]["true"];
				}
				else{
					return configitem["enum"]["false"];
				}
			} 
			else{
				if(value){
					if(value=="false" || value =="FALSE" || value=="False"){
						return "false";
					}
					else{
							return "true";
					}
				}
				else{
					 return "false";
				}
			}
		} 
		else{
			return value;
		}
	};
	/*Get the value in the dataitem specified in the config */
	boxservice.util.setValueWithConfig=function(dataitem, configitem, inputvalue){		
		if(inputvalue && configitem["type"]=="datetime"){
			inputvalue= boxservice.util.stringToDateTime(inputvalue);   			
		}
		
		else if(inputvalue && configitem["type"]=="date"){
			inputvalue=boxservice.util.stringToDate(inputvalue);   			
		}
		else if(inputvalue && configitem["type"]=="datetime-local"){
			
			inputvalue=Date.parse(inputvalue)-3600000;
			
			console.log("******update datetime local:"+inputvalue);
		}
		boxservice.util.setValueAtPath(dataitem,configitem.value,inputvalue);
	};
	
	/*Create the table header with config and append to target*/
	boxservice.util.table.head=function(config, target){
    	for(var i=0;i<config.length;i++){	        		
    		var th=$('<th/>');
    		th.html(config[i].title);
    		target.append(th);        			
    	}			
   };
   
	
	/*Build a table cel from the config and datarow and append to target */
	
	boxservice.util.table.cell=function(datarow, config,target){
    	  var element=$('<'+config["tag"]+"/>");
    	  if(config["attr"]){
    		  element.attr(config["attr"]["name"],boxservice.util.getValueWithConfig(datarow,config["attr"]))
    	  }
    	  
    	  if(config["class"]){
    		  element.addClass(config["class"])
    	  }
    	  if(config["body"]){
    		  element.html(boxservice.util.getValueWithConfig(datarow, config["body"]))
    	  }    	  
    	  if(config["element"]){
    		  boxservice.util.table.cell(datarow,config["element"],element);    		  
    	  }
    	  target.append(element);
    };
   
	/* Builds a row of the table from the datarow and config and append to target */
    boxservice.util.table.row=function(datarow, config,target){			
		for(var i=0;i<config.length;i++){
			boxservice.util.table.cell(datarow,config[i],target)
    	}			
	};

	/*Builds a table from the dataitems with config and append to target */
	boxservice.util.table.show=function(dataitems, config, target){		  
		  var table=$('<table class="datatable highlight responsive-table"/>');
		  
		  var thead=$('<thead/>');			  
		  boxservice.util.table.head(config,thead);
		  table.append(thead);
		  var tbody=$('<tbody/>');
		  
		  
		  for(var i=0;i<dataitems.length;i++){
				  var tr=$('<tr/>');
				  boxservice.util.table.row(dataitems[i],config,tr)
				  tbody.append(tr);
		  }		
		  table.append(tbody);		  				  
		  $(target).append(table);
  };
  boxservice.util.selectable=function(dataitems,config, target){		  	  	  
	  for(var i=0;i<dataitems.length;i++){
		      var value=boxservice.util.getValueWithConfig(dataitems[i], config);
			  var pelement=$('<p/>');
			  var input=$("<input/>",{"name":"files", "type":"radio", "id":value, "class": "with-gap"});
			  var label=$("<label/>",{"for":value});
			  label.text(value);
			  pelement.append(input);
			  pelement.append(label);
			  $(target).append(pelement);
	  }			  		  				  	  
};
  
boxservice.util.isArrayDifferent=function(array1, array2){
	   if(array1.length!=array2.length){
		   return true;
	   }
	   var isDifferent=false;
	   for(var i=0;i<array1.length;i++){
		   if(boxservice.util.valueHaschanged(array1[i],array2[i],null)){
			   isDifferent=true;
		   }
	   }
	   if(!isDifferent)
		   return false;
	   if(array1.length<=1){
		   return true;
	   }
	   for(var i=0;i<array1.length;i++){
		   var a=array1[i];
		   var found=false;
		   for(var k=0;k<array2.length;k++){
			   if(!boxservice.util.valueHaschanged(a,array2[k],null)){
				   found=true;
				   array2.splice(k,1);
				   break;
			   }
		   }
		   if(!found){
			   return true;
		   }
		   
	   }
	   return false;
	   
	
};
/* orgValye and input value are different */	
  boxservice.util.valueHaschanged=function(orgvalue, inputvalue,datatype){
	  if(orgvalue ==undefined || orgvalue =="" || orgvalue==null){
		  if(inputvalue ==undefined || inputvalue =="" || inputvalue==null){
			  return false;
		  }
		  else{
			  return true;
		  }
	  }
	  else if(inputvalue ==undefined || inputvalue =="" || inputvalue==null){
		  if(orgvalue ==undefined || orgvalue =="" || orgvalue==null){
			  return false;
		  }
		  else{
			  return true;
		  }
	  }
	  
	  if(orgvalue==inputvalue){
		  return false;
	  }
	  if(!orgvalue){
		    if((!inputvalue)||inputvalue.length==0) {
		    	return false;
		    }		    		    
		    else
		    	return true;		    
	   }
	  else if((!inputvalue)||inputvalue.length==0) {		    
		    return true;
	   }
	   else if("array"==datatype){
		   return boxservice.util.isArrayDifferent(orgvalue,inputvalue);		   
	   }
	   else if(orgvalue && inputvalue && orgvalue.constructor== Array && inputvalue.constructor ==Array){
		   if(inputvalue.length!=orgvalue.length){
			   return true;
		   }
		   else{			   
			   for(var i=0;i<inputvalue.length;i++){
				   if(orgvalue.indexOf(inputvalue[i])==-1){
				       return true;
				   }			           
			   }
			   for(var i=0;i<orgvalue.length;i++){
                               if(inputvalue.indexOf(orgvalue[i])==-1){
                                   return true;
                               }                               
                           }
			   return false;
		   }
	   }
	   else{
		   return orgvalue!=inputvalue;
	   }
	};
	boxservice.util.getInutFieldValue=function(selection, datatype){
		
		if(datatype=="array"){
		/*  var val=[];
		  $(selection +" :selected").each(function(i,selected){
			  val.push($(selected).val());
		  });
			*/
		return $(selection).val();	
		}
		else{
			return $(selection).val();			
		}
	};
   boxservice.util.setInutFieldValue=function(selection, datatype, value){
		
		if(datatype=="array"){
			/*
		  for(var i=0; i<value.length;i++){
			  $(selection+" option[value='"+value[i]+"']").prop("selected",true);
		  }
		  */
			return $(selection).val(value);
		}
		else{
			return $(selection).val(value);			
		}
	};
	
	
 /*compare the input fields and the data to see whether values had been changed or not  */	
  boxservice.util.form.valueHasChanged=function(data,config){		
		
			  for(var i=0;i<config.length;i++){
				  if(!config[i].notEditable){
					  var selection=boxservice.util.form.getInputValueSelection(config[i]);				  
					  var inputvalue=boxservice.util.getInutFieldValue(selection,config[i].data.type);					  				   
					  var orgvalue=boxservice.util.getValueWithConfig(data, config[i].data);
					   
					   if(boxservice.util.valueHaschanged(orgvalue,inputvalue,config[i].data.type)){
						   console.log("******changed****selection:"+selection+" inputvalue=["+inputvalue+"]orgvalue=["+orgvalue+"]");
						   return selection;
					   }
				  }
			  }
			  return false;		   			   
    };
   
    boxservice.util.form.initInputFields=function(data,config){		
		
		  for(var i=0;i<config.length;i++){			  
			   var selection=boxservice.util.form.getInputValueSelection(config[i]);				  			  				   
			   var orgvalue=boxservice.util.getValueWithConfig(data, config[i].data);
			   
			   $(selection).val(orgvalue);			   			   
		  }
		  return false;		   			   
};
    
    
    boxservice.util.form.inputChangedCallback=function(config, callback){			
	  for(var i=0;i<config.length;i++){
		  if(!config[i].notEditable){
			   console.log("setting up lister for:"+config[i].input.selection);
			   var selection=boxservice.util.form.getInputValueSelection(config[i]);		   
			   $(selection).on('input', callback);
			   $(selection).on('change', callback);
		  }
	  }
	  return false;		   			   
   };
       
    boxservice.util.form.getInputValueSelection=function(config){
    	var selection=null;				  		  
		  if(config.input.name){
			  selection=config.input.selection+"[name='"+config.input.name+"']";					  
		  }
		  else{
			  selection=config.input.selection;
		   }
		  return selection;    	
    };

 /*Update the data with the input fields */		   	   
    boxservice.util.form.update=function(data,config){		 			 
		  for(var i=0;i<config.length;i++){
			  if(!config[i].notEditable){
				  var selection=boxservice.util.form.getInputValueSelection(config[i]);
				  var inputvalue=boxservice.util.getInutFieldValue(selection,config[i].data.type);
				  boxservice.util.setValueWithConfig(data, config[i].data, inputvalue);
			  }
		   }
    };			  		   			   

    boxservice.util.form.addOption=function(newOptionValue, newOptionText,targetSelection){
			if(newOptionValue==null||newOptionValue.length==0){
				return;
			}
			newOptionValue=newOptionValue.trim();
			if(newOptionValue.length==0){
				return;
			}	
			var vv=$(targetSelection+ " option[value='"+newOptionValue+"']");
			if(vv.val()){
				console.log("already exist in the options");			
				return;
			}
			$(targetSelection).append($('<option>', { 
		        value: newOptionValue,
		        text : newOptionText 
		    }));
			var selected=$(targetSelection).val();
			if(selected==null){
				selected=newOptionValue;
			}
			else{
				selected.push(newOptionValue);
				$(targetSelection).val(selected);
			}
			
	};
	boxservice.util.form.populateOptions=function(optionsValues,targetSelection){
		if(optionsValues==null||optionsValues.length==0){
			return;
		}
		$(targetSelection).append($('<option>', { 
	        value: null,
	        text : "" 
	    }));
		for(var i=0;i<optionsValues.length;i++){			
			$(targetSelection).append($('<option>', { 
		        value: optionsValues[i],
		        text : optionsValues[i] 
		    }));
		}
    };
    boxservice.util.form.selectOptions=function(optionsValues,targetSelection){				
		$(targetSelection).val(optionsValues);		
    };
	
    
    boxservice.util.menu.resetSort=function(){
    	$(".sort-ascending").removeClass("active");
		$(".sort-descending").removeClass("active");			
		$(".not-sorted").addClass("active");
    };
    
    boxservice.util.menu.configSort=function(opts){
                var sortHeader=opts.headerSection;
		$(sortHeader).unbind("click").click(function(){
						
			if($(sortHeader+ " .not-sorted" ).hasClass("active") || $(sortHeader+ " .sort-descending" ).hasClass("active")){
			    	boxservice.util.menu.resetSort();
			    	$(sortHeader+ " .not-sorted" ).removeClass("active");
			    	$(sortHeader+" .sort-descending").removeClass("active");
			    	$(sortHeader+" .sort-ascending").addClass("active");
			    	opts.ascFunction();			    
			 }
			 else {
			    	boxservice.util.menu.resetSort();
			    	$(sortHeader+ " .not-sorted" ).removeClass("active");
			    	$(sortHeader+" .sort-ascending").removeClass("active");
			    	$(sortHeader+" .sort-descending").addClass("active");
			    	opts.descFunction();
			 }	    				
		});
	};
	boxservice.util.menu.setup=function(opts){
		var selectMenu=function(target){
		        if(opts.whenClicked){
		            opts.whenClicked();
		        }
			var template=$(target).attr("template");
			var call=$(target).attr("call");
			$(target).parent().parent().children().removeClass("active");
			
			$(target).parent().addClass("active");
			try{
				if(template){
						boxservice.util.page.load(template).done(function(htmlContent){							
							if(call){
								eval(call+"(htmlContent)");
							}
						});
				}
				else{
					if(call){					
						eval(call+"()");
					}
				}
			}
			catch(error){
				console.error(error+" while exucuting the menu:linkSelection call=["+call+"] template=["+template+"]");
			}
		};
		
		
		$(opts.linkSelection).click(function(){
			boxservice.checkAppInfo();			
			selectMenu(this);
			$(".button-collapse").sideNav("hide");
		});
		
	};
	
	
	
	
	boxservice.util.replaceVariables=function(template, data, config) {
		  return template.replace(/\$\{([\w\.]*)\}/g, function(str, key) {
		    var keys = key.split(".");
		    var value= boxservice.util.getValueAtPath(data,keys);
		    if(value==null){
		    	return ""
		    }
		    else{
		    	if(config && config.types && config.types[key]=="datetime"){
		    		return boxservice.util.datetimeToString(value);
		    	}
		    	else{
		    		return  value;
		    	}
		    }
		  });
		};
		
		boxservice.util.convertUKDateToISO=function(ukdate){
			if(ukdate==null ||ukdate==""){
				return ukdate;				
			}
			var dpart=ukdate.split("/");
			if(dpart.length!=3){
				throw "date is in wrong format:"+ukdate;				
			}
			return dpart[2]+"-"+dpart[1]+"-"+dpart[0];			
		};
     
      
      boxservice.util.openDialog=function(message){    	 
    	  $("#messageDialog").openModal();
    	  $("#dialogMessage").html(message);
      };
      boxservice.util.closeDialog=function(){    	  
    	  $("#messageDialog").closeModal();    	  
      };
      
      $("#messageDialog button").click(function(){
    	  $("#messageDialog").closeModal();  
	  });
      boxservice.util.page.load=function(page){    	    
      	return $.ajax({
  		    type: "GET",
  		    url: page+"?launchid="+window.boxmediappLaunchId,
  		    dataType: "html"				    
  		   });
      };
      
      boxservice.util.pageForEachRecord=function(templatePage,records, targetSelection,config){
    	  var deferred = $.Deferred();
    	  	if(records && records.length>0){    	  		  
    	  		    boxservice.util.page.load(templatePage).done(function(templatePage){
		    	  		var pageContent="";
		        		  for(var i=0;i<records.length;i++){
		        			  pageContent=pageContent+boxservice.util.replaceVariables(templatePage,records[i],config);		        			  
		        		  }
		        		  $(targetSelection).append(pageContent);
		        		  deferred.resolve("done");
		      	  	   
		    	  	 }).fail(function(err){
		    	  		boxservice.util.onError("failed to load the record template page, check the network connection....:"+templatePage);
		    	  		deferred.fail(err);
		    	  	  }) ;
    	  	}
    	  	return deferred.promise();
    	  	
      };
      
      boxservice.util.resetInput=function(){
    	  if($('select') && $('select').material_select){
    		  $('select').material_select();
    	  }
    	  
          Materialize.updateTextFields();
      };
      
      
      boxservice.util.search=function(search){
    	var deferred = $.Deferred();
  	    $("#searchInput").val(search);  	         
		    $("#searchButton").click(function(){
		    	console.log("Search button is clicked............");
		      search=$("#searchInput").val();	
		  	  deferred.resolve(search);
		    	
		    });
		    $("#searchInput").keypress(function(e){		    	
		    	 var key = e.which;
		    	 if(key == 13)  // the enter key code
		    	  {
		    		 search=$("#searchInput").val();
		    		 deferred.resolve(search);		    		 
		    		 return false;  
		    	  }		    	
		    });
		    return deferred;
       };
       boxservice.util.resetScrollPaging=function(){
           $(window).unbind("scroll");           
       };
       boxservice.util.scrollPaging=function(listitemdata){  
                   var loadMore=function(){
                       if(listitemdata  && listitemdata.loadedall){
                           console.log("scrolll reached end, but ignored because all the items are loaded");
                           $(window).unbind("scroll");
                           $("#showMoreResults").hide();
                       }
                       else{                                         
                         $("#showMoreResults").show();  
                         listitemdata.loadNextPage(); 
                       }
                   };
                   boxservice.util.scrollListItemData=listitemdata;
                   
                   $(window).unbind("scroll").scroll(function(){
                             if(boxservice.util.scrollListItemData!==listitemdata){
                                 console.log("this is not the onwer, ignoringt he scroll");
                                 return;
                             }
            		     if($(window).scrollTop() == ($(document).height() - $(window).height())){			    		 
            		     loadMore();		    		 
    	                   }		          
		     });    
                   
                   $("#showMoreResults").unbind("click").click(function(){
                       loadMore();
                   });
         };
       
       boxservice.util.tooltip=function(){
    	   $(".tooltip .material-icons").click(function(){
   			var tootext=$(this).siblings(".tooltiptext");
   			if(tootext.hasClass("called")){
   				tootext.removeClass("called",3000);
   				tootext.parent().removeClass("called",3000);
   			}
   			else{
   				tootext.addClass("called",3000);
   				tootext.parent().addClass("called",3000);
   			}
   		  });  
       };
       boxservice.util.websafeTitle=function(title){
    	   if(!title){
    		   return title;    		   
    	   }
    	   return title.replace(/[&\/\\#,\ +()$~%.'":*?<>{}]/g,'-');
       };
       
       
       
       
       
       boxservice.util.uploadFileDialog=function(onListS3files,onCloseFileUploader, sendFileURL){
       	
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
   		onListS3files(basefileName+".").done(function (imageData) {
   			boxservice.util.finishWait();
   			if (imageData.files.length) {
   				boxservice.util.openDialog("There is already a matching file in the s3:" + imageData.files[0].file);
   			}
   			else {
   				$("#uploadFileNameDialog").closeModal();
   				$("#fileUploaderDialog").openModal({
   					dismissible: true,
   					complete: function () {
   						onCloseFileUploader();
   					}
   				});

   				$("#fileUploaderDialog .fileuploader").uploadFile({
   					url: sendFileURL,
   					fileName: uploadFilename
   				});
   			}
   		}).fail(boxservice.util.onError);
       	
       };
        
       
       boxservice.util.episode.filterEpisodesById=function(episodes, episodeid){
    	   if(!episodes){
    		   return null;
    	   }
    	   if(!episodes.length){
    		   return null;
    	   }
    	   for(var i=0;i<episodes.length;i++){
    		   if(episodes[i].id==episodeid){
    			   return episodes[i];
    		   }
    	   }
    	   return null;
       };
       boxservice.util.setupDropdownMenu=function(target){
    	   target.click(function(event){
 	    	  var container=$(this).parents(".statusAction");		    	  
 	    	  container.addClass("active");
 	    	  
 	    	  var startTime=(new Date()).getTime();		    	  
 	    	  var menuIsActive=true;		    	  
 	    	  container.on("mousemove", function(){
 	    		  startTime=(new Date()).getTime();
 	    		  menuIsActive=true;
 	    	  });
 	    	  container.on("mouseout", function(){
 	    		  menuIsActive=false;		    		  		    		  
 	    	  });
 	    	  
 	    	  var refreshInterval=setInterval(function(){
 	    		  if(menuIsActive){
 	    			  return;
 	    		  }
 	    		  var currentTime=(new Date()).getTime();
 	    		  if((startTime+700)<currentTime){
 	    			  clearInterval(refreshInterval);
 	    			  container.off("mousemove");
 	    			  container.off("mouseout");
 	    			  container.removeClass("active");		    			  
 	    		  }
 	    		  
 	    	  },100);
 	    	  
 	    	  
 	    	  
 	    	  
 	      });
       };
       
       
       
       
       
       
       
});
