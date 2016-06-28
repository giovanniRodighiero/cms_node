"use strict";
var _ = require('lodash');
const actionUtil = require('sails/lib/hooks/blueprints/actionUtil');

module.exports = (req, res, next) => {
  if(req.param('id')){
    var Model = req.options.controller;
    if(sails.models[Model]){
      Model = sails.models[Model];
      Model.findOne({id: req.param('id')})
      .then(function(result){
        req.record = result;
        //req.record.model = Model;
        return next();
      })
      .catch(function(err){
        ErrorService.handleError(req, res, sails.config.errors.NOT_FOUND, sails.config.errors.NOT_FOUND.message, 'danger','/admin/'+Model);
      })
    }else {
      var aux = Model.split('/');
      var Model = sails.models[aux[1]];
      Model.findOne({id: req.param('id')})
      .then(function(result){
         var aux = _.assign(result, {'model': Model.identity});
         req.record = aux;
        return next();
      })
      .catch(function(err){
        ErrorService.handleError(req, res, sails.config.errors.NOT_FOUND, sails.config.errors.NOT_FOUND.message, 'danger','/admin/'+Model.identity);
      })
    }
  }else{
    next();
  }
};
