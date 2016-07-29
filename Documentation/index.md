# Instructions
1. Configure the defaultsModels in the *defaultModels.json* file (see modelsConfig.md);
2. Configure the customModels in the *customModels.json* file (see modelsConfig.md);
3. Run the command `node setup.js` (see setupScript.md);
4. Cofnigure the db credential in the `config/connections.js`;
5. Configure the environment's options in the `config/env/` folder, for development and production;
6. Configure the permission's setting in the `config/permissions/` for each of your models (see permissions.md);
7. Configure the policies in the `config/policies.js` file to allow public api ( to add the first user for instance, see policies.md);
8. Configure the settings for the processing of images in the file `config/services/assets.js` (see imageProcessing.md);
9. Run `sails lift` to start the app, default port is: `1337`.


# How it works

## Server-side
Once you run the script `setup.js` the models are created with the values you set on the .json configuration files, then when you lift the app, the orm creates the tables and the app is ready.
At the startup of the app, a config object `sails.config.fields_helper` in created and populated with the infos collected from the .json files and processed to be more easy to use and access. This object is used in the entire app, especially in the front-end part, to correctly build the gui.
For each model a complete controller is already available through the [sails blueprints]("http://sailsjs.org/documentation/concepts/blueprints"), those have been overwritten and the source is visible at `api/blueprints`. Using this feature of sails, each api responds to rest-like url `/modelName`, for each request the policies you bound to the controllers are triggered and the request is processed with those logics. Then the permissions filters (which can be configured in the `config/permissions/` folder) are used to apply additional control over requests, also a check for handle file type field is performed and if it is the case the image uploaded is processed and the various cuts you configured are created.

###  Record count
In order to keep track of the number of the record actually inserted in the database, a property of `sails.config.fields_helper` is kept up to date with that count: at the bootrap of the app a `.Count()` query is run and the number of record initialized, this is updated every time an insertion or a delete is performed. In this way there's no need of running a `.Count()` query on every request supposed to return the list of all records of a model (`get /model`).

### Authentication
Authentication is set up through passportjs, the config is available in the file `passport.js`. It is possibile to log in using sessions or JWT token, the *ngAdmin* version use the last one, where the header use to pass the token must be like `header-name`:`authorization`,`header-content`:`JWT actual_token`.

## Client-side
The client side is based on angularjs, using the plugin [ngAdmin]("https://github.com/marmelab/ng-admin") to render the admin panel.
There are two angular app, one that handles the login, the other that handles all the actual gui that appears once the user is logged.
ngAdmin needs to be configured on the .config() function of the main module, that means all the infos needed to display the correct fields must be already fetched and usable from the server, in order to do that the angular app is bootstrapped manually once all the infos needed are ready and usable.
More in details, once the user is logged, the app send a request to the server to the url `/permittedModels`, the controller associated prepares and object which contains all the informations about a model, like which fields can be displayed in a certain page for a certain user. After that, the real app is started and the configuration can go on correctly using the informations just retrieved.
