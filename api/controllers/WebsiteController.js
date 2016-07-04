/**
 * WebsiteController
 *
 * @description :: Server-side logic for managing websites
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	findCustom: function(req, res){
		var page = req.param('page') || 0;
		var limit = 5;
		Website.find().paginate({page: page, limit: limit})
		.then(function(results){
			var myResult
			_.assignIn
		})
		.catch(function(err){

		});
	}
};
