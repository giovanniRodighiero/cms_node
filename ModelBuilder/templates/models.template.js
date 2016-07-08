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
      sails.config.fields_helper.modelCount['<%=modelNameLow%>'] = count;
      next();
    })
  },
  afterDestroy(destroyedRecords, next){
    sails.models.<%=modelNameLow%>.count().exec(function(err, count){
      sails.config.fields_helper.modelCount['<%=modelNameLow%>'] = count;
      next();
    })
  },
  <% if(modelNameLow === 'user'){ %>
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
  <% } %>
  findCustom: function(opts, callback){
    var pageIndex =  parseInt(opts.page);
    var limit =  opts.limit;
    var totPages = Math.ceil(sails.config.fields_helper.modelCount['<%=modelNameLow%>']/opts.limit);

    sails.models['<%=modelNameLow%>'].find(opts.query).paginate({page: pageIndex, limit: limit})
    .then(function(results){
      var customResults = [];
      for (var i = 0; i < results.length; i++) {
        _.assign(results[i], {'model': '<%=modelNameLow%>'});
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
