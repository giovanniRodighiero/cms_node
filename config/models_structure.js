var fs = require('fs');
var async = require('async');

var models;
var user;
var hashModels = {};
var hashUser = {};
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
module.exports.models_structure = {
  getModels: function(){
    return models;
  },
  getUser: function(){
    return user;
  },
  getModelByName(name){
    return hashModels[name];
  },
  getUserByName(name){
    var rootName = hashUser[name].inheritsFrom;
    var complexItem = {
      child: hashUser[name],
      root: user.defaults[rootName]
    }
    //sails.log(complexItem);
    return complexItem;
  }
};
