var fs = require('fs');
var cp = require('child_process');

var done = false;
var modelsFile = fs.readFileSync('models.json');
var usersModelsFile = fs.readFileSync('user.json');

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
  var execSync = cp.execSync;
  execSync('sails generate AuthorizationBuilder --force');
}

makeApis(usersModelsFile);
console.log('Fine creazioni APIs users, inizio override modelli');
makeApis(modelsFile);
console.log('Fine creazioni APIs modelli, inizio override modelli');
makeModels(usersModelsFile, 'sails generate UserBuilder ');
console.log('Fine ridefinizione modelli users');
makeModels(modelsFile, 'sails generate ModelBuilder ');
console.log('Fine ridefinizione modelli normali');
makePermissions();
console.log('Fine definizione file permessi');
