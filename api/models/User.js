"use strict";

module.exports = {
  attributes: {
    // base model fields
    
      password: {
        
          type:"string",
        
      },
    
      role: {
        
          type:"string",
        
          required:true,
        
      },
    
      email: {
        
          type:"email",
        
          required:true,
        
          unique:true,
        
      },
    
    // custom fields
    
    
    
    
      website: {
        model: "website"
      },
    
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
}
};
