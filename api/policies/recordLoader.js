"use strict";
var _ = require('lodash');
const actionUtil = require('sails/lib/hooks/blueprints/actionUtil');

module.exports = (req, res, next) => {
  if(req.param('id')){
    var Model = req.options.controller;
    sails.log('dentro preloader');
    if(sails.models[Model]){
      Model = sails.models[Model];
      Model.findOne({id: req.param('id')})
      .then(function(result){
        if(result){
          var aux = _.assign(result, {'model': Model.identity});
          req.record = aux;
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
      Model.findOne({id: req.param('id')})
      .then(function(result){
        if(result){
          var aux = _.assign(result, {'model': Model.identity});
          req.record = aux;
        }else{
          ErrorService.handleError(req, res, sails.config.errors.NOT_FOUND, sails.config.errors.NOT_FOUND.message, 'danger','/admin/'+Model);
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
