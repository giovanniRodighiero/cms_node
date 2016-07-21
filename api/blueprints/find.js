"use strict";

const _ = require('lodash');
const actionUtil = require('sails/lib/hooks/blueprints/actionUtil');

const takeAlias = _.partial(_.map, _, item => item.alias);
const populateAlias = (model, alias) => model.populate(alias);

/**
 * Find Records
 * GET /:model
 *
 * An API call to find and return model instances from the data adapter using the specified criteria.
 * If an id was specified, just the instance with that unique id will be returned.
 */
module.exports = (req, res) => {
  if(! sails.config.authorization.authorize_controller(req.options.controller, 'find', req.user))
    return res.forbidden();
  // blakclist dei parametri accettati
  _.set(req.options, 'criteria.blacklist', ['fields', 'populate', 'limit', 'skip', 'page', 'sort']);
  // const fields = req.param('fields') ? req.param('fields').replace(/ /g, '').split(',') : [];// off
  // const populate = req.param('populate') ? req.param('populate').replace(/ /g, '').split(',') : [];// off
  const Model = actionUtil.parseModel(req);
  // const where = actionUtil.parseCriteria(req);// off
  var params = {
    page: 1,
    limit: 5,
    query: {}
    // sort
  };
  if(req.param('limit'))
    params.limit = parseInt(req.param('limit'));
  if(req.param('page'))
    params.page = parseInt(req.param('page'));

  var permitted = sails.config.fields_helper.fieldsInfo[Model.identity].searchableFields;
  var allParams = req.allParams();
  var filteredParams = _.pick(allParams, permitted);
  var keys = Object.keys(filteredParams);
  var convertedQuery = {};
  for (var i = 0; i < keys.length; i++) {
    convertedQuery[keys[i]] = {'contains': filteredParams[keys[i]]};
  }
  params.query = convertedQuery;
  //params.published
  // var query = Model.find(convertedQuery);
  // const findQuery = _.reduce(_.intersection('', takeAlias(Model.associations)), populateAlias, query); // non popola nessuna associazione
  var totPages = Math.ceil(sails.config.fields_helper.modelCount[Model.identity]/params.limit);

  res.set('X-Total-Count',sails.config.fields_helper.modelCount[Model.identity]);
  Model.findCustom(params, function(err, results){
    if(err)
      return res.negotiate(err);
    else
      return res.ok(results);
    });
  };
