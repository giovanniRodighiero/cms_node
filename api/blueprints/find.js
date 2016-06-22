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
  // blakclist dei parametri accettati
  _.set(req.options, 'criteria.blacklist', ['fields', 'populate', 'limit', 'skip', 'page', 'sort']);

  // const fields = req.param('fields') ? req.param('fields').replace(/ /g, '').split(',') : [];// off
  // const populate = req.param('populate') ? req.param('populate').replace(/ /g, '').split(',') : [];// off
  const Model = actionUtil.parseModel(req);
  // const where = actionUtil.parseCriteria(req);// off
  const limit = actionUtil.parseLimit(req);
  const skip = req.param('page') * limit || actionUtil.parseSkip(req);
  const sort = actionUtil.parseSort(req);

  // const query = Model.find(null, fields.length > 0 ? {select: fields} : null).where(where).limit(limit).skip(skip).sort(sort);
  // const findQuery = _.reduce(_.intersection(populate, takeAlias(Model.associations)), populateAlias, query);
  if(req.user)
    var query = Model.find().limit(limit).skip(skip).sort(sort);// mostro tutto
  else
    var query = Model.find({published: true}).limit(limit).skip(skip).sort(sort);// mando solo quello pubblicato
  const findQuery = _.reduce(_.intersection('', takeAlias(Model.associations)), populateAlias, query); // non popola nessuna associazione
  findQuery
    .then(function(records){
  			var myResult = {
  				results: records,
  				model: Model.identity,
  				start: skip,
          limit: limit,
          page: Math.floor(skip / limit)
  			}
        return res.ok(myResult);
    })
    .catch(res.negotiate);
};
