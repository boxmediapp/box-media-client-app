jQuery(document).ready(function ($) {
    boxservice.advertsettings={
            show:function(opts){
                boxservice.util.startWait();
                 var that=this;
                 that.ops=opts;
                  if(!this.htmlContent){
                      
                      boxservice.util.page.load("advert-settings/editor.html").done(function(editorHTML){
                          boxservice.util.page.load("advert-settings/advert-rule-row.html").done(function(advertRuleRowHTML){
                              that.advertRuleRowHTML=advertRuleRowHTML;
                              var addNewAdvertRuleContent=boxservice.util.replaceVariables(that.advertRuleRowHTML,{recordId:"new",submitText:"Add"});
                              that.htmlContent=boxservice.util.replaceVariables(editorHTML,{addNewAdvertRuleContent:addNewAdvertRuleContent});                              
                              that.show(opts);
                          });
                                                   
                      });
                      return;
                  }
                  $("#content").html(this.htmlContent);    
                  $("#sumbit_new").click(function(){                      
                     that.createNewRule(); 
                     return false;                     
                  });
                  $("#delete_new").hide();
                  boxservice.api.advertrules.list().done(function(rules){
                     that.list(rules);
                  }).fail(boxservice.util.onError);
                  
            },
            createNewRule:function(){
                boxservice.util.startWait();
                var newrule=this.getInputRule("new");
                var that=this;
                boxservice.api.advertrules.add(newrule).done(function(){
                    that.show(that.opts);
                }).fail(boxservice.util.onError);                
            },
            getInputRule:function(id){
                var rule={
                        advertBreakType:$("#advertBreakType_"+id).val(),
                        numberOfAdsPerBreak:$("#numberOfAdsPerBreak_"+id).val(),
                        advertLength:$("#advertLength_"+id).val(),
                        contentType:$("#contentType_"+id).val(),
                        contentMinimumDuration:$("#contentMinimumDuration_"+id).val(),
                        contentMaximumDuration:$("#contentMaximumDuration_"+id).val()                        
                }
                return rule;                
            },
            list:function(rules){   
                
                if(rules && rules.length){                    
                    for(var i=0;i<rules.length;i++){
                       this.showItem(rules[i]);
                    }
                 }                  
                boxservice.util.resetInput();
                boxservice.util.finishWait();
            },
            updateInputWithRuleItem:function(rule, attrName){
                if(rule[attrName]){
                    $("#"+attrName+"_"+rule.id).val(rule[attrName]);
                }
            },
            updateInputWithRule(rule){
                this.updateInputWithRuleItem(rule,"advertBreakType");
                this.updateInputWithRuleItem(rule,"numberOfAdsPerBreak");
                this.updateInputWithRuleItem(rule,"contentType");
                this.updateInputWithRuleItem(rule,"contentMinimumDuration");
                this.updateInputWithRuleItem(rule,"contentMaximumDuration");                
            },
            showItem:function(rule){
                var that=this;
                var advertRuleContent=boxservice.util.replaceVariables(this.advertRuleRowHTML,{recordId:rule.id,submitText:"Update"});
                $("#rulelist").append(advertRuleContent);
                this.updateInputWithRule(rule);
                $("#sumbit_"+rule.id).click(function(){                      
                    that.updateRule(rule);                    
                    return false;                     
                 });
                $("#delete_"+rule.id).click(function(){                      
                    that.deleteRule(rule);                    
                    return false;                     
                 });
            },
            deleteRule:function(rule){
                boxservice.util.startWait();
                var that=this;                
                boxservice.api.advertrules.remove(rule).done(function(){
                    that.show(that.opts);
                }).fail(boxservice.util.onError);
            },
            updateRule:function(rule){
                boxservice.util.startWait();
                var that=this;
                var updatedRule=this.getInputRule(rule.id);
                updatedRule.id=rule.id;
                boxservice.api.advertrules.update(updatedRule).done(function(){
                    that.show(that.opts);
                }).fail(boxservice.util.onError);
            }
            
    };        
});
