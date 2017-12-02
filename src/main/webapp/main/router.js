var boxservice=boxservice || {};
boxservice.router={
  init:function(){
          var resource=this.getQueryParam("resource");
          var router=this.getByResource(resource);
          if(!router){
              router=this.episode;
          }
          router.push();
          router.route();
          this.selectMenuItem(router);

          var that=this;
          window.addEventListener('popstate', function(e) {
                if(!e || !e.state || !e.state.resource){
                  console.log("no resource is set in popstate");
                  return;
                }
                var router=that.getByResource(e.state.resource);
                if(router){
                  router.route();
                  that.selectMenuItem(router);
                }
          });
     },
      getAllResources:function(){
            return [this.episode,this.series,this.seriesgroup,this.s3,this.schedules,this.playlists,
            this.importSchedules,this.admin,this.help];
      },
      getAllMenuComponents:function(){
          return [this.episode,this.series,this.seriesgroup,this.s3,this.schedules,this.playlists,
          this.importSchedules,this.admin,this.help,this.signout];
      },
      getByResource:function(resource){
            var resources=this.getAllResources();
            for(var i=0;i<resources.length;i++){
                var matched=resources[i].matchResource(resource);
                if(matched){
                  return matched;
                }
            }
            return null;
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
      selectMenuItem(menuComponent){
          if(!menuComponent.menuItem){
            return;
          }
          $(".button-collapse").sideNav("hide");
          var menuComponents=this.getAllMenuComponents();
          for(var i=0;i<menuComponents.length;i++){
              menuComponents[i].menuItem.removeClass("active");
              menuComponents[i].mobileMenuItem.removeClass("active");
          }
          menuComponent.menuItem.addClass("active");
          boxservice.initForNewPage();
      },

      buildMenuItem:function(menuComponent){
            var li=$("<li></li>");
            var aitem=$("<a></a>",{
                href:menuComponent.getPath(),
                text:menuComponent.title
            });
            li.append(aitem);
            var that=this;
            li.addClass("navItem");
            if(menuComponent.extraClasses){
              for(var k=0;k<menuComponent.extraClasses.length;k++){
                li.addClass(menuComponent.extraClasses[k]);
              }
            }

            var that=this;
            aitem.click(function(){
                  menuComponent.index();
                  that.selectMenuItem(menuComponent);
                  return false;
            });

            return li;
      },
      signout:{
        title:"Sign Out",
        resource:"singout",
        extraClasses:["signinorout"],

        route:function(){
            boxservice.signinout();
        },
        matchResource:function(resource){
            if(this.resource===resource){
              return this;
            }
            else{
              return null;
            }
        },
        getPath(){
          return "/index.html?resource="+this.resource;
        },
        push:function(){
            window.history.pushState({resource:this.resource},this.title, this.getPath());
        },
        index:function(){
          this.route();
        }
      },

      help:{
        title:"Help",
        resource:"help",
        route:function(){
            boxservice.help();
        },

        matchResource:function(resource){
            if(this.resource===resource){
              return this;
            }
            else{
              return null;
            }
        },
        getPath(){
          return "/index.html?resource="+this.resource;
        },
        push:function(){
            window.history.pushState({resource:this.resource},this.title, this.getPath());
        },
        index:function(){
          this.push();
          this.route();
        }
      },
      admin:{
        title:"Admin",
        resource:"admin",
        route:function(){
            boxservice.admin.main();
        },

        matchResource:function(resource){
            if(this.resource===resource){
              return this;
            }
            else{
              return null;
            }
        },
        getPath(){
          return "/index.html?resource="+this.resource;
        },
        push:function(){
            window.history.pushState({resource:this.resource},this.title, this.getPath());
        },
        index:function(){
          this.push();
          this.route();
        }
      },
      importSchedules:{
        title:"Imports",
        resource:"importSchedules",
        extraClasses:["box-specific"],
        route:function(){
            boxservice.import.show();
        },

        matchResource:function(resource){
            if(this.resource===resource){
              return this;
            }
            else{
              return null;
            }
        },
        getPath(){
          return "/index.html?resource="+this.resource;
        },
        push:function(){
            window.history.pushState({resource:this.resource},this.title, this.getPath());
        },
        index:function(){
          this.push();
          this.route();
        }
      },
      playlists:{
        title:"Playlists",
        resource:"playlists",
        route:function(){
            boxservice.bc.playlist.show();

        },

        matchResource:function(resource){
            if(this.resource===resource){
              return this;
            }
            else{
              return null;
            }
        },
        getPath(){
          return "/index.html?resource="+this.resource;
        },
        push:function(){
            window.history.pushState({resource:this.resource},this.title, this.getPath());
        },
        index:function(){
          this.push();
          this.route();
        }
      },
      schedules:{
              title:"Schedules",
              resource:"schedules",
              route:function(){
                  boxservice.schedule.show();
              },

              matchResource:function(resource){
                  if(this.resource===resource){
                    return this;
                  }
                  else{
                    return null;
                  }
              },
              getPath(){
                return "/index.html?resource="+this.resource;
              },
              push:function(){
                  window.history.pushState({resource:this.resource},this.title, this.getPath());
              },
              index:function(){
                this.push();
                this.route();
              }
      },
      s3:{
              title:"S3",
              resource:"s3",
              route:function(){
                  boxservice.s3.show();
              },

              matchResource:function(resource){
                  if(this.resource===resource){
                    return this;
                  }
                  else{
                    return null;
                  }
              },
              getPath(){
                return "/index.html?resource="+this.resource;
              },
              push:function(){
                  window.history.pushState({resource:this.resource},this.title, this.getPath());
              },
              index:function(){
                this.push();
                this.route();
              }
      },
      seriesgroup:{
            title:"Collections",
            resource:"collections",
            route:function(){
                boxservice.seriesgroup.show();
            },

            matchResource:function(resource){
                if(this.resource===resource){
                  return this;
                }
                else{
                  return null;
                }
            },
            getPath(){
              return "/index.html?resource="+this.resource;
            },
            push:function(){
                window.history.pushState({resource:this.resource},this.title, this.getPath());
            },
            index:function(){
              this.push();
              this.route();
            }
      },
      series:{
            title:"Programme",
            resource:"programmes",
            route:function(){
                boxservice.series.show();
            },
            matchResource:function(resource){
                if(this.resource===resource){
                  return this;
                }
                else{
                  return null;
                }
            },
            getPath(){
              return "/index.html?resource="+this.resource;
            },
            push:function(){
                window.history.pushState({resource:this.resource},this.title, this.getPath());
            },

            index:function(){
              this.push();
              this.route();
            }
      },
      episode:{
          title:"Episodes",
          resource: "episode",
          route:function(){
              boxservice.episode.show();
          },
          matchResource:function(resource){
              if(this.resource===resource){
                return this;
              }
              else{
                return null;
              }
          },
          getPath(){
            return "/index.html?resource="+this.resource;
          },
          push:function(){
              window.history.pushState({resource:this.resource},this.title, this.getPath());
          },

          index:function(){
            this.push();
            this.route();
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
        }


}
