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
    
      description: {
        
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
    sails.models.user.count().exec(function(err, count){
      sails.config.fields_helper.modelCount['user'] = count;
      next();
    })
  },
  afterDestroy(destroyedRecords, next){
    sails.models.user.count().exec(function(err, count){
      sails.config.fields_helper.modelCount['user'] = count;
      next();
    })
  },
  
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
  },
  
  findCustom: function(opts, callback){
    var pageIndex =  parseInt(opts.page);
    var limit =  opts.limit;
    var totPages = Math.ceil(sails.config.fields_helper.modelCount['user']/opts.limit);

    sails.models['user'].find(opts.query).paginate({page: pageIndex, limit: limit})
    .then(function(results){
      var customResults = [];
      for (var i = 0; i < results.length; i++) {
        _.assign(results[i], {'model': 'user'});
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
