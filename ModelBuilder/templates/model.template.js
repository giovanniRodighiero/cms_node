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
  }
};
