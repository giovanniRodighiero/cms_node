var fs = require('fs');
var async = require('async');
var _ = require('lodash');
var defaultModels;
var customModels;
var hashModels = {};
// var hashUser = {};
var count = 0;
var defaultModelsFile = fs.readFileSync('defaultModels.json');
var customModelsFile = fs.readFileSync('customModels.json');

function loadHashes() {
  defaultModels = JSON.parse(defaultModelsFile);
  customModels = JSON.parse(customModelsFile);
  for (var i = 0; i < customModels.models.length; i++) {
    hashModels[customModels.models[i].modelName] = customModels.models[i];
  }
};
function setUpEnum(string) {
  var base = _.trim(string, '[');
  base = _.trimEnd(base, ']');
  var info = base.split(',');
  var array = [];
  for (var i = 0; i < info.length; i++) {
    var aux = _.trim(info[i],'\'');
    array.push(aux);
  }
  return array;
};
function setUpFieldsAux(field, complexItem, i){
  for (var j = 0; j < complexItem.fields[i].params.length; j++) {
    if(field.name === 'password' && complexItem.fields[i].params[j].parName === 'type'){
      field.infos[complexItem.fields[i].params[j].parName] = 'password';
    }else{
      switch (complexItem.fields[i].params[j].parName) {
        case 'enum':
          field.infos[complexItem.fields[i].params[j].parName] = [];
          field.infos[complexItem.fields[i].params[j].parName] = setUpEnum(complexItem.fields[i].params[j].value);
          break;
        default:
          field.infos[complexItem.fields[i].params[j].parName] = complexItem.fields[i].params[j].value;
          break;
      }
    }
  }
  count++;
  return field;
};
function prepareFields(fields, complexItem) {
  complexItem.fields.forEach(function(listItem, i){
    var field = {
      name: '',
      infos: {}
    };
    field.name = complexItem.fields[i].name;
    if(complexItem.fields[i].isAssociation){
      field.association = {};
      field.association.type = complexItem.fields[i].isAssociation.type;
      field.association.searchWith = complexItem.fields[i].isAssociation.searchWith;
    }
    if(complexItem.fields[i].isFile){
      field.file = true;
    }
    fields.push(setUpFieldsAux(field, complexItem, i));
  });
    return fields;
  }
  loadHashes();

module.exports.models_structure = {
  getModels: function(){
    return customModels;
  },
  // getUser: function(){
  //   return user;
  // },
  getModelByName(name){
    var rootName = hashModels[name].inheritsFrom;
    var complexItem = {
      child: hashModels[name],
      root: defaultModels.defaults[rootName]
    }
    return complexItem;
  },
  // getUserByName(name){
  //   var rootName = hashUser[name].inheritsFrom;
  //   var complexItem = {
  //     child: hashUser[name],
  //     root: user.defaults[rootName]
  //   }
  //   return complexItem;
  // },
  getFields(name){
    loadHashes();
    var complexItem = this.getModelByName(name);
    var fields = [];
    fields = prepareFields(fields, complexItem.root);
    fields = prepareFields(fields, complexItem.child);
    return fields;
  }
};
