module.exports.user = {
    actions:{
      find: function(user){
        return true;
      },
      findone: function(user){
        return true;
      },
      create: function(user){
        return true;
      },
      update: function(user){
        return true;
      },
      destroy: function(user){
        return true;
      },
      isAllowed: function(action, user){
        switch (action) {
          case 'new':
            if(user.role === 'superAdmin')
              return true;
            else
              return false;
          // case expression:
          //
          //   break;
          default:
            return false;
        }
      }
    }
}