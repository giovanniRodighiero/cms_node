module.exports = {
  attributes: {
    // base model fields
  <% if(base){ %>
    <% for (index in base.fields){ %>
      <%= base.fields[index].name %>: {
        <% for(p in base.fields[index].params){ %>
          <%= base.fields[index].params[p].parName %>:<% if( base.fields[index].params[p].value === "true" || base.fields[index].params[p].value === "false" ) { %><%= base.fields[index].params[p].value %>,<% }else{ %>"<%= base.fields[index].params[p].value %>",<% } %>
        <% } %>
      },
    <% } %>
  <% } %>
    // custom fields
    <% for (index in model.fields){ %>
      <%= model.fields[index].name %>: {
        <% for(p in model.fields[index].params){ %>
          <%= model.fields[index].params[p].parName %>:<% if( model.fields[index].params[p].value === "true" || model.fields[index].params[p].value === "false" ) { %><%= model.fields[index].params[p].value %>,<% }else{ %>"<%= model.fields[index].params[p].value %>",<% } %>
        <% } %>
      },
    <% } %>
    <% for (index in model.associations.manyToMany){ %>
      <%= model.associations.manyToMany[index].fieldName %>: {
        collection: "<%= model.associations.manyToMany[index].collection %>",
        via: "<%= model.associations.manyToMany[index].via %>"
      },
    <% } %>
    <% for (index in model.associations.oneToMany){ %>
      <%= model.associations.oneToMany[index].fieldName %>: {
        collection: "<%= model.associations.oneToMany[index].collection %>",
        via: "<%= model.associations.oneToMany[index].via %>"
      },
    <% } %>
    <% for (index in model.associations.oneWay){ %>
      <%= model.associations.oneWay[index].fieldName %>: {
        model: "<%= model.associations.oneWay[index].model %>"
      },
    <% } %>
    <% for (index in model.associations.oneToOne){ %>
      <%= model.associations.oneToOne[index].fieldName %>: {
        model: "<%= model.associations.oneWay[index].model %>",
        unique: true
      },
    <% } %>
  }
};
