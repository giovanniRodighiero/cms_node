"use strict";

const _ = require('lodash');
const actionUtil = require('sails/lib/hooks/blueprints/actionUtil');

const takeAliases = _.partial(_.map, _, item => item.alias);
const populateAliases = (model, alias) => model.populate(alias);

/**
 * Find One Record
 * GET /:model/:id
 *
 * An API call to find and return a single model instance from the data adapter using the specified id.
 */
module.exports = (req, res) => {
  // check for authorization on this action
  if(! sails.config.authorization.authorize_controller(req.options.controller, 'findone', req.user))
    return res.forbidden();
  // check for authorization on this resource
  if(!sails.config.authorization.authorize_resource(req.record, 'findone', req.user))
    return res.forbidden();
 // the record was preloaded in the 'recordLoader.js' policy  
  return res.ok(req.record);

  //_.set(req.options, 'criteria.blacklist', ['fields', 'populate', 'limit', 'skip', 'page', 'sort']);
  // const fields = req.param('fields') ? req.param('fields').replace(/ /g, '').split(',') : [];// off
  // const populate = req.param('populate') ? req.param('populate').replace(/ /g, '').split(',') : [];// off
  // const Model = actionUtil.parseModel(req);
  // const pk = actionUtil.requirePk(req);
  // // const query = Model.find(pk, fields.length > 0 ? {select: fields} : null);
  // // const findQuery = _.reduce(_.intersection(populate, takeAliases(Model.associations)), populateAliases, query);
  // const id = req.param('id');
  // const query = Model.findOne({id: id});
  // const findQuery = _.reduce(_.intersection('', takeAliases(Model.associations)), populateAliases, query);
  //
  // findQuery
  //   .then(function(result){
  //     if(sails.config.authorization.authorize_resources(req.options.controller, req.options.action, req.user))
  //     var myResult = {
  //       result: _.omit(result, 'password'),
  //     }
  //     return res.ok(myResult);
  //   })
  //   .catch(res.negotiate);

};
