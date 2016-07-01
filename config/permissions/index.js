module.exports.authorization = {
  authorize_controller: function(controller, action, user){
    sails.log('dentro index '+controller + ' actions: '+action);
    var name = controller+'_actions';
    var ctrl = sails.config[controller];
    ctrl = ctrl.actions;
    if(action in ctrl){
      return ctrl[action](user);
    }
    else{
      return ctrl.isAllowed(action, user);
    }
  },
  authorize_resource: function(record, action, user){
    var mdl = models[record.model];
    mdl = mdl.resources;
    if( action in mdl)
      return mdl[action](record, user);
    else
      return false;
  }
}
