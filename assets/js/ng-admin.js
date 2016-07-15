(function(){
  "use strict";
  var myApp = angular.module('myApp', ['ng-admin','interceptors','login']).config(config);
  myApp.factory('UserService',['$rootScope',function($rootScope){
    return{
      getUser: function(){
          console.log('called getUser()');
          //return $rootScope.user;
        }
      };
  }]);
  config.$inject = ['test','NgAdminConfigurationProvider'];
  function config(test, NgAdminConfigurationProvider) {
    console.log('test', test);
    var nga = NgAdminConfigurationProvider;
    var admin = nga.application('My First Admin')
    .baseApiUrl('http://localhost:1337/'); // main API endpoint
    var user = nga.entity('user');
    var website = nga.entity('website');
    user.listView().fields([
            nga.field('role'),
            nga.field('email')
        ]);
    admin.addEntity(user);
    admin.addEntity(website);
    nga.configure(admin);
    //console.log(UserService.getUser());
  }





  // myApp.config(['NgAdminConfigurationProvider','UserService', function(NgAdminConfigurationProvider, UserService) {
  //   var nga = NgAdminConfigurationProvider;
  //   //console.log('test',test);
  //
  //   // create an admin application
  //   var admin = nga.application('My First Admin')
  //   // more configuration here later
  //   // ...
  //   // attach the admin application to the DOM and run it
  //   .baseApiUrl('http://localhost:1337/'); // main API endpoint
  //   var user = nga.entity('user');
  //   var website = nga.entity('website');
  //
  //   user.listView().fields([
  //           nga.field('role'),
  //           nga.field('email')
  //       ]);
  //   // website.listView().fields([
  //   //         nga.field('name')
  //   //     ]);
  //   // if(user)
  //   admin.addEntity(user);
  //   admin.addEntity(website);
  //   nga.configure(admin);
  // }]);

})();
