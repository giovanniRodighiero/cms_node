"use strict";
var _ = require('lodash');
const actionUtil = require('sails/lib/hooks/blueprints/actionUtil');
const takeAliases = _.partial(_.map, _, item => item.alias);
const populateAliases = (model, alias) => model.populate(alias);

module.exports = (req, res, next) => {

  if(req.param('id') != undefined){
    var Model = req.options.controller;


    if(sails.models[Model]){
      Model = sails.models[Model];

      var query = Model.findOne({id: req.param('id')});
      const findQuery = _.reduce(takeAliases(Model.associations), populateAliases, query);
      findQuery
      .then(function(result){
        if(result){
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
      var aux = Model.split('/');
      var Model = sails.models[aux[1]];
      var query = Model.findOne({id: req.param('id')});
      const findQuery = _.reduce(takeAliases(Model.associations), populateAliases, query);
      findQuery
      .then(function(result){
        if(result){
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
