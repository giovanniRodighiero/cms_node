/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var auth = sails.config.authorization;
module.exports = {
	find: function(req, res){
		if(auth.authorize_controller('user', 'find', req.user)){
			User.find()
			.then(function(results){
				return res.json(results);
			})
			.catch(function(err){
				return res.negotiate(err);
			})
		}else
			return res.redirect(401,'/index');
	},
	findOne: function(req, res){
		if(auth.authorize_controller('user', 'findone', req.user)){
			User.findOne({id: req.param('id')})
			.then(function(result){
				var myResult = {
  				result: result,
  				model: 'user'
  			}
				if(auth.authorize_resource(myResult, 'findone',req.user)){
					var myResult2 = {
						additionalInfo: 'my Additional Info',
						data: result
					}
					return res.json(myResult2);
				}else
					return res.json(myResult);
			})
			.catch(function(err){
				return res.negotiate(err);
			})
		}else
			return res.redirect(401,'/index');
	},
};
