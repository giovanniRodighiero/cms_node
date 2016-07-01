"use strict";
module.exports = {
  attributes: {
    // base model fields
    
      password: {
        
          type:"string",
        
          required:true,
        
      },
    
      role: {
        
          type:"string",
        
          enum:"['admin','superAdmin']",
        
          required:true,
        
          defaultsTo:"admin",
        
      },
    
      email: {
        
          type:"email",
        
          required:true,
        
          unique:true,
        
      },
    
    
      website: {
        
          model:"website",
        
          required:true,
        
      },
    
  },

  afterCreate(destroyedRecords, next){
    sails.models.user.count().exec(function(err, count){
      sails.config.counter.user = count;
      next();
    })
  },
  afterDestroy(destroyedRecords, next){
    sails.models.user.count().exec(function(err, count){
      sails.config.counter.user = count;
      next();
    })
  }
  
    ,
    toJSON() {
      let obj = this.toObject();
      delete obj.password;
      return obj;
    },

  beforeUpdate(values, next) {
    if (false === values.hasOwnProperty('password')) return next();
    if (/^\$2[aby]\$[0-9]{2}\$.{53}$/.test(values.password)) return next();

    return HashService.bcrypt.hash(values.password)
      .then(hash => {
        values.password = hash;
        next();
      })
      .catch(next);
  },

  beforeCreate(values, next) {
    if (false === values.hasOwnProperty('password')) return next();

    return HashService.bcrypt.hash(values.password)
      .then(hash => {
        values.password = hash;
        next();
      })
      .catch(next);
  }
  
};
