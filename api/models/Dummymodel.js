"use strict";
var _ = require('lodash');
const actionUtil = require('sails/lib/hooks/blueprints/actionUtil');
const takeAliases = _.partial(_.map, _, item => item.alias);
const populateAliases = (model, alias) => model.populate(alias);

function isAssociation(fieldName) {
  var assoc = sails.models['dummymodel'].associations;
  for (var i = 0; i < assoc.length; i++) {
    if(assoc[i].alias === fieldName)
      return true;
  }
  return false;
}


module.exports = {
  attributes: {
    // base model fields


      news: {

          model:"news",

      },

      name: {

          type:"string",

      },

    toJSON: function() {
      for (var key in this.object) {
        if (typeof this.object[key] === 'function') {
          delete this.object[key];
        }
      }
      return this;
    }
  },

  afterCreate(destroyedRecords, next){
    sails.models.dummymodel.count().exec(function(err, count){
      sails.config.fields_helper.modelCount['dummymodel'] = count;
      next();
    })
  },
  afterDestroy(destroyedRecords, next){
    sails.models.dummymodel.count().exec(function(err, count){
      sails.config.fields_helper.modelCount['dummymodel'] = count;
      next();
    })
  },

  findCustom: function(opts, callback){
    var pageIndex =  parseInt(opts.page);
    var limit =  opts.limit;
    var totPages = Math.ceil(sails.config.fields_helper.modelCount['dummymodel']/opts.limit);
    if(opts.sortField && opts.sortDir && !isAssociation(opts.sortField)){
      var order = opts.sortField+' '+opts.sortDir;
      opts.query.sort = order;
    }
    opts.query.skip = (pageIndex - 1) * limit;
    opts.query.limit = limit;
    var query = sails.models['dummymodel'].find(opts.query);
    console.log('flag');
    const findQuery = _.reduce(takeAliases(sails.models['dummymodel'].associations), populateAliases, query);
  //  sails.models['dummymodel'].find(opts.query).paginate({page: pageIndex, limit: limit})
    findQuery
    .then(function(results){
      var customResults = [];
      for (var i = 0; i < results.length; i++) {
        _.assign(results[i], {'model': 'dummymodel'});
      }
      if(opts.user === undefined)
        for (var i = 0; i < sails.models['dummymodel'].associations.length; i++) {
          results = AssociationsService.cutNotWantedSingle(results, sails.models['dummymodel'].associations[i], 'published', true);
        }
      var myResult = {
        results: results,
        pageIndex: pageIndex,
        totPages: totPages
      }
      return callback(null, myResult);
    })
    .catch(function(err){
      return callback(err);
    });

  }
};
