module.exports.authorization = {
  authorize_controller: function(controller, action, user){
    var ctrl = sails.config[controller];
    ctrl = ctrl.actions;
    console.log(controller, action, user);
    if(action in ctrl){
      return ctrl[action](user);
    }
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
