"use strict";

function Base() {
	var auth = sails.config.authorization;
  // homepage admin
  this.index = function(r, res){
		return res.view('admins/index', {page:'index'});
  },
  // user page
  this.user = function(req, res){
		if(auth.authorize_controller('user', 'find', req.user)){
			User.find()
			.then(function(results){
				return res.view('admins/user/index', {page: 'user', results});
			})
			.catch(function(err){
				return res.negotiate(err);
			})
		}else
			return res.view('401');
  }
}

module.exports = Base;
