/**
 * WebsiteController
 *
 * @description :: Server-side logic for managing websites
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	find: function(req, res){
		var aux = {
			page: 0,
			limit: 5
		};
		if(req.param('page'))
			aux.page = req.param('page');
		Website.findCustom(aux, function(err, results){
			if(err)
				return res.negotiate(err);
			else
				return res.json(results);
		})

	}
};
