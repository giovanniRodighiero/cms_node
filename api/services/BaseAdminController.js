"use strict";

var serialize = require('serialize-javascript');
function Base() {
	var auth = sails.config.authorization;
  // homepage admin
  this.index = function(r, res){
		return res.view('admins/index', {page:'index'});
  },
  this.getInfos = function(req, res){
		return res.json({data: serialize(sails.config.user.actions.find)});
	},
  this.permittedModels = function(req, res){
		var permittedModels = [];
		var models = Object.keys(sails.models);
		for (var i = 0; i < models.length; i++) {
			if(sails.config.authorization.authorize_controller(models[i], 'find', req.user)){
				permittedModels.push(models[i]);
			}
		}
		return res.ok(permittedModels);
	}
}

module.exports = Base;
