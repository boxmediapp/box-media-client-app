var boxservice=boxservice || {};
boxservice.router={
      getAllResources:function(){
            return [this.episode,this.series,this.seriesgroup,this.s3,this.schedules,this.playlists,
            this.importSchedules,this.admin,this.help];
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
      signout:{
        title:"Sign Out",
        resource:"singout",
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
        push:function(){
            window.history.pushState({resource:this.resource},this.title, "/index.html?resource="+this.resource);
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
        push:function(){
            window.history.pushState({resource:this.resource},this.title, "/index.html?resource="+this.resource);
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
        push:function(){
            window.history.pushState({resource:this.resource},this.title, "/index.html?resource="+this.resource);
        },
        index:function(){
          this.push();
          this.route();
        }
      },
      importSchedules:{
        title:"Imports",
        resource:"importSchedules",
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
        push:function(){
            window.history.pushState({resource:this.resource},this.title, "/index.html?resource="+this.resource);
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
        push:function(){
            window.history.pushState({resource:this.resource},this.title, "/index.html?resource="+this.resource);
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
              push:function(){
                  window.history.pushState({resource:this.resource},this.title, "/index.html?resource="+this.resource);
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
              push:function(){
                  window.history.pushState({resource:this.resource},this.title, "/index.html?resource="+this.resource);
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
            push:function(){
                window.history.pushState({resource:this.resource},this.title, "/index.html?resource="+this.resource);
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
            push:function(){
                window.history.pushState({resource:this.resource},this.title, "/index.html?resource="+this.resource);
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
          push:function(){
              window.history.pushState({resource:this.resource},this.title, "/index.html?resource="+this.resource);
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
        },

      init:function(){
        var resource=this.getQueryParam("resource");
        var router=this.getByResource(resource);
        if(!router){
          router=this.episode;
        }
        router.push();
        router.route();
        var that=this;
        window.addEventListener('popstate', function(e) {
              if(!e || !e.state || !e.state.resource){
                console.log("no resource is set in popstate");
                return;
              }
              var router=that.getByResource(e.state.resource);
              if(router){
                router.route();
              }
        });
      }
}
