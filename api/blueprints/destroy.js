"use strict";

const actionUtil = require('sails/lib/hooks/blueprints/actionUtil');
var fs = require('fs');
/**
 * Destroy One Record
 * DELETE /:model/:id
 *
 * Destroys the single model instance with the specified `id` from the data adapter for the given model if it exists.
 */

module.exports = (req, res) => {
  if(! sails.config.authorization.authorize_controller(req.options.controller, 'destroy', req.user))
    return res.forbidden();
  if(!sails.config.authorization.authorize_resource(req.record, 'update', req.user))
    return res.forbidden();

  const Model = actionUtil.parseModel(req);
  const pk = actionUtil.requirePk(req);
  Model
    .destroy(pk)
    .then(function(destroyed){
      if(AssetsService.hasAsset(Model.identity))
        AssetsService.deleteAssets(destroyed[0].url);
      return res.ok(destroyed);
    })
    .catch(function(err){
      return res.negotiate(err);
    });
};
