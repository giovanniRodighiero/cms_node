var fs = require('fs');
var async = require('async');
var _ = require('lodash');
var models;
var user;
var hashModels = {};
var hashUser = {};
var count = 0;
async.parallel([
  fs.readFile.bind(fs, 'models.json'),
  fs.readFile.bind(fs, 'user.json')
],
function(err, results){
  models = JSON.parse(results[0]);
  user = JSON.parse(results[1]);
  for (var i = 0; i < models.models.length; i++) {
    hashModels[models.models[i].modelName] = models.models[i];
  }
  for (var i = 0; i < user.models.length; i++) {
    hashUser[user.models[i].modelName] = user.models[i];
  }
});
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
      associations: [],
      infos: {}
    };
    field.name = complexItem.fields[i].name;
    fields.push(setUpFieldsAux(field, complexItem, i));
  });
    return fields;
  }
module.exports.models_structure = {
  getModels: function(){
    return models;
  },
  getUser: function(){
    return user;
  },
  getModelByName(name){
    var rootName = hashModels[name].inheritsFrom;
    var complexItem = {
      child: hashModels[name],
      root: models.defaults[rootName]
    }
    return complexItem;
  },
  getUserByName(name){
    var rootName = hashUser[name].inheritsFrom;
    var complexItem = {
      child: hashUser[name],
      root: user.defaults[rootName]
    }
    return complexItem;
  },
  getFields(name){
    var complexItem;
    if(name === 'user')
      complexItem = this.getUserByName(name);
    else
      complexItem = this.getModelByName(name);
    var fields = [];
    fields = prepareFields(fields, complexItem.root);
    fields = prepareFields(fields, complexItem.child);
    return fields;
  }
};
