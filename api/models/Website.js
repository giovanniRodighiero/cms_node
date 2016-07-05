"use strict";
module.exports = {
  attributes: {
    // base model fields

      name: {

          type:"string",

          required:true,

      },


      users: {

          collection:"user",

          via:"website",

      },

      metadatas: {

          collection:"metadata",

          via:"website",

      },

  },

  afterCreate(destroyedRecords, next){
    sails.models.website.count().exec(function(err, count){
      sails.config.counter.website = count;
      next();
    })
  },
  afterDestroy(destroyedRecords, next){
    sails.models.website.count().exec(function(err, count){
      sails.config.counter.website = count;
      next();
    })
  },
  findCustom: function(opts, callback){
    var pageIndex =  parseInt(opts.page);
    var limit =  opts.limit;
    var totPages = Math.ceil(sails.config.fields_helper.modelCount.website/opts.limit);

    Website.find().paginate({page: pageIndex, limit: limit})
    .then(function(results){
      var customResults = [];
      for (var i = 0; i < results.length; i++) {
        _.assign(results[i], {'model': 'website'});
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
