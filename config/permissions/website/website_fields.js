module.exports.website = {
  fields:{
    
      name: function(page, associatedModel , user){
        return true;
      },
    
    
      users: function(page, associatedModel , user){
        return true;
      },
    
      metadatas: function(page, associatedModel , user){
        return true;
      },
    
  }
}
