module.exports.<%=customModel.modelName%> = {
  fields:{
    <% for (index in defaultModel.fields){ %>
      <%=defaultModel.fields[index].name%>: (function(page, associatedModel , user){
        return true;
      }),
    <% } %>
    <% for (index in customModel.fields){ %>
      <%=customModel.fields[index].name%>: (function(page, associatedModel , user){
        return true;
      }),
    <% } %>
  }
}
