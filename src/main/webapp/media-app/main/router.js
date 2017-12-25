var boxservice=boxservice || {};
boxservice.router={
  getAllResources:function(){
        return [this.episode,this.series,this.seriesgroup,this.s3,this.schedules,this.playlists,
        this.importSchedules,this.admin,this.help,this.editEpisode,  this.editProgramme,this.editCollection,this.signout];
  },
  getAllMenuComponents:function(){
      return [this.episode,this.series,this.seriesgroup,this.s3,this.schedules,this.playlists,
      this.importSchedules,this.admin,this.help,this.signout];
  },
  selectMenuItem:function(menuComponent){
        if(menuComponent.menuItem){

            $(".button-collapse").sideNav("hide");
            var menuComponents=this.getAllMenuComponents();
            for(var i=0;i<menuComponents.length;i++){
                menuComponents[i].menuItem.removeClass("active");
                menuComponents[i].mobileMenuItem.removeClass("active");
            }
            menuComponent.menuItem.addClass("active");
        }
  },

  getQueryParam:function(variable) {
            if(!window.location){
              return null;
            }
            var query=window.location.search;
            if(!query){
                return null;
            }
              query=query.substring(1);
              var vars = query.split('&');
              for (var i = 0; i < vars.length; i++) {
                  var pair = vars[i].split('=');
                  if (decodeURIComponent(pair[0]) == variable) {
                      return decodeURIComponent(pair[1]);
                  }
              }
    },

  executeOnLoads:function(){
        var resources=this.getAllResources();
        var processed=false;
        for(var i=0;i<resources.length;i++){
            if(resources[i].onLoad()){
                processed=true;
            }
        }
        if(!processed){
              this.episode.onLoad(this.episode.name);
        }
  },
  executeOnBrowse:function(state){
        var resources=this.getAllResources();
        for(var i=0;i<resources.length;i++){
            resources[i].onBrowse(state);
        }
  },
  initResources:function(){
        var resComponents=this.getAllResources();
        for(var i=0;i<resComponents.length;i++){
            this.initResource(resComponents[i]);
        }
  },
  _buildPath:function(){
        return "index.html?resource="+this.name;
  },
  _buildPathFromQueryParameters:function(){
        return this.buildPath();
  },
  _buildState:function(){
      return {
          resource:this.name
      };
  },
  _buildStateFromQueryParameters:function(){
          return this.buildState();
  },
  _pushState:function(state, title, path){
        window.history.pushState(state,title, path);
  },
  _replaceState:function(state, title, path){
        window.history.replaceState(state,title, path);
  },
  _onLoad:function(name){
              if(!name){
                  name=this.getQueryParam("resource");
              }
              if(this.name===name){
                    var path=this.buildPathFromQueryParameters();
                    var state=this.buildStateFromQueryParameters();
                    this.replaceState(state,this.title,path);
                    $(window).unbind("scroll");
                    this.route(state);
                    boxservice.router.selectMenuItem(this);
                    window.scrollTo(0,0);
                    return this;
              }
              else{
                  return null;
              }
  },
  _onBrowse:function(state){
      if(state.resource===this.name){
           $(window).unbind("scroll");
           window.scrollTo(0,0);
            this.route(state);
            boxservice.router.selectMenuItem(this);

            return this;
      }
      else{
        return null;
      }
  },
  _onClicked:function(){
        var state=this.buildState();
        var path=this.buildPath();
        this.pushState(state,this.title,path);
        $(window).unbind("scroll");
        this.route(state);
        this.boxservice.router.selectMenuItem(this);
        window.scrollTo(0,0);
  },
  initResource:function(resComponent){
            resComponent.getQueryParam=this.getQueryParam;
            resComponent.unselectMenuItems=this._unselectMenuItems;
            if(!resComponent.buildPath){
              resComponent.buildPath=this._buildPath;
            }
            if(!resComponent.buildPathFromQueryParameters){
              resComponent.buildPathFromQueryParameters=this._buildPathFromQueryParameters;
            }
            if(!resComponent.buildState){
              resComponent.buildState=this._buildState;
            }
            if(!resComponent.buildStateFromQueryParameters){
              resComponent.buildStateFromQueryParameters=this._buildStateFromQueryParameters;
            }
            if(!resComponent.pushState){
              resComponent.pushState=this._pushState;
            }
            if(!resComponent.replaceState){
              resComponent.replaceState=this._replaceState;
            }
            if(!resComponent.onLoad){
              resComponent.onLoad=this._onLoad;
            }
            if(!resComponent.onBrowse){
              resComponent.onBrowse=this._onBrowse;
            }
            if(!resComponent.onClicked){
              resComponent.onClicked=this._onClicked;
            }
  },

  init:function(){
          this.initResources();
          var that=this;
          window.addEventListener('popstate', function(e) {
                if(!e || !e.state){
                  console.log("no resource is set in popstate");
                  return;
                }
                that.executeOnBrowse(e.state);
          });
     },

      setupTopMenu:function(){
            var menuComponents=this.getAllMenuComponents();
            for(var i=0;i<menuComponents.length;i++){
              menuComponents[i].menuItem=this.buildMenuItem(menuComponents[i]);
              menuComponents[i].mobileMenuItem=this.buildMenuItem(menuComponents[i]);
                $("#mobile-menu").append(menuComponents[i].mobileMenuItem);
                $("#nav-mobile").append(menuComponents[i].menuItem);
            }
      },
      buildMenuItem:function(menuComponent){
            var li=$("<li></li>");

            var aElementAttributes={
                  href:menuComponent.buildPath(),
                  text:menuComponent.title
            };
            if(menuComponent.redirect){
                aElementAttributes.href=menuComponent.redirect;
            }
            var aitem=$("<a></a>",aElementAttributes);
            li.append(aitem);
            var that=this;
            li.addClass("navItem");
            if(menuComponent.extraClasses){
              for(var k=0;k<menuComponent.extraClasses.length;k++){
                li.addClass(menuComponent.extraClasses[k]);
              }
            }

            var that=this;
            if(!menuComponent.redirect){
                aitem.click(function(){
                    menuComponent.onClicked();
                    return false;
                });
            }


            return li;
      },
      signout:{
            title:"Sign Out",
            name:"signedout",
            extraClasses:["signinorout"],
            buildPath:function(){
              return "/index.html";
            },
            route:function(){
                  boxservice.globalInput.signout();                  
                  window.path.location="/index.html";
            },
            onClicked:function(){
                  var path=this.buildPath();
                  this.replaceState({},this.title,path);
                  this.route();
            },
      },
      help:{
            title:"Help",
            name:"help",
            route:function(){
                boxservice.help();
            }
      },
      admin:{
          title:"Admin",
          name:"admin",
          redirect:'/box-media/admin',
          route:function(){
            boxservice.admin.main();
          }
      },
      importSchedules:{
          title:"Imports",
          name:"importSchedules",
          extraClasses:["box-specific"],
          redirect:'/box-media/importSchedules',
          route:function(){
              boxservice.import.show();
          }
      },
      playlists:{
            title:"Playlists",
            name:"playlists",
            route:function(){
                boxservice.bc.playlist.show();
            }
      },
      schedules:{
          title:"Schedules",
          name:"schedules",
          route:function(){
              boxservice.schedule.show();
          }
      },
      s3:{
            title:"S3",
            name:"s3",
            redirect:"/box-media/s3-file-list",
            route:function(){
                boxservice.s3.show();
            }
      },
      seriesgroup:{
            title:"Collections",
            name:"collections",
            route:function(){
                boxservice.seriesgroup.show();
            }
      },
      series:{
            title:"Programme",
            name:"programmes",
            route:function(){
                boxservice.series.show();
            }
      },
      episode:{
          title:"Episodes",
          name: "episode",
          route:function(){
              boxservice.episode.show();
          }
      },
      editEpisode:{
            title:"Edit Episodes",
            name: "editEpisode",
            buildPathFromQueryParameters:function(){
                        var path=this.buildPath();
                        var episodeid=this.getQueryParam("episodeid");
                        return path+"&episodeid="+episodeid;
            },
            buildStateFromQueryParameters:function(){
                var episodeid=this.getQueryParam("episodeid");
                return {
                      resource:this.name,
                      episodeid:episodeid
                };
            },
            route:function(request){
                boxservice.episode.edit(request.episodeid);
            },
            onClicked:function(episodeid, deferred){
              var state=this.buildState();
              state.episodeid=episodeid;
              var path=this.buildPath()+"&episodeid="+episodeid;
              this.pushState(state,this.title,path);
              $(window).unbind("scroll");
              var ret=boxservice.episode.edit(episodeid,deferred);
              window.scrollTo(0,0);
              return ret;
            }
      },
      editProgramme:{
            title:"Edit Programme",
            name: "editProgramme",
            buildPathFromQueryParameters:function(){
                        var path=this.buildPath();
                        var programmeid=this.getQueryParam("programmeid");
                        return path+"&programmeid="+programmeid;
            },
            buildStateFromQueryParameters:function(){
                var programmeid=this.getQueryParam("programmeid");
                return {
                      resource:this.name,
                      programmeid:programmeid
                };
            },
            route:function(request){
                boxservice.series.edit(request.programmeid);
            },
            onClicked:function(programmeid, deferred){
              var state=this.buildState();
              state.programmeid=programmeid;
              var path=this.buildPath()+"&programmeid="+programmeid;
              this.pushState(state,this.title,path);
              $(window).unbind("scroll");
              var ret=boxservice.series.edit(programmeid,deferred);
              window.scrollTo(0,0);
              return ret;
            }
      },
      editCollection:{
            title:"Edit Collection",
            name: "editCollection",
            buildPathFromQueryParameters:function(){
                        var path=this.buildPath();
                        var collectionid=this.getQueryParam("collectionid");
                        return path+"&collectionid="+collectionid;
            },
            buildStateFromQueryParameters:function(){
                var collectionid=this.getQueryParam("collectionid");
                return {
                      resource:this.name,
                      collectionid:collectionid
                };
            },
            route:function(request){
                boxservice.seriesgroup.edit(request.collectionid);
            },
            onClicked:function(collectionid, deferred){
              var state=this.buildState();
              state.collectionid=collectionid;
              var path=this.buildPath()+"&collectionid="+collectionid;
              this.pushState(state,this.title,path);
              $(window).unbind("scroll");
              var ret=boxservice.seriesgroup.edit(collectionid,deferred);
              window.scrollTo(0,0);
              return ret;
            }
      }

}
