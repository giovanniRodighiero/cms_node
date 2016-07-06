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

  'get /admin/user': 'admin/UserController.find',
  'get /admin/user/new': 'admin/UserController.new',
  'get /admin/user/edit/:id': 'admin/UserController.edit',
  'post /admin/user': 'admin/UserController.create',
  'put /admin/user/:id': 'admin/UserController.update',
  'delete /admin/user/:id': 'admin/UserController.destroy',

  'get /admin/metadata': 'admin/MetadataController.find',
  'get /admin/metadata/new': 'admin/MetadataController.new',
  'get /admin/metadata/:id': 'admin/MetadataController.findOne',
  'post /admin/metadata': 'admin/MetadataController.create',
  'put /admin/metadata/:id': 'admin/MetadataController.update',
  'delete /admin/metadata/:id': 'admin/MetadataController.destroy',


  'get /admin/website': 'admin/WebsiteController.find',
  'get /admin/website/new': 'admin/WebsiteController.new',
  'get /admin/website/:id': 'admin/WebsiteController.findOne',
  'post /admin/website': 'admin/WebsiteController.create',
  'put /admin/website/:id': 'admin/WebsiteController.update',
  'delete /admin/website/:id': 'admin/WebsiteController.destroy',

  'get /admin/account/:id': 'admin/UserController.findOne',

  'get /:locale/metadata':'MetadataController.findByLoc',
  'get /:locale/metadata/:id':'MetadataController.findOneWithLoc'
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
