module.exports.user = {
  actions:{
    find: function(user){
      return (user.role === 'superAdmin');
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
        // case expression:
        //
        //   break;
        default:
          return false;
      }
    }
  }
}