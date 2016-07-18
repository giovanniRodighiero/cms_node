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
	}
}

module.exports = Base;
