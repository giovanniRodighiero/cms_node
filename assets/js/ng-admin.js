(function(){
  "use strict";
  var myApp = angular.module('myApp', ['ng-admin','interceptors','services']);
  var permitted;

  function loadInfoNeededBeforeBootstrap() {
    var initInjector = angular.injector(['ngCookies']);
    var $http = initInjector.get("$http");
    var $window = initInjector.get("$window");
    var $cookies = initInjector.get("$cookies");

    return $http.get("/permittedModels",{headers: {'authorization': 'JWT '+$cookies.get('cms-token')}}).then(function (response) {
        permitted = response.data.data;
        console.log(permitted);
    }, function (errorResponse) {
      if(errorResponse.status === 401){
        $window.location.href = '/';
      }
    });
  };

  function bootstrapApplication() {
    angular.element(document).ready(function () {
        angular.bootstrap(document, ['myApp']);
    });
  }

  loadInfoNeededBeforeBootstrap().then(bootstrapApplication);

  function findEntity(name, entities) {
    console.log(name, entities);
    for (var i = 0; i < entities.length; i++) {
      if(entities[i]._name === name)
        return i;
    }
    return -1;
  }
  function setFieldNameType(modelField, entities, nga) {// return nga.field(name, type)
    if(modelField.association){
      if(modelField.association.type === 'single'){
        console.log('index', findEntity(modelField.infos.model, entities));
        return nga.field(modelField.name, 'reference')
          .targetEntity(entities[findEntity(modelField.infos.model, entities)])
          .targetField(nga.field(modelField.association.searchWith))
      }
    }else {
      return nga.field(modelField.name);
    }
  }

  function setFieldsIndex(fieldsInfos, model, entities, nga) {
    console.log(fieldsInfos);
    var fields = {};
    var keys = Object.keys(fieldsInfos.fields);
    for (var i = 0; i < keys.length; i++) {
      fields[keys[i]] = [];
      for (var j = 0; j < fieldsInfos.fields[keys[i]].length; j++) {
        // var type ;
        // if(fieldsInfos.fields[keys[i]][j].infos.type)
        //   type = fieldsInfos.fields[keys[i]][j].infos.type;
        // else
        //   type = 'string';
        // fields[keys[i]].push(nga.field(fieldsInfos.fields[keys[i]][j].name, type));

        var field = setFieldNameType(fieldsInfos.fields[keys[i]][j], entities, nga);
        console.log(field);
      //  var field = setFieldNameType('id', 'string');
        if(field)
          fields[keys[i]].push(field);
      }
      console.log(fields[keys[i]]);
      //fields.push(nga.field(fieldsInfos[keys[i]].name));
      var actions = fieldsInfos.actions;
      var index = fieldsInfos.actions.indexOf('list');
      console.log(actions, index);

      if(index != -1)
        actions.splice(index, 1);
      console.log(actions);
      model.listView().fields(fields[keys[i]]);
      model.listView().listActions(actions);
      model.editionView().fields(fields[keys[i]]);
    }
    //model.listView().listActions(['show','edit','delete']);
    //model.showView().fields(fields);
    //model.editionView().fields(fields);
    return model;
  }
  myApp.config(['$urlRouterProvider','NgAdminConfigurationProvider', function($urlRouterProvider, NgAdminConfigurationProvider){
    var nga = NgAdminConfigurationProvider;
    var admin = nga.application('My First Admin')
    .baseApiUrl('http://localhost:1337/'); // main API endpoint
    var models = Object.keys(permitted);
    var entities = [];
    for (var i = 0; i < models.length; i++) {
      if(permitted[models[i]].actions.indexOf('list') != -1){
        entities.push(nga.entity(models[i]));
      }
    }
    console.log(permitted[entities[0]._name], entities[0]._name, entities);
    for (var i = 0; i < entities.length; i++) {
      var model = setFieldsIndex(permitted[entities[i]._name], entities[i], entities, nga);
      console.log('aggiunta entity');
      admin.addEntity(model);
    }
    nga.configure(admin);
    console.log(nga);
    //console.log(UserService.getUser());
  }]);

  myApp.run(['$rootScope','$location','NgAdminConfiguration','Restangular', 'AuthService', 'PermissionsService', function($rootScope, $location, NgAdminConfiguration, Restangular, AuthService, PermissionsService){
    // console.log('refresh in run');
    // PermissionsService.permittedModels.getList().then(function(results){
    //   var permitted = [];
    //   for (var i = 0; i < results.data.length; i++) {
    //     permitted.push(results.data[i]);
    //   }
    //   console.log(permitted);
    //   NgAdminConfiguration()._entities = PermissionsService.filterModels(NgAdminConfiguration()._entities, permitted);
    //   delete NgAdminConfiguration()._dashboard._collections['user'];
    //   console.log('NgAdminConfiguration()', NgAdminConfiguration());
    // })
    // controllo token e eventuale redirect
    // $rootScope.$on('$locationChangeStart', function(event, next, current){
    //   if(!AuthService.isLogged()){
    //     event.preventDefault();
    //     AuthService.redirectLogin();
    //   }
    // });
    //console.log('NgAdminConfiguration()', NgAdminConfiguration());


    //var permitted = ['website','metadata'];

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
