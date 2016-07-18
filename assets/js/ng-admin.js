(function(){
  "use strict";
  var myApp = angular.module('myApp', ['ng-admin','interceptors','login']).config(config);
  myApp.factory('UserService',['$rootScope',function($rootScope){
    return{
      getUser: function(){
          //console.log('called getUser()');
          //return $rootScope.user;
        }
      };
  }]);
  config.$inject = ['test','NgAdminConfigurationProvider'];
  function config(test, NgAdminConfigurationProvider) {
    //console.log('test', test);
    var nga = NgAdminConfigurationProvider;
    var admin = nga.application('My First Admin')
    .baseApiUrl('http://localhost:1337/'); // main API endpoint
    var user = nga.entity('user');

    var website = nga.entity('website');
    user.listView().fields([
            nga.field('role'),
            nga.field('email'),
            nga.field('website')
        ]);
    website.listView().fields([
            nga.field('name')
        ]);
    admin.addEntity(user);
    admin.addEntity(website);
    nga.configure(admin);
    //console.log(UserService.getUser());
  };
  myApp.run(['NgAdminConfiguration','Restangular', function(NgAdminConfiguration, Restangular){
    //console.log('NgAdminConfigurationProvider',NgAdminConfiguration());
    var permitted = ['user'];
    var infos = Restangular.one('infos');
    infos.get().then(function(result){
      var expr = result.data;
      console.log(expr);

    var foo = eval(expr);
    //  console.log(foo);
    });
    for (var i = 0; i < NgAdminConfiguration()._entities.length; i++) {
      if(permitted.indexOf(NgAdminConfiguration()._entities[i]._name) == -1){
        //console.log('dentro ciclo',NgAdminConfiguration()._entities[i]._name);
        NgAdminConfiguration()._entities.splice(i,1);
      }else {
        NgAdminConfiguration()._entities[i]._views.ListView._fields.splice(2,1);
      }

    }
  //  NgAdminConfiguration()._entities.pop();
  }]);

})();
