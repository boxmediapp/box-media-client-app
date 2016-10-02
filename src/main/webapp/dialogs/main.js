jQuery(document).ready(function ($) {	
	if(!boxservice.dialogs){
		boxservice.dialogs={};
	}
	boxservice.dialogs.setupDeleteMediaEntryDialog=function(triggerButton, onConfirm){
		
		var bindEvents=function(){
			triggerButton.click(function(){
				$("#deleteMediaEntryDialog").openModal();
				return false;
			});
			$("#deleteMediaEntryDialog .cancel").click(function(){
	  			$("#deleteMediaEntryDialog").closeModal();
	  			return false;
	  		});
			$("#deleteMediaEntryDialog .confirm").unbind("click").click(function(){
				onConfirm();
				return false;
			});
		};
		boxservice.util.page.load("dialogs/dele-media-entry-confirm.html").done(function(htmlContent){
			$("#content").append(htmlContent);			
			bindEvents();			
		}).fail(boxservice.util.onError);		
	};
	
	
	
	boxservice.dialogs.setupSwitchToNewSeriesDialog=function(triggerButton, onConfirm){
		
		var bindEvents=function(){
			triggerButton.click(function(){
				$("#switchToNewSeriesDialog").openModal();
				return false;
			});
			$("#switchToNewSeriesDialog .cancel").click(function(){
	  			$("#switchToNewSeriesDialog").closeModal();
	  			return false;
	  		});
			$("#switchToNewSeriesDialog .confirm").unbind("click").click(function(){
				onConfirm();
				return false;
			});
		};
		boxservice.util.page.load("dialogs/switch-to-new-series.html").done(function(htmlContent){
			$("#content").append(htmlContent);			
			bindEvents();			
		}).fail(boxservice.util.onError);
		
	};
	
	
	
boxservice.dialogs.setupSwitchToNewSeriesGroupDialog=function(triggerButton, onConfirm){
		
		var bindEvents=function(){
			triggerButton.click(function(){
				$("#switchToNewSeriesGroupDialog").openModal();
				return false;
			});
			$("#switchToNewSeriesGroupDialog .cancel").click(function(){
	  			$("#switchToNewSeriesGroupDialog").closeModal();
	  			return false;
	  		});
			$("#switchToNewSeriesGroupDialog .confirm").unbind("click").click(function(){
				onConfirm();
				return false;
			});
		};
		boxservice.util.page.load("dialogs/switch-to-new-series-group.html").done(function(htmlContent){
			$("#content").append(htmlContent);			
			bindEvents();			
		}).fail(boxservice.util.onError);
		
	};
	
	
});