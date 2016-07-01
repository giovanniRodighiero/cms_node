/**
 * WebsiteController
 *
 * @description :: Server-side logic for managing websites
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	getWebsites: function(req, res){
		Website.find()
		.then(function(results){
			var myRes = {
				results: results,
				addInfo: 'ciao'
			}
			res.json(myRes);
		})
		.catch(function(err){
			res.negotiate(err);
		})
	}
};
