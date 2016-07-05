module.exports.user = {
  fields:{

      password: function(page, user){
        if(page === 'index')
          return false;
        else
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

  }
}
