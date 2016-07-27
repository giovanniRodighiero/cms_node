var fs = require('fs');
var cp = require('child_process');
var models_structure = require('./config/models_structure.js');
var fields_helper = require('./config/fields_helper.js');
var done = false;
var modelsFile = fs.readFileSync('customModels.json');
//var usersModelsFile = fs.readFileSync('user.json');

// put first letter to upperCase
function firstToUpperCase( str ) {
  return str.substr(0, 1).toUpperCase() + str.substr(1);
}

// inject the routes needed to use the jade server-side templates and the admin panel made with them ( admin/action )
function injectRoutes(modelsFile, filePath) {
  var models = JSON.parse(modelsFile).models;
  file = fs.readFileSync(filePath, 'utf-8');
  if(file != undefined){
    var text = '';
    for (var i = 0; i < models.length; i++) {
      var partial = '';

      partial = partial.concat('\n /******************* start '+models[i].modelName.toString()+'**********************/ \n');
      partial = partial.concat('\t \'get /admin/'+models[i].modelName.toString()+'\': \'admin/'+firstToUpperCase(models[i].modelName.toString())+'Controller.find\',\n');// index

      partial = partial.concat('\t \'get /admin/'+models[i].modelName.toString()+'/edit/:id\': \'admin/'+firstToUpperCase(models[i].modelName.toString())+'Controller.edit\',\n');// edit

      partial = partial.concat('\t \'get /admin/'+models[i].modelName.toString()+'/new\': \'admin/'+firstToUpperCase(models[i].modelName.toString())+'Controller.new\',\n');// new

      partial = partial.concat('\t \'get /admin/'+models[i].modelName.toString()+'/:id\': \'admin/'+firstToUpperCase(models[i].modelName.toString())+'Controller.findOne\',\n');// show

      partial = partial.concat('\t \'post /admin/'+models[i].modelName.toString()+'\': \'admin/'+firstToUpperCase(models[i].modelName.toString())+'Controller.create\',\n');// create

      partial = partial.concat('\t \'put /admin/'+models[i].modelName.toString()+'/:id\': \'admin/'+firstToUpperCase(models[i].modelName.toString())+'Controller.update\',\n');// edit

      partial = partial.concat('\t \'delete /admin/'+models[i].modelName.toString()+'/:id\': \'admin/'+firstToUpperCase(models[i].modelName.toString())+'Controller.destroy\',\n');// delete
      partial = partial.concat('\n /******************* end '+models[i].modelName.toString()+'**********************/ \n');
      text = text.concat(partial);
    }
    text = text.concat('// INJECT ROUTES');
    var result = file.replace(/\/\/ INJECT ROUTES/g, text);
    var newGenerator = fs.writeFileSync(filePath, result);
  }
}
// run the sails generator to build the apis: model, controller and routes with blueprints action are created after that.
function makeApis(modelsFile) {
  var models = JSON.parse(modelsFile).models;
  var execSync = cp.execSync;
  var cmd = 'sails generate api ';
  for (var i = 0; i < models.length; i++) {
    var modelName = models[i].modelName;
    execSync(cmd+modelName+' --force');
  }
}

// redefine the models files with the infos collected from the config files (defaultModels.json and customModels.json)
function makeModels(modelsFile, cmd) {
  var models = JSON.parse(modelsFile).models;
  var execSync = cp.execSync;
  for (var i = 0; i < models.length; i++) {
//  for (var i = 0; i < 2; i++) {
    execSync(cmd+i+' --force');
    console.log('redefinito modello '+i);
  }
}
// build the folders and the files needed to configure the visibility of the fields and the permissions function for resource/action authrorization
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
//injectRoutes(modelsFile, 'config/routes.js');
//console.log('Fine injecting delle rotte');
