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
  }
  
};
