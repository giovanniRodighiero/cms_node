"use strict";

function setUpPermitted(payloadO, fields) {
  var result = {
    permitted: [],
    labels: {},
    payload: payloadO
  };
  for (var i = 0; i < fields.length; i++) {
    if(fields[i].association && payloadO[fields[i].name]){
      var aux = payloadO[fields[i].name].split(',');
      result.payload[fields[i].name] = aux[0];
      result.labels[fields[i].name] = aux[1];
    }
    result.permitted.push(fields[i].name);
  }
  return result;
};
function setUpLabel(labels, item) {
  for (var i = 0; i < Object.keys(labels).length; i++) {
     var old = item[Object.keys(labels)[i]];
     var aux = {};
    item[Object.keys(labels)[i]] = _.assign(aux, { id: item[Object.keys(labels)[i]], name :labels[Object.keys(labels)[i]]});
  }
  return item;
};
var auth = sails.config.authorization;
module.exports = {
  find: function(req, res){
    if(!auth.authorize_controller('user', 'find', req.user))
      ErrorService.handleError(req, res, sails.config.errors.UNAUTHORIZED, sails.config.errors.UNAUTHORIZED, 'danger','/admin');
    var aux = {
      page: 1,
      limit: 5
    };
    if(req.param('page'))
      aux.page = req.param('page');
    if(req.param('limit'))
      aux.limit = req.param('limit');

    sails.models['user'].findCustom(aux, function(err, results){
      if(!err)
        return res.view('admins/models/index', {page: 'user', results});
      else
        res.negotiate(err);
    });
  },
  findOne: function(req, res){
    if(!auth.authorize_controller('user', 'findone', req.user))
      ErrorService.handleError(req, res, sails.config.errors.UNAUTHORIZED, 'non sei autorizzato', 'danger','/admin/user');
    if(!auth.authorize_resource(req.record,'findone', req.user))
      ErrorService.handleError(req, res, sails.config.errors.UNAUTHORIZED, 'non sei autorizzato', 'danger','/admin/user');
    return res.view('admins/models/show', {page: 'user'});
  },
  new: function(req, res){
    if(!auth.authorize_controller('user', 'new', req.user))
      ErrorService.handleError(req, res, sails.config.errors.UNAUTHORIZED, sails.config.errors.UNAUTHORIZED.message, 'success','/admin/user');
    return res.view('admins/models/new', {page: 'user'});
  },
  create: function(req, res){
    if(!auth.authorize_controller('user', 'create', req.user))
      ErrorService.handleError(req, res, sails.config.errors.UNAUTHORIZED, sails.config.errors.UNAUTHORIZED.message, 'success','/admin/user');
    var payload = req.allParams();
    var fields = sails.config.fields_helper.fieldsInfo['user'].fields;
    var result = setUpPermitted(payload, fields);
    var item = _.pick(result.payload, result.permitted);
    sails.models[user].create(item)
    .then(function(created){
      ErrorService.handleError(req, res, sails.config.errors.CREATED,sails.config.errors.CREATED.message , 'success','/admin/user/new');
    })
    .catch(function(err){
      if(!auth.authorize_controller('user', 'create', req.user))
        ErrorService.handleError(req, res, sails.config.errors.UNAUTHORIZED, sails.config.errors.UNAUTHORIZED.message, 'success','/admin/user');
      req.addFlash('warning', 'Errore nella compilazione dei campi');
      item = setUpLabel(result.labels, item);
      return res.view('admins/models/new',{page: 'user', previousData: item, err: err.invalidAttributes});
    })
  },
  edit: function(req, res){
    if(!auth.authorize_controller('user','update', req.user))
      ErrorService.handleError(req, res, sails.config.errors.UNAUTHORIZED, 'non sei autorizzato', 'danger','/admin/user');
    if(!auth.authorize_resource(req.record,'update', req.user))
      ErrorService.handleError(req, res, sails.config.errors.UNAUTHORIZED, 'non sei autorizzato', 'danger','/admin/user');
    return res.view('admins/models/edit', {page: 'user', previousData: req.record});
  },
  update: function(req, res){
    //var permitted = ['email','role','password','website'];
    if(!auth.authorize_controller('user', 'update', req.user))
      ErrorService.handleError(req, res, sails.config.errors.UNAUTHORIZED, 'non sei autorizzato', 'danger','/admin/user');
    if(!auth.authorize_resource(req.record,'update', req.user))
      ErrorService.handleError(req, res, sails.config.errors.UNAUTHORIZED, 'non sei autorizzato', 'danger','/admin/user');
    var payload = req.allParams();
    var fields = sails.config.fields_helper.fieldsInfo['user'].fields;
    var result = setUpPermitted(payload, fields);
    var item = _.pick(result.payload, result.permitted);
    sails.models[user].update({id: req.record.id}, item)
    .then(function(updated){
      ErrorService.handleError(req, res, sails.config.errors.UPDATED,sails.config.errors.UPDATED.message , 'success','/admin/user/edit/'+updated[0].id);
    })
    .catch(function(err){
      if(!auth.authorize_controller('user', 'update', req.user))
        ErrorService.handleError(req, res, sails.config.errors.UNAUTHORIZED, 'non sei autorizzato', 'danger','/admin/user');
      if(!auth.authorize_resource(req.record,'update', req.user))
        ErrorService.handleError(req, res, sails.config.errors.UNAUTHORIZED, 'non sei autorizzato', 'danger','/admin/user');
      req.addFlash('warning', 'Errore nella compilazione dei campi');
      item = setUpLabel(result.labels, item);
      return res.view('admins/models/edit',{page: 'user', previousData: item, err: err.invalidAttributes});
    })
  },
  destroy: function(req, res){
    if(!auth.authorize_controller('user', 'destroy', req.user))
      ErrorService.handleError(req, res, sails.config.errors.UNAUTHORIZED, 'non sei autorizzato', 'danger','/admin/user');
    if(!auth.authorize_resource(req.record,'destroy', req.user))
      ErrorService.handleError(req, res, sails.config.errors.UNAUTHORIZED, 'non sei autorizzato', 'danger','/admin/user');
    sails.models[user].destroy({id: req.record.id})
    .then(function(){
      ErrorService.handleError(req, res, sails.config.errors.DESTROYED, sails.config.errors.DESTROYED.message, 'success','/admin/user');
    })
    .catch(function(err){
      ErrorService.handleError(req, res, err, err.message , 'danger','/admin/user');
    })
  }
};
