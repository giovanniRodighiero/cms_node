/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */
 var _ = require('lodash');
function callCB(cb) {
  if(counter == sails.config.fields_helper.modelList.length)
    cb();
};
function countModel(modelName, cb) {
  sails.config.fields_helper.modelCount = {};
  sails.models[modelName].count().exec(function(err, count){
    sails.config.fields_helper.modelCount[modelName] = count;
    counter++;
    callCB(cb);
  })
};
function setModelList() {
  sails.config.fields_helper.modelList = [];
  var models = sails.config.models_structure.getModels().models;
  for (var i = 0; i < models.length; i++) {
    sails.config.fields_helper.modelList.push(models[i].modelName);
  }
};
function setFields() {
 var models = sails.config.models_structure.getModels().models;
 sails.config.fields_helper.fieldsInfo = {};
 for (var i = 0; i < models.length; i++) {
   var aux = {
     model: models[i].modelName,
     fields: sails.config.models_structure.getFields(models[i].modelName)
   }
   sails.config.fields_helper.fieldsInfo[aux.model] = aux.fields;
 }
}
var counter = 0;
var modelsNumber = 3;

module.exports.bootstrap = function(cb) {
  setFields();
  setModelList();
  for (var i = 0; i < sails.config.fields_helper.modelList.length; i++) {
    countModel(sails.config.fields_helper.modelList[i], cb);
  }

  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
};
