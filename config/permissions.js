var controllers = {

    website:{
      find: function(user){
        return true;
      },
      findone: function(user){
        return true;
      },
      create: function(user){
        return (user.role === 'superAdmin');
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

    metadata:{
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
            return true;
            break;
          case 'findbyloc':
            return true;
            break;
          case 'findonewithloc':
            return true;
            break;
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
        if(user.role === 'superAdmin')
          return true;
        else
          return false;
      },
      findone: function(user){
        return true;
      },
      create: function(user){
        return (user.role === 'superAdmin');
      },
      update: function(user){
        return true;
      },
      destroy: function(user){
        return (user.role === 'superAdmin');
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

    website:{
      find: function(record, user){
        return (user.role === 'superAdmin' || record.id == user.website);
      },
      findone: function(record, user){
        return (user.role === 'superAdmin' || record.id == user.website);
      },
      create: function(record, user){
        return (user.role === 'superAdmin');
      },
      update: function(record, user){
        return (user.role === 'superAdmin' || record.id == user.website);
      },
      destroy: function(record, user){
        if(user.role === 'superAdmin')
          return true;
        else
          return false;
      }
    },

    metadata:{
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


    user:{
      find: function(record, user){
        return true;
      },
      findone: function(record, user){
        return (record.id == user.id || user.role === 'superAdmin');
      },
      create: function(record, user){
        return true;
      },
      update: function(record, user){
        return (record.id == user.id || user.role === 'superAdmin');
      },
      destroy: function(record, user){
        return (user.role === 'superAdmin');
      }
    },

};

var fields = {
  website:{

  },
  metadata:{

  },
  user:{
    password: function(user){
      return false;
    }
  }
}
module.exports.authorization = {
  authorize_controller: function(controller, action, user){
    var ctrl = controllers[controller];
    if(action in ctrl)
      return ctrl[action](user);
    else
      return ctrl.isAllowed(action, user);
  },
  authorize_resource: function(model, action, user){
    var mdl = models[model.model];
    if( action in mdl)
      return mdl[action](model, user);
    else
      return true;
  },
  authorize_field: function(model, field, user){
    var fld = fields[model];
    if( field in fld)
      return fld[field](user);
    else
      return true;
  }
}
