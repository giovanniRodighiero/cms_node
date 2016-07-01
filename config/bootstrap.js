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
  sails.log(counter);
  if(counter == modelsNumber)
    cb();
}
var counter = 0;
var modelsNumber = 3;
module.exports.bootstrap = function(cb) {
  var models = sails.config.models_structure.getModels().models;
  console.log(models);
  for (var i = 0; i < models.length; i++) {
    var aux = {
      model: models[i].modelName,
      fields: sails.config.models_structure.getFields(models[i].modelName)
    }
    sails.config.fields_helper[aux.model] = aux.fields;
  }
  sails.models.user.count().exec(function(err, count){
    sails.config.counter.user = count;
    counter++;
    callCB(cb);
  }),
  sails.models.website.count().exec(function(err, count){
    sails.config.counter.website = count;
    counter++;
    callCB(cb);
  }),
  sails.models.metadata.count().exec(function(err, count){
    sails.config.counter.metadata = count;
    counter++;
    callCB(cb);
  })
  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
};
