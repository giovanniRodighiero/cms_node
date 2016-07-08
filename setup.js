var fs = require('fs');
var cp = require('child_process');
var models_structure = require('./config/models_structure.js');
var fields_helper = require('./config/fields_helper.js');
var done = false;
var modelsFile = fs.readFileSync('customModels.json');
//var usersModelsFile = fs.readFileSync('user.json');

function firstToUpperCase( str ) {
  return str.substr(0, 1).toUpperCase() + str.substr(1);
}

function injectRoutes(modelsFile, filePath) {
  var models = JSON.parse(modelsFile).models;
  file = fs.readFileSync(filePath, 'utf-8');
  if(file != undefined){
    var text = '';
    for (var i = 0; i < models.length; i++) {
      var partial = '';

      partial = partial.concat('\n /******************* start '+models[i].modelName.toString()+'**********************/ \n');
      partial = partial.concat('\t \'get /admin/'+models[i].modelName.toString()+'\': \'admin/'+firstToUpperCase(models[i].modelName.toString())+'Controller.find\',\n');// index
      partial = partial.concat('\t \'get /admin/'+models[i].modelName.toString()+'/edit/:id\': \'admin/'+firstToUpperCase(models[i].modelName.toString())+'Controller.edit\',\n');// show
      partial = partial.concat('\t \'get /admin/'+models[i].modelName.toString()+'/:id\': \'admin/'+firstToUpperCase(models[i].modelName.toString())+'Controller.findOne\',\n');// show
      partial = partial.concat('\t \'post /admin/'+models[i].modelName.toString()+'\': \'admin/'+firstToUpperCase(models[i].modelName.toString())+'Controller.add\',\n');// create
      partial = partial.concat('\t \'put /admin/'+models[i].modelName.toString()+'/:id\': \'admin/'+firstToUpperCase(models[i].modelName.toString())+'Controller.edit\',\n');// edit
      partial = partial.concat('\t \'delete /admin/'+models[i].modelName.toString()+'/:id\': \'admin/'+firstToUpperCase(models[i].modelName.toString())+'Controller.destroy\',\n');// delete
      partial = partial.concat('\n /******************* end '+models[i].modelName.toString()+'**********************/ \n');
      text = text.concat(partial);
    }
    text = text.concat('// INJECT ROUTES');
    var result = file.replace(/\/\/ INJECT ROUTES/g, text);
    var newGenerator = fs.writeFileSync(filePath, result);
  }
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
injectRoutes(modelsFile, 'config/routes.js');
console.log('Fine injecting delle rotte');
