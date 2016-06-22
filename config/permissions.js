var controllers = {

    website:{
      find: function(user){
        return true;
      },
      findOne: function(user){
        return true;
      },
      create: function(user){
        return true;
      },
      update: function(user){
        return true;
      },
      delete: function(user){
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
    },

    metadata:{
      find: function(user){
        return true;
      },
      findOne: function(user){
        return true;
      },
      create: function(user){
        return true;
      },
      update: function(user){
        return true;
      },
      delete: function(user){
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
    },


    user:{
      find: function(user){
        return true;
      },
      findOne: function(user){
        return true;
      },
      create: function(user){
        return true;
      },
      update: function(user){
        return true;
      },
      delete: function(user){
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
    },

};
var models = {

    website:{
      find: function(record, user){
        return true;
      },
      findOne: function(record, user){
        return true;
      },
      create: function(record, user){
        return true;
      },
      update: function(record, user){
        return true;
      },
      delete: function(record, user){
        return true;
      }
    },

    metadata:{
      find: function(record, user){
        return true;
      },
      findOne: function(record, user){
        return true;
      },
      create: function(record, user){
        return true;
      },
      update: function(record, user){
        return true;
      },
      delete: function(record, user){
        return true;
      }
    },


    user:{
      find: function(record, user){
        return true;
      },
      findOne: function(record, user){
        return true;
      },
      create: function(record, user){
        return true;
      },
      update: function(record, user){
        return true;
      },
      delete: function(record, user){
        return true;
      }
    },

};
module.exports.authorization = {
  authorize_controller: function(controller, action, user){
    var ctrl = controllers[controller];
    if(action in ctrl)
      return ctrl[action](user);
    else
      return ctrl.isAllowed(action, user);
  },
  authorize_resource: function(record, action, user){
    var mdl = models[record.model];
    if( action in mdl)
      return mdl[action](record, user);
    else
      return false;
  }
}
