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
  if(! sails.config.authorization.authorize_controller(req.options.controller, 'create', req.user))
    return res.unauthorized();
  const Model = actionUtil.parseModel(req);
  var values = actionUtil.parseValues(req);
  var permitted = [];
  var fields = sails.config.fields_helper.fieldsInfo[Model.identity].fields;
  for (var i = 0; i < fields.length; i++) {
    permitted.push(fields[i].name);
  }
  values = _.pick(values, permitted);
  Model
    .create(values)
    .then(function(created){
      _.assign(created, {'model': Model.identity});
      return res.created(created);
    })
    .catch(function(err){
      return res.negotiate(err);
    });
};
