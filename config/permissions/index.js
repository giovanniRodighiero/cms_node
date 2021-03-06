module.exports.authorization = {
  authorize_controller: (function(controller, action, user){
    var ctrl = sails.config[controller];
    ctrl = ctrl.actions;
    if(action in ctrl){
      return ctrl[action](user);
    }
    else{
      return ctrl.isAllowed(action, user);
    }
  }),
  authorize_resource: (function(record, action, user){
    var mdl = sails.config[record.model];
    mdl = mdl.resources;
    if( action in mdl)
      return mdl[action](record, user);
    else
      return false;
  }),
  show_field: (function(mainModel, page, associatedModel, fieldName, user){
    var res = sails.config[mainModel];
    res = res.fields;
    if(fieldName in res)
      return res[fieldName](page, associatedModel, user);
    else
      return false;
  })
}
