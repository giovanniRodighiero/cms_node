module.exports.user = {
  fields:{
    
      password: function(user){
        return true;
      },
    
      role: function(user){
        return true;
      },
    
      email: function(user){
        return true;
      },
    
    
      website: function(user){
        return true;
      },
    
      description: function(user){
        return true;
      },
    
  }
}
