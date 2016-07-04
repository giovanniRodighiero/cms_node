module.exports.authorization = {
  authorize_controller: function(controller, action, user){
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
    var name = record.model+'_resources';
    var mdl = sails.config[record.model];
    mdl = mdl.resources;
    if( action in mdl)
      return mdl[action](record, user);
    else
      return false;
  },
  show_field: function(controller, fieldName, user){
    var name = controller+'_fields';
    res = mdl.resources;
    if(fieldName in res)
      return res[fieldName](record, user);
    else
      return false;
  }
}
