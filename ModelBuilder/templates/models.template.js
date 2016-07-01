"use strict";
module.exports = {
  attributes: {
    // base model fields
    <% for (index in defaultModel.fields){ %>
      <%= defaultModel.fields[index].name %>: {
        <% for(p in defaultModel.fields[index].params){ %>
          <%= defaultModel.fields[index].params[p].parName %>:<% if( defaultModel.fields[index].params[p].value === "true" || defaultModel.fields[index].params[p].value === "false" ) { %><%= defaultModel.fields[index].params[p].value %>,<% }else{ %>"<%= defaultModel.fields[index].params[p].value %>",<% } %>
        <% } %>
      },
    <% } %>
    <% for (index in customModel.fields){ %>
      <%= customModel.fields[index].name %>: {
        <% for(p in customModel.fields[index].params){ %>
          <%= customModel.fields[index].params[p].parName %>:<% if( customModel.fields[index].params[p].value === "true" || customModel.fields[index].params[p].value === "false" ) { %><%= customModel.fields[index].params[p].value %>,<% }else{ %>"<%= customModel.fields[index].params[p].value %>",<% } %>
        <% } %>
      },
    <% } %>
  },

  afterCreate(destroyedRecords, next){
    sails.models.<%=modelNameLow%>.count().exec(function(err, count){
      sails.config.counter.<%=modelNameLow%> = count;
      next();
    })
  },
  afterDestroy(destroyedRecords, next){
    sails.models.<%=modelNameLow%>.count().exec(function(err, count){
      sails.config.counter.<%=modelNameLow%> = count;
      next();
    })
  }
  <% if(modelNameLow === 'user'){ %>
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
  <% } %>
};