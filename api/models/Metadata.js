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
    
  },

  afterCreate(destroyedRecords, next){
    sails.models.metadata.count().exec(function(err, count){
      sails.config.counter.metadata = count;
      next();
    })
  },
  afterDestroy(destroyedRecords, next){
    sails.models.metadata.count().exec(function(err, count){
      sails.config.counter.metadata = count;
      next();
    })
  }
  
};
