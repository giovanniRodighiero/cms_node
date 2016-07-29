"use strict";

const _ = require('lodash');
const actionUtil = require('sails/lib/hooks/blueprints/actionUtil');

/**
 * Create Record
 * POST /:model
 *
 * An API call to create and return a single model instance using the specified parameters.
 */
module.exports = (req, res) => {
  // checks authorization for create action
  if(! sails.config.authorization.authorize_controller(req.options.controller, 'create', req.user))
    return res.forbidden();
  const Model = actionUtil.parseModel(req);
  var values = actionUtil.parseValues(req);
  var permitted = [];
  // set up the permitted field to filter the payload
  var fields = sails.config.fields_helper.fieldsInfo[Model.identity].fields;
  for (var i = 0; i < fields.length; i++) {
    permitted.push(fields[i].name);
  }
  values = _.pick(values, permitted);
  Model
    .create(values)
    .then(function(created){
      _.assign(created, {'model': Model.identity});// add the model name to the payload
      if(AssetsService.hasAsset(Model.identity) && created[AssetsService.hasAsset(Model.identity)]){// if it has a file field, it needs to be processed
        var cuts = sails.config.services.assets.cuts;
        for (var i = 0; i < cuts[Model.identity].length; i++) {
          AssetsService.createCuts(created[AssetsService.hasAsset(Model.identity)], cuts[Model.identity][i].name ,cuts[Model.identity][i].width, cuts[Model.identity][i].height);
        }
      }
      return res.created(created);
    })
    .catch(function(err){
      return res.negotiate(err);
    });
};
