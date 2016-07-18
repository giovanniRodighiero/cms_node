"use strict";
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
    
    
      website: {
        
          model:"website",
        
          required:true,
        
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
    sails.models.metadata.count().exec(function(err, count){
      sails.config.fields_helper.modelCount['metadata'] = count;
      next();
    })
  },
  afterDestroy(destroyedRecords, next){
    sails.models.metadata.count().exec(function(err, count){
      sails.config.fields_helper.modelCount['metadata'] = count;
      next();
    })
  },
  
  findCustom: function(opts, callback){
    var pageIndex =  parseInt(opts.page);
    var limit =  opts.limit;
    var totPages = Math.ceil(sails.config.fields_helper.modelCount['metadata']/opts.limit);

    sails.models['metadata'].find(opts.query).paginate({page: pageIndex, limit: limit})
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
  }
};