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
  var file = req.file('file');
  if(file){
    file.upload({
      // don't allow the total upload size to exceed ~10MB
      maxBytes: 10000000
    },function whenDone(err, uploadedFiles) {
      if (err) {
        return res.negotiate(err);
      }
      // If no files were uploaded, respond with an error.
      if (uploadedFiles.length === 0){
        return res.badRequest('No file was uploaded');
      }
      // Save the "fd" and the url where the avatar for a user can be accessed
      Image.update(req.user.me, {

        // Generate a unique URL where the avatar can be downloaded.
        avatarUrl: require('util').format('%s/user/avatar/%s', sails.getBaseUrl(), req.session.me),

        // Grab the first file and use it's `fd` (file descriptor)
        avatarFd: uploadedFiles[0].fd
      })
      .exec(function (err){
        if (err) return res.negotiate(err);
        return res.ok();
      });
    });
  }

  Model
    .update(pk, permitted)
    .then(function(updated){
      _.assign(updated, {'model': Model.identity});
      return res.ok(updated);
    })
    .catch(function(err){
      return res.negotiate(err);
    });
};
