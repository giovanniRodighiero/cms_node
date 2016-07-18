(function(){
  "use strict";
  var myApp = angular.module('myApp', ['ng-admin','interceptors','services']).config(config);

  config.$inject = ['NgAdminConfigurationProvider'];
  function config(NgAdminConfigurationProvider) {
    //console.log('test', test);
    var nga = NgAdminConfigurationProvider;
    var admin = nga.application('My First Admin')
    .baseApiUrl('http://localhost:1337/'); // main API endpoint
     var user = nga.entity('user');
     var website = nga.entity('website');
     var metadata = nga.entity('metadata');
     user.listView().fields([
            nga.field('role'),
            nga.field('email'),
            nga.field('website')
        ]);
    website.listView().fields([
            nga.field('name')
        ]);
    metadata.listView().fields([
            nga.field('path'),
            nga.field('meta_title'),
            nga.field('meta_descr'),
            nga.field('published'),
            nga.field('locale'),
        ]);
     admin.addEntity(user);
     admin.addEntity(website);
     admin.addEntity(metadata);
    nga.configure(admin);
    //console.log(UserService.getUser());
  };
  myApp.run(['$rootScope','$location','NgAdminConfiguration','Restangular', 'AuthService', 'PermissionsService', function($rootScope, $location, NgAdminConfiguration, Restangular, AuthService, PermissionsService){
    // controllo token e eventuale redirect
    $rootScope.$on('$locationChangeStart', function(event, next, current){
      if(!AuthService.isLogged()){
        event.preventDefault();
        AuthService.redirectLogin();
      }
    });
    PermissionsService.permittedModels.getList().then(function(results){
      var permitted = [];
      console.log('results', results);
      for (var i = 0; i < results.length; i++) {
        permitted.push(results[i]);
      }

    })
    var permitted = ['website','metadata'];
    NgAdminConfiguration()._entities = PermissionsService.filterModels(NgAdminConfiguration()._entities, permitted);
    console.log('NgAdminConfiguration()._entities', NgAdminConfiguration()._entities);
    //console.log('PermissionsService.permittedModels', PermissionsService.permittedModels());
    // var permitted = ['user'];
    // var infos = Restangular.one('infos');
    // infos.get().then(function(result){
    //   var expr = '('+result.data+')';
    //   console.log('expr', expr);
    //
    // var foo = eval(expr);
    // console.log(foo);
    // });
    // for (var i = 0; i < NgAdminConfiguration()._entities.length; i++) {
    //   if(permitted.indexOf(NgAdminConfiguration()._entities[i]._name) == -1){
    //     //console.log('dentro ciclo',NgAdminConfiguration()._entities[i]._name);
    //     NgAdminConfiguration()._entities.splice(i,1);
    //   }else {
    //     NgAdminConfiguration()._entities[i]._views.ListView._fields.splice(2,1);
    //   }
    //
    // }
  //  NgAdminConfiguration()._entities.pop();
  }]);

})();
