"use strict";

const _ = require('lodash');
const actionUtil = require('sails/lib/hooks/blueprints/actionUtil');

/**
 * Update One Record
 * PUT /:model/:id
 *
 * An API call to update a model instance with the specified `id`, treating the other unbound parameters as attributes.
 */
module.exports = (req, res) => {
  if(! sails.config.authorization.authorize_controller(req.options.controller, 'update', req.user))
    return res.unautorized();
  if(!sails.config.authorization.authorize_resource(req.record, 'update', req.user))
    return res.unautorized();

  const Model = actionUtil.parseModel(req);
  const pk = actionUtil.requirePk(req);
  var values = actionUtil.parseValues(req);
  var permitted = [];
  var fields = sails.config.fields_helper.fieldsInfo[Model.identity];
  for (var i = 0; i < fields.length; i++) {
    permitted.push(fields[i].name);
  }
  values = _.pick(values, permitted);


  Model
    .update(pk, values)
    .then(function(updated){
      _.assign(updated, {'model': Model.identity});
      return res.ok(updated);
    })
    .catch(function(err){
      return res.negotiate(err);
    });
};
