module.exports = {
  attributes: {
    // base model fields


      path: {

          type:"string",

          required:true,

      },

      meta_title: {

          type:"string",

      },

      meta_descr: {

          type:"string",

      },

      published: {

          type:"boolean",

      },

      locale: {

          type:"string",

      },


    // custom fields

      website: {

          model:"website",
          required: true

      },

  },
  findCustom: function(opts, callback){
    var pageIndex =  opts.skip;
    var totPages = Math.ceil(sails.config.counter.metadata/opts.limit);
    Metadata.find().paginate({page: pageIndex, limit: opts.limit})
    .then(function(results){
      var customResults = [];
      for (var i = 0; i < results.length; i++) {
        _.assign(results[i], {'model': 'metadata'});
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
    sails.config.counter.metadata = sails.config.counter.metadata+1;
    next();
  },
  afterDestroy(destroyedRecords, next){
    sails.config.counter.metadata = sails.config.counter.metadata-1;
    next();
  }
};
