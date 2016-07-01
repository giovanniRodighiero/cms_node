var controllers = {


    user:{
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
    },

};
var models = {


    user:{
      find: function(record, user){
        return true;
      },
      findone: function(record, user){
        return true;
      },
      create: function(record, user){
        return true;
      },
      update: function(record, user){
        return true;
      },
      destroy: function(record, user){
        return true;
      }
    },

};
// module.exports.authorization = {
//   authorize_controller: function(controller, action, user){
//     var ctrl = controllers[controller];
//     if(action in ctrl)
//       return ctrl[action](user);
//     else
//       return ctrl.isAllowed(action, user);
//   },
//   authorize_resource: function(record, action, user){
//     var mdl = models[record.model];
//     if( action in mdl)
//       return mdl[action](record, user);
//     else
//       return false;
//   }
// }
