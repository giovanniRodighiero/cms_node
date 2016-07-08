/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
  * etc. depending on your default view engine) your home page.              *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/
  '/homeLoggato':'/admin',

  '/': {
    view: 'home'
  },
  'get /myApy/websites': 'WebsiteController.getWebsites',

  'post /signin':'AuthController.signin',
  'get /signout':'AuthController.signout',
  'get /admin': 'AdminController.index',


 /******************* start user**********************/ 
	 'get /admin/user': 'admin/UserController.find',
	 'get /admin/user/edit/:id': 'admin/UserController.edit',
	 'get /admin/user/:id': 'admin/UserController.findOne',
	 'post /admin/user': 'admin/UserController.add',
	 'put /admin/user/:id': 'admin/UserController.edit',
	 'delete /admin/user/:id': 'admin/UserController.destroy',

 /******************* end user**********************/ 

 /******************* start website**********************/ 
	 'get /admin/website': 'admin/WebsiteController.find',
	 'get /admin/website/edit/:id': 'admin/WebsiteController.edit',
	 'get /admin/website/:id': 'admin/WebsiteController.findOne',
	 'post /admin/website': 'admin/WebsiteController.add',
	 'put /admin/website/:id': 'admin/WebsiteController.edit',
	 'delete /admin/website/:id': 'admin/WebsiteController.destroy',

 /******************* end website**********************/ 

 /******************* start metadata**********************/ 
	 'get /admin/metadata': 'admin/MetadataController.find',
	 'get /admin/metadata/edit/:id': 'admin/MetadataController.edit',
	 'get /admin/metadata/:id': 'admin/MetadataController.findOne',
	 'post /admin/metadata': 'admin/MetadataController.add',
	 'put /admin/metadata/:id': 'admin/MetadataController.edit',
	 'delete /admin/metadata/:id': 'admin/MetadataController.destroy',

 /******************* end metadata**********************/ 
// INJECT ROUTES


  /***************************************************************************
  *                                                                          *
  * Custom routes here...                                                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the custom routes above, it   *
  * is matched against Sails route blueprints. See `config/blueprints.js`    *
  * for configuration options and examples.                                  *
  *                                                                          *
  ***************************************************************************/


};
