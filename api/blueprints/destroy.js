"use strict";

const actionUtil = require('sails/lib/hooks/blueprints/actionUtil');
/**
 * Destroy One Record
 * DELETE /:model/:id
 *
 * Destroys the single model instance with the specified `id` from the data adapter for the given model if it exists.
 */

module.exports = (req, res) => {
  // check for authorization on the action
  if(! sails.config.authorization.authorize_controller(req.options.controller, 'destroy', req.user))
    return res.forbidden();
  // check for authorization on this resource
  if(!sails.config.authorization.authorize_resource(req.record, 'update', req.user))
    return res.forbidden();

  const Model = actionUtil.parseModel(req);
  const pk = actionUtil.requirePk(req);
  Model
    .destroy(pk)
    .then(function(destroyed){
      // delete the associated images if the model has a file type field
      if(AssetsService.hasAsset(Model.identity)){
        var infos = AssetsService.getAssetInfos(destroyed[0].url, '/');
        AssetsService.deleteAssets(infos.name);
      }
      return res.ok(destroyed);
    })
    .catch(function(err){
      return res.negotiate(err);
    });
};
