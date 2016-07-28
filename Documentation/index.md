# Instructions
1. Configure the defaultsModels in the *defaultModels.json* file (see modelsConfig.md);
2. Configure the customModels in the *customModels.json* file (see modelsConfig.md);
3. Cofnigure the db credential in the `config/connections.js`;
4. Configure the environment's options in the `config/env/` folder, for development and production;
5. Run the command `node setup.js` (see setupScript.md);
6. Configure the permission's setting in the `config/permissions/` for each of your models (see permissions.md);
7. Configure the policies in the `config/policies.js` file to allow public api ( to add the first user for instance, see policies.md);
8. Run `sails lift` to start the app, default port is: `1337`


# Using the app
