/**
 * AdminController
 *
 * @description :: Server-side logic for managing Admins
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var fs = require('fs');
var async = require('async');
module.exports = {
	index: function(req, res){
		async.parallel([
			fs.readFile.bind(fs, 'models.json'),
			fs.readFile.bind(fs, 'user.json')
		],
		function(err, results){
			return res.view('index', {curr_user: req.user, models: JSON.parse(results[0]).models, user: JSON.parse(results[1]).models, authorize_controller: sails.config.authorization.authorize_controller });
		});
	}
};
