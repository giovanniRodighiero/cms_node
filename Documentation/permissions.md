# Permissions config files
To customize the behaviour of the app on authorization of resources and field visibility you have to edit the following files for each model:
* `config/permissions/modelName/modelname_actions.js`
* `config/permissions/modelName/modelname_resources.js`
* `config/permissions/modelName/modelname_fields.js`

The first one **`modelname_actions`** map the authorization on the controller's action, for each of those there's a function that takes the infos of the user who made the request (that could be `undefined` if no user is logged) as argument and return true or false.

The second one **`modelname_resources`** map the authorization on the controller's action for a specific resource, in fact this time to the functions a second argument is also passed, this identifies the resource requested. This kind of control could be used to prevent a user to access some specific records of a collection, rather then deny the access to all of them.

The third one **`modelname_fields`** map the visibility of a field in a specific page, for a specific user. More in details in each function you have info on which page is the current displayed, the pages are currently listed as `['find','findone','edit','create']`; to the info of the user who made the request (as the previous two); the third parameter is actually not used in the ngAdmin version of the app, due to complexity of the creation of the permission object that has to be send to the client to render the gui correctly.
