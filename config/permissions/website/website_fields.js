module.exports.website = {
  fields:{

      name: function(page, user){
        return true;
      },


      users: function(page, user){
        if(page === 'index')
          return false;
        else
          return true;
      },

      metadatas: function(page, user){
        if(page === 'index')
          return false;
        else
          return true;
      },

  }
}
