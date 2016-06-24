"use strict";

// var basicInfo = {
// 	page: '',
// 	curr_user: '',
// 	models: sails.config.models_structure.getModels().models,
// 	user: sails.config.models_structure.getUser().models,
// 	authorize_controller: sails.config.authorization.authorize_controller
// };
function Base() {
  var fs = require('fs');
  var async = require('async');
	var auth = sails.config.authorization;
	var basicInfo = {};
  // homepage admin
  this.index = function(r, res){
		return res.view('index', {page:'index', basicInfo});
  },
  // user page
  this.user = function(req, res){
		if(auth.authorize_controller('user', 'find', req.user)){
			User.find()
			.then(function(results){
				return res.view('admins/user', {page: 'user', results});
			})
			.catch(function(err){
				return res.negotiate(err);
			})
		}else
			return res.view('401');
  }
}

//var base = new Base()

module.exports = Base;
