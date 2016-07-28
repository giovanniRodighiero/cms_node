# Setup.js script
This script launches the generators for building up the models and controllers correctly, and also injects the routes for server-side admin panel.

## Functions executed
1. first of all the sails' api generator is called once per each model defined, so a `Model.js`, `ModelController.js` and the default routes are bound.
 [sails doc for api generator]("http://sailsjs.org/documentation/reference/command-line-interface/sails-generate").
 [sails doc for blueprints]("http://sailsjs.org/documentation/reference/blueprint-api").
2. the the Model.js created is overwritten by another generator which uses the property listed in the file *customModels.json* and *defaultModels.json* and add some other useful functions.
3. config files for authorization on resource and fields visibility are created and set on true by default, that means all user logged in can see all models and all their fields. To change this behaviour simply edit those files located at `config/permissions/_model_name`.  
4. the last function injects the routes used to bind the server-side admin panel made through jade. If you are using the ngAdmin version you can comment `injectRoutes(modelsFile, 'config/routes.js')` line.
