/**
 * AdminController
 *
 * @description :: Server-side logic for managing Admins
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
"use strict";
var Base = require('../services/BaseAdminController');
function MyAdminController() {

}

var aux = MyAdminController.prototype = new Base();


module.exports = aux;









// module.exports = {
// 	index: function(req, res){
// 		BaseAdminController.BaseAdminController.index(req, res);
// 	},
// 	// index: function(req, res){
// 	// 	basicInfoo.page = 'index';
// 	// 	basicInfoo.curr_user = req.user;
// 	// 	sails.log(basicInfoo.authorize_controller);
// 	// 	return res.view('index', {basicInfo: basicInfoo});
// 	// },
// 	user: function(req, res){
// 		var curr_page = sails.config.models_structure.getUserByName('user');
// 		if(auth.authorize_controller('user', 'find', req.user)){
// 			User.find()
// 			.then(function(results){
// 				sails.log(results);
// 				return res.view('admins/user', {page: 'user', curr_user: req.user, models: sails.config.models_structure.getModels().models, user: sails.config.models_structure.getUser().models, authorize_controller: sails.config.authorization.authorize_controller, curr_page: curr_page, results});
// 			})
// 			.catch(function(err){
// 				return res.negotiate(err);
// 			})
// 		}else
// 			return res.redirect(401,'/index');
// 	}
// };
