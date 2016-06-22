"use strict";

module.exports = {
  attributes: {
    // base model fields
    <% for (index in userBase.fields){ %>
      <%= userBase.fields[index].name %>: {
        <% for(p in userBase.fields[index].params){ %>
          <%= userBase.fields[index].params[p].parName %>:<% if( userBase.fields[index].params[p].value === "true" || userBase.fields[index].params[p].value === "false" ) { %><%= userBase.fields[index].params[p].value %>,<% }else{ %>"<%= userBase.fields[index].params[p].value %>",<% } %>
        <% } %>
      },
    <% } %>
    // custom fields
    <% for (index in userModel.fields){ %>
      <%= userModel.fields[index].name %>: {
        <% for(p in userModel.fields[index].params){ %>
          <%= userModel.fields[index].params[p].parName %>:<% if( userModel.fields[index].params[p].value === "true" || userModel.fields[index].params[p].value === "false" ) { %><%= userModel.fields[index].params[p].value %>,<% }else{ %>"<%= userModel.fields[index].params[p].value %>",<% } %>
        <% } %>
      },
    <% } %>
    <% for (index in userModel.associations.manyToMany){ %>
      <%= userModel.associations.manyToMany[index].fieldName %>: {
        collection: "<%= userModel.associations.manyToMany[index].collection %>",
        via: "<%= userModel.associations.manyToMany[index].via %>"
      },
    <% } %>
    <% for (index in userModel.associations.oneToMany){ %>
      <%= userModel.associations.oneToMany[index].fieldName %>: {
        collection: "<%= userModel.associations.oneToMany[index].collection %>",
        via: "<%= userModel.associations.oneToMany[index].via %>"
      },
    <% } %>
    <% for (index in userModel.associations.oneWay){ %>
      <%= userModel.associations.oneWay[index].fieldName %>: {
        model: "<%= userModel.associations.oneWay[index].model %>"
      },
    <% } %>
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
