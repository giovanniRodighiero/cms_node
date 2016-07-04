var fs = require('fs');
var cp = require('child_process');
var models_structure = require('./config/models_structure.js');
var fields_helper = require('./config/fields_helper.js');
var done = false;
var modelsFile = fs.readFileSync('customModels.json');
//var usersModelsFile = fs.readFileSync('user.json');


function test() {
fields_helper.fields_helper.test = models_structure.models_structure.getFields('website');
}

function makeApis(modelsFile) {
  var models = JSON.parse(modelsFile).models;
  var execSync = cp.execSync;
  var cmd = 'sails generate api ';
  for (var i = 0; i < models.length; i++) {
    var modelName = models[i].modelName;
    execSync(cmd+modelName+' --force');
  }
}


function makeModels(modelsFile, cmd) {
  var models = JSON.parse(modelsFile).models;
  var execSync = cp.execSync;
  for (var i = 0; i < models.length; i++) {
//  for (var i = 0; i < 2; i++) {
    execSync(cmd+i+' --force');
    console.log('redefinito modello '+i);
  }
}
function makePermissions() {
  var models = JSON.parse(modelsFile).models;
  var execSync = cp.execSync;
  for (var i = 0; i < models.length; i++) {
    execSync('sails generate AuthorizationBuilder '+i+' --force');
  }
}

makeApis(modelsFile);
console.log('Fine creazioni APIs, inizio override modelli');
makeModels(modelsFile, 'sails generate ModelBuilder ');
console.log('Fine ridefinizione modelli');
makePermissions();
console.log('Fine definizione file permessi');
