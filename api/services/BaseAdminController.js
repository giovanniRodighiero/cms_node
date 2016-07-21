"use strict";

var serialize = require('serialize-javascript');


function setFields(model, action, field, item, user) {
	if(sails.config.authorization.show_field(model, action, model, field.name, user)){
		item.fields[action].push(field);
	}
	return item;
}
function setActions(item, model, user) {
	var actions = {};
	actions['find'] = 'list';
	actions['findone'] = 'show';
	actions['update'] = 'edit';
	actions['destroy'] = 'delete';
	for (var i = 0; i < Object.keys(actions).length; i++) {
		if(sails.config.authorization.authorize_controller(model,	Object.keys(actions)[i], user))
			item.actions.push(actions[Object.keys(actions)[i]]);
	}
	return item;
}
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
		var permittedModels = {};
		var originalModels = sails.config.models_structure.getModels();
		var models = [];
		for (var i = 0; i < originalModels.models.length; i++) {
			models.push(originalModels.models[i].modelName);
		}
		for (var i = 0; i < models.length; i++) {
			permittedModels[models[i]] = {
				actions: [], // has to be like ['show', 'edit', 'delete']
				fields: {}
			};
			var fieldsInfo = sails.config.fields_helper.fieldsInfo[models[i]].fields;
			var keys = Object.keys(fieldsInfo);
			permittedModels[models[i]] = setActions(permittedModels[models[i]], models[i], req.user);
			permittedModels[models[i]].fields['find'] = [];
			permittedModels[models[i]].fields['edit'] = [];
			permittedModels[models[i]].fields['findone'] = [];
			permittedModels[models[i]].fields['create'] = [];

			for (var j = 0; j < keys.length; j++) {
				permittedModels[models[i]] = setFields(models[i], 'find', fieldsInfo[keys[j]], permittedModels[models[i]], req.user);
				permittedModels[models[i]] = setFields(models[i], 'edit', fieldsInfo[keys[j]], permittedModels[models[i]], req.user);
				permittedModels[models[i]] = setFields(models[i], 'findone', fieldsInfo[keys[j]], permittedModels[models[i]], req.user);
				permittedModels[models[i]] = setFields(models[i], 'create', fieldsInfo[keys[j]], permittedModels[models[i]], req.user);
			}
			// if(sails.config.authorization.authorize_controller(models[i], 'find', req.user))
			// 	permittedModels[models[i]].find = sails.config.fields_helper.fieldsInfo[models[i]];
		}
		return res.ok(permittedModels);
	}
}

module.exports = Base;
