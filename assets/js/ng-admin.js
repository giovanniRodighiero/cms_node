(function(){
  "use strict";
  var myApp = angular.module('myApp', ['ng-admin','interceptors','services']);
  var permitted;
  var customHeaderTemplate = '<div class="navbar-header">'+
      '<button type="button" class="navbar-toggle" ng-click="isCollapsed = !isCollapsed">'+
          '<span class="icon-bar"></span>'+
          '<span class="icon-bar"></span>'+
          '<span class="icon-bar"></span>'+
      '</button>'+
      '<a class="navbar-brand" href="#" ng-click="appController.displayHome()">CMS NODE</a>'+
  '</div>'+
  '<ul class="nav navbar-top-links navbar-right">'+
    '<li><a href="/" ><i class="fa fa-sign-out fa-fw"></i> Logout</a></li>'+
  '</ul>';
/*
  ****************** app bootstrap ********************
*/
  //inject needed modules and get the infos to build the config correctly
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

  //MANUAL BOOTSTRAP
  function bootstrapApplication() {
    angular.element(document).ready(function () {
        angular.bootstrap(document, ['myApp']);
    });
  }
  // get infos and bootstrap the app
  loadInfoNeededBeforeBootstrap().then(bootstrapApplication);
/*
 ********************************  utility functions ***********************
*/
  // return the index of one entity item from the existing previously added to config
  function findEntity(name, entities) {
    for (var i = 0; i < entities.length; i++) {
      if(entities[i]._name === name)
        return i;
    }
    return -1;
  }
  // set normal fields, normal means no associations-fields
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
  // set the associations-fields in write context
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
      if(modelField.file)
        return nga.field(modelField.name, 'file').uploadInformation({ 'url': '/uploadFile', 'apifilename': 'picture_name' });
      return setNormalFields(modelField, entities, nga);
    }
  }
  // set the associations-fields in read context
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
      if(modelField.file){
        return nga.field(modelField.name, 'template').template('<img src="{{ entry.values.asset }}" height="100px" width="100px" />');
      }
      return setNormalFields(modelField, entities, nga);
    }
  }
  // add client side validation to a field
 function setClientSideValidation(writeField, infos) {
  var validation = {};
  if(infos.required)
    validation.required = true;
  if(infos.minLength)
    validation.minlength = infos.minLength;
  if(infos.maxlenght)
    validation.maxlenght = infos.maxlenght;
  writeField.validation(validation);
  return writeField;
 }
 function addErrors(error, form, progression, notification) {
   var element = angular.element( document.querySelector( '#create-view' ) );
   var previousErrors = angular.element( document.querySelector( '#errors' ) );
   if(previousErrors)
     previousErrors.remove();
   var html = '<div id="errors">';
   var errorData = Object.keys(error.data.data);
   for (var i = 0; i < errorData.length; i++) {
    var list = '<ul>';
    for (var j = 0; j < error.data.data[errorData[i]].length; j++) {
      list = list + '<strong>' + error.data.data[errorData[i]][j].value + '</strong>';
      list = list + '<li>' + error.data.data[errorData[i]][j].rule + '</li>';
      list = list + '<li>' + error.data.data[errorData[i]][j].message + '</li>';
    }
    list = list + '</ul> <br>';
  }
  html = html + list + '</div>';
  element.prepend(html);
  progression.done();
  notification.log(`Some values are invalid, see details in the form`, { addnCls: 'humane-flatty-error' });
   return false;
 }
 // handle server side validation appending an html block to the original template
 function setServerSideValidation(model) {
   model.creationView().onSubmitError(['error', 'form', 'progression', 'notification', function(error, form, progression, notification) {
     return addErrors(error, form, progression, notification);
  }]);
   model.editionView().onSubmitError(['error', 'form', 'progression', 'notification', function(error, form, progression, notification) {
     return addErrors(error, form, progression, notification);
  }]);
  return model;
 }
  // starter function for setting up fields
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
        writeField = setClientSideValidation(writeField, fieldsInfos.fields[keys[i]][j].infos);
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

    // var editFieldsImage = fields['edit'].writeFields;
    // console.log(editFieldsImage);
    //
    // if(model._name === 'image')
    //   model.editionView().fields(editFieldsImage);
    // else
      model.editionView().fields(fields['edit'].writeFields);

    model.showView().fields(fields['findone'].writeFields);
    model = setServerSideValidation(model);

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
    // var user = nga.entity('user');
    // user.creationView().fields(nga.field('avatar', 'file').uploadInformation({ 'url': '/file', 'apifilename': 'picture_name' }));
    // user.listView().fields(user.creationView().fields());
    // admin.addEntity(user);
    admin.header(customHeaderTemplate);
    nga.configure(admin);
  }]);

  myApp.run(['$rootScope','$location','NgAdminConfiguration','Restangular', 'AuthService', 'PermissionsService', function($rootScope, $location, NgAdminConfiguration, Restangular, AuthService, PermissionsService){

  }]);

})();
