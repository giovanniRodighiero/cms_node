module.exports.user = {
  fields:{

      password: function(page, associatedModel , user){
        return (page === 'new' || page === 'account');
      },

      role: function(page, associatedModel , user){
        return true;
      },

      email: function(page, associatedModel , user){
        return true;
      },


      website: function(page, associatedModel , user){
        return true;
      },

      description: function(page, associatedModel , user){
        return true;
      },

  }
}
