/**
 * MetadataController
 *
 * @description :: Server-side logic for managing metadatas
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	findByLoc: function(req, res){
		var limit = req.param('limit') || 100;
		var skip = req.param('page') || 0;
		var website =  1;
		if( ! sails.config.authorization.authorize_controller(req.options.controller, req.options.action, req.user))
			return res.unauthorized();
		Metadata.find({locale: req.param('locale'), published: true})
		.then(function(results){
			var myResult = {
				code: 200,
				message: "ok",
				data: results,
				model: 'metadata',
				skip: skip
			}
			//if( permissions.authorization.authorize_resource())
			return res.json(myResult);
		})
		.catch(function(err){
			return res.negotiate(err);
		})
	},
	findOneWithLoc: function(req, res){
		var limit = req.param('limit') || 100;
		var skip = req.param('page') || 0;
		var website =  1;
		var b = new Buffer(req.param('id'), 'base64');
		var path = b.toString();
		if(!sails.config.authorization.authorize_controller(req.options.controller, req.options.action, req.user))
			return res.unauthorized();
		Metadata.findOne({website: website, locale: req.param('locale'), path: path})
		.then(function(result){
			var myResult = {
				code: 200,
				message: "ok",
				data: result,
				model: 'metadata',
				skip: skip
			}
			return res.json(myResult);
		})
		.catch(function(err){
			return res.negotiate(err);
		});

	},
};
