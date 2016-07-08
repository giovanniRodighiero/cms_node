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
    if(!auth.authorize_controller('website', 'find', req.user))
      ErrorService.handleError(req, res, sails.config.errors.UNAUTHORIZED, sails.config.errors.UNAUTHORIZED, 'danger','/admin');
    var aux = {
      page: 1,
      limit: 5
    };
    if(req.param('page'))
      aux.page = req.param('page');
    if(req.param('limit'))
      aux.limit = req.param('limit');

    sails.models['website'].findCustom(aux, function(err, results){
      if(!err)
        return res.view('admins/models/index', {page: 'website', results});
      else
        res.negotiate(err);
    });
  },
  findOne: function(req, res){
    if(!auth.authorize_controller('website', 'findone', req.user))
      ErrorService.handleError(req, res, sails.config.errors.UNAUTHORIZED, 'non sei autorizzato', 'danger','/admin/website');
    if(!auth.authorize_resource(req.record,'findone', req.user))
      ErrorService.handleError(req, res, sails.config.errors.UNAUTHORIZED, 'non sei autorizzato', 'danger','/admin/website');
    return res.view('admins/models/show', {page: 'website'});
  },
  new: function(req, res){
    if(!auth.authorize_controller('website', 'new', req.user))
      ErrorService.handleError(req, res, sails.config.errors.UNAUTHORIZED, sails.config.errors.UNAUTHORIZED.message, 'success','/admin/website');
    return res.view('admins/models/new', {page: 'website'});
  },
  create: function(req, res){
    if(!auth.authorize_controller('website', 'create', req.user))
      ErrorService.handleError(req, res, sails.config.errors.UNAUTHORIZED, sails.config.errors.UNAUTHORIZED.message, 'success','/admin/website');
    var payload = req.allParams();
    var fields = sails.config.fields_helper.fieldsInfo['website'].fields;
    var result = setUpPermitted(payload, fields);
    var item = _.pick(result.payload, result.permitted);
    sails.models[website].create(item)
    .then(function(created){
      ErrorService.handleError(req, res, sails.config.errors.CREATED,sails.config.errors.CREATED.message , 'success','/admin/website/new');
    })
    .catch(function(err){
      if(!auth.authorize_controller('website', 'create', req.user))
        ErrorService.handleError(req, res, sails.config.errors.UNAUTHORIZED, sails.config.errors.UNAUTHORIZED.message, 'success','/admin/website');
      req.addFlash('warning', 'Errore nella compilazione dei campi');
      item = setUpLabel(result.labels, item);
      return res.view('admins/models/new',{page: 'website', previousData: item, err: err.invalidAttributes});
    })
  },
  edit: function(req, res){
    if(!auth.authorize_controller('website','update', req.user))
      ErrorService.handleError(req, res, sails.config.errors.UNAUTHORIZED, 'non sei autorizzato', 'danger','/admin/website');
    if(!auth.authorize_resource(req.record,'update', req.user))
      ErrorService.handleError(req, res, sails.config.errors.UNAUTHORIZED, 'non sei autorizzato', 'danger','/admin/website');
    return res.view('admins/models/edit', {page: 'website', previousData: req.record});
  },
  update: function(req, res){
    //var permitted = ['email','role','password','website'];
    if(!auth.authorize_controller('website', 'update', req.user))
      ErrorService.handleError(req, res, sails.config.errors.UNAUTHORIZED, 'non sei autorizzato', 'danger','/admin/website');
    if(!auth.authorize_resource(req.record,'update', req.user))
      ErrorService.handleError(req, res, sails.config.errors.UNAUTHORIZED, 'non sei autorizzato', 'danger','/admin/website');
    var payload = req.allParams();
    var fields = sails.config.fields_helper.fieldsInfo['website'].fields;
    var result = setUpPermitted(payload, fields);
    var item = _.pick(result.payload, result.permitted);
    sails.models[website].update({id: req.record.id}, item)
    .then(function(updated){
      ErrorService.handleError(req, res, sails.config.errors.UPDATED,sails.config.errors.UPDATED.message , 'success','/admin/website/edit/'+updated[0].id);
    })
    .catch(function(err){
      if(!auth.authorize_controller('website', 'update', req.user))
        ErrorService.handleError(req, res, sails.config.errors.UNAUTHORIZED, 'non sei autorizzato', 'danger','/admin/website');
      if(!auth.authorize_resource(req.record,'update', req.user))
        ErrorService.handleError(req, res, sails.config.errors.UNAUTHORIZED, 'non sei autorizzato', 'danger','/admin/website');
      req.addFlash('warning', 'Errore nella compilazione dei campi');
      item = setUpLabel(result.labels, item);
      return res.view('admins/models/edit',{page: 'website', previousData: item, err: err.invalidAttributes});
    })
  },
  destroy: function(req, res){
    if(!auth.authorize_controller('website', 'destroy', req.user))
      ErrorService.handleError(req, res, sails.config.errors.UNAUTHORIZED, 'non sei autorizzato', 'danger','/admin/website');
    if(!auth.authorize_resource(req.record,'destroy', req.user))
      ErrorService.handleError(req, res, sails.config.errors.UNAUTHORIZED, 'non sei autorizzato', 'danger','/admin/website');
    sails.models[website].destroy({id: req.record.id})
    .then(function(){
      ErrorService.handleError(req, res, sails.config.errors.DESTROYED, sails.config.errors.DESTROYED.message, 'success','/admin/website');
    })
    .catch(function(err){
      ErrorService.handleError(req, res, err, err.message , 'danger','/admin/website');
    })
  }
};
