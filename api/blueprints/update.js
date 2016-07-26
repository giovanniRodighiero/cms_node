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
    return res.forbidden();
  if(!sails.config.authorization.authorize_resource(req.record, 'update', req.user))
    return res.forbidden();

  const Model = actionUtil.parseModel(req);
  const pk = actionUtil.requirePk(req);
  var values = actionUtil.parseValues(req);
  var permitted = [];
  var fields = sails.config.fields_helper.fieldsInfo[Model.identity];
  for (var i = 0; i < fields.length; i++) {
    permitted.push(fields[i].name);
  }
  var notAllowed = _.without(values, permitted);
  var permitted = _.pull(values, notAllowed);
  //values = _.pick(values, permitted);

  Model
    .update(pk, permitted)
    .then(function(updated){
      _.assign(updated, {'model': Model.identity});
      if(AssetsService.hasAsset(Model.identity) && (req.record.url != updated[0].url)){
        var infos = AssetsService.getAssetInfos(req.record.url, '/');
        AssetsService.deleteAssets(infos.name);
        var cuts = sails.config.services.assets.cuts;
        for (var i = 0; i < cuts.length; i++) {
          AssetsService.createCuts(updated[0][AssetsService.hasAsset(Model.identity)], cuts[i].name ,cuts[i].width, cuts[i].height);
        }
      }
      return res.ok(updated);
    })
    .catch(function(err){
      return res.negotiate(err);
    });
};
