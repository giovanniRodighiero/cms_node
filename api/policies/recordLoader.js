"use strict";
var _ = require('lodash');
const actionUtil = require('sails/lib/hooks/blueprints/actionUtil');
const takeAliases = _.partial(_.map, _, item => item.alias);
const populateAliases = (model, alias) => model.populate(alias);

module.exports = (req, res, next) => {

  if(req.param('id')){
    var Model = req.options.controller;

    if(sails.models[Model]){
      Model = sails.models[Model];
      var associations = Model.associations;

      var query = Model.findOne({id: req.param('id')});
      const findQuery = _.reduce(takeAliases(Model.associations), populateAliases, query);
      findQuery
      .then(function(result){
        if(result){
          for (var i = 0; i < associations.length; i++) {
            var modelIdentity = '';
            if(associations[i].model)
              modelIdentity = associations[i].model;
            if(associations[i].collection)
              modelIdentity = associations[i].collection;
            _.assign(result[associations[i].alias], {'model': modelIdentity});
          }
          var aux = _.assign(result, {'model': Model.identity});
          req.record = _.omit(aux, 'password');
        }else{
          ErrorService.handleError(req, res, sails.config.errors.NOT_FOUND, sails.config.errors.NOT_FOUND.message, 'danger','/admin/'+Model);
        }
        return next();
      })
      .catch(function(err){
        ErrorService.handleError(req, res, sails.config.errors.SERVER_ERROR, sails.config.errors.SERVER_ERROR.message, 'danger','/admin/'+Model);
      })
    }else{
      var aux = Model.split('/', 2);
      var Model = sails.models[aux[1]];
      var associations = Model.associations;
      var query = Model.findOne({id: req.param('id')});
      const findQuery = _.reduce(takeAliases(Model.associations), populateAliases, query);
      findQuery
      .then(function(result){
        if(result){
          for (var i = 0; i < associations.length; i++) {
            if(!associations[i])
              continue;
            var modelIdentity = '';
            if(associations[i].model)
              modelIdentity = associations[i].model;
            if(associations[i].collection)
              modelIdentity = associations[i].collection;
            for (var j = 0; j < result[associations[i].alias].length; j++) {
              result[associations[i].alias][j] = _.assign(result[associations[i].alias][j], {'model': modelIdentity});
            }
          }
          var aux = _.assign(result, {'model': Model.identity});
          req.record = _.omit(aux, 'password');
        }else{
          ErrorService.handleError(req, res, sails.config.errors.NOT_FOUND, sails.config.errors.NOT_FOUND.message, 'danger','/admin/'+Model.identity);
        }
        return next();
      })
      .catch(function(err){
        ErrorService.handleError(req, res, sails.config.errors.SERVER_ERROR, sails.config.errors.SERVER_ERROR.message, 'danger','/admin/'+Model.identity);
      })
    }
  }else{
    next();
  }
};
