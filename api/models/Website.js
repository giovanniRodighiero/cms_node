module.exports = {
  attributes: {
    // base model fields


      name: {

          type:"string",

          required:true,

      },


    // custom fields

      users: {

          collection:"user",

          via:"website",

      },

      metadatas: {

          collection:"metadata",

          via:"website",

      },

  },
  findCustom: function(opts, callback){
      var pageIndex =  opts.skip ;
      var limit =  opts.limit;

    var totPages = Math.ceil(sails.config.counter.website/opts.limit);
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
  },
  afterCreate(destroyedRecords, next){
    sails.config.counter.website = sails.config.counter.website+1;
    next();
  },
  afterDestroy(destroyedRecords, next){
    sails.config.counter.website = sails.config.counter.website-1;
    next();
  }
};
