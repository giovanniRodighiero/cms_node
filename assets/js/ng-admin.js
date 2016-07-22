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
    for (var i = 0; i < entities.length; i++) {
      if(entities[i]._name === name)
        return i;
    }
    return -1;
  }
  function setNormalFields(modelField, entities, nga) {
    if(modelField.infos.enum){
      var choices = [];
      var original = eval(modelField.infos.enum);
      for (var i = 0; i < original.length; i++) {
        choices[i] = {};
        choices[i]['value'] = original[i];
        choices[i]['label'] = original[i];
      }
      var aux = nga.field(modelField.name, 'choice').choices(choices);
      return aux;
    }else{
      switch (modelField.infos.type) {
        case 'boolean':
          var aux = nga.field(modelField.name, modelField.infos.type).choices([
            { value: null, label: 'null' },
            { value: true, label: 'true' },
            { value: false, label: 'false' }
            ]);
            return aux;
          break;
        default:
          var aux = nga.field(modelField.name, modelField.infos.type);
          return aux;
      }
    }
  }
  function setFieldsAssociationWrite(modelField, entities, nga) {// return nga.field(name, type)
    if(modelField.association){
      if(modelField.association.type === 'single'){
        return nga.field(modelField.name, 'reference')
          .targetEntity(entities[findEntity(modelField.infos.model, entities)])
          .targetField(nga.field(modelField.association.searchWith));
      }
      else if (modelField.association.type === 'multiple') {
        return nga.field(modelField.name, 'reference_many')
          .targetEntity(entities[findEntity(modelField.infos.collection, entities)])
          // .targetReferenceField(modelField.infos.via)
          // .targetFields([nga.field(modelField.association.searchWith)])
          .targetField(nga.field(modelField.association.searchWith))
          .remoteComplete(true);
      }
    }else{
      return setNormalFields(modelField, entities, nga);
    }
  }
  function setFieldsAssociationRead(modelField, entities, nga) {// return nga.field(name, type)
    if(modelField.association){
      var fieldName = modelField.name+'.'+modelField.association.searchWith;
      if(modelField.association.type === 'single'){
        return nga.field(fieldName).label(modelField.name)
      }
      else if (modelField.association.type === 'multiple') {
        return nga.field(modelField.name, 'embedded_list')
          .targetFields([nga.field(modelField.association.searchWith)])
      }
    }else{
      return setNormalFields(modelField, entities, nga);
    }
  }

  function setFieldsIndex(fieldsInfos, model, entities, nga) {
    var fields = {};
    var keys = Object.keys(fieldsInfos.fields);
    for (var i = 0; i < keys.length; i++) {
      fields[keys[i]] = {
        writeFields: [],
        readFields: []
      };
      for (var j = 0; j < fieldsInfos.fields[keys[i]].length; j++) {
        var writeField = setFieldsAssociationWrite(fieldsInfos.fields[keys[i]][j], entities, nga);
        if(fieldsInfos.fields[keys[i]][j].infos.required){
          writeField = writeField.validation({required: true});
        }
        var readField = setFieldsAssociationRead(fieldsInfos.fields[keys[i]][j], entities, nga);
        fields[keys[i]].writeFields.push(writeField);
        fields[keys[i]].readFields.push(readField);
      }
      fields[keys[i]].readFields.push(nga.field('createdAt', 'datetime'));
      fields[keys[i]].readFields.push(nga.field('updatedAt', 'datetime'));

      var actions = fieldsInfos.actions;
      var index = fieldsInfos.actions.indexOf('list');

      if(index != -1)
        actions.splice(index, 1);

      model.listView().listActions(actions);

    }
    model.creationView().fields(fields['create'].writeFields);
    model.listView().fields(fields['find'].readFields).perPage(3);
    model.editionView().fields(fields['edit'].writeFields);
    model.showView().fields(fields['findone'].readFields);
    //model.listView().listActions(['show','edit','delete']);
    //model.showView().fields(fields);
    //model.editionView().fields(fields);
    return model;
  }
  myApp.config(['$urlRouterProvider','NgAdminConfigurationProvider', function($urlRouterProvider, NgAdminConfigurationProvider){
    var nga = NgAdminConfigurationProvider;
    var admin = nga.application('My First Admin');
    admin.baseApiUrl('http://localhost:1337/'); // main API endpoint
    // admin.header(header);
    var models = Object.keys(permitted);
    var entities = [];
    for (var i = 0; i < models.length; i++) {
      if(permitted[models[i]].actions.indexOf('list') != -1){
        entities.push(nga.entity(models[i]));
      }
    }
    for (var i = 0; i < entities.length; i++) {
      var model = setFieldsIndex(permitted[entities[i]._name], entities[i], entities, nga);
      admin.addEntity(model);
    }
    // var website = nga.entity('website');
    // var metadata = nga.entity('metadata');
    // website.listView().listActions(['edit','show']);
    //
    // website.editionView().fields([
    //   nga.field('name'),
    //   nga.field('metadatas', 'referenced_list')
    //     .targetEntity(metadata)
    //     .targetReferenceField('website')
    //     .targetFields([
    //         nga.field('path').label('path')
    //     ])
    //     .validation({ required: true })
    //       .remoteComplete(true, {
    //           refreshDelay: 200,
    //           searchQuery: search => ({ q: search })
    //       })
    // ]);
    // website.showView().fields(website.editionView().fields());
    // website.listView().fields(website.editionView().fields());
    // metadata.listView().listActions(['edit','show']);
    //
    // metadata.editionView().fields([
    //   nga.field('website','reference')
    //     .targetEntity(website)
    //     .targetField(nga.field('name'))
    //     .validation({ required: true }),
    //   nga.field('path')
    //
    // ]);
    // metadata.listView().fields([
    //   nga.field('website.name'),
    //   nga.field('path')
    // ]);
    // metadata.showView().fields(metadata.listView().fields());
    // admin.addEntity(website);
    // admin.addEntity(metadata);
    nga.configure(admin);
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
