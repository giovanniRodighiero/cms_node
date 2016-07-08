module.exports.user = {
  fields:{
    
      password: function(page, user){
        return true;
      },
    
      role: function(page, user){
        return true;
      },
    
      email: function(page, user){
        return true;
      },
    
    
      website: function(page, user){
        return true;
      },
    
      description: function(page, user){
        return true;
      },
    
  }
}
