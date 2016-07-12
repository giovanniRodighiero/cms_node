"use strict";

function forceArray(payload, fields) {
  for (var i = 0; i < fields.length; i++) {
    var array = [];
    if(fields[i].association && payload[fields[i].name]){
    //  if(fields[i].association.type === 'multiple'){
        if(!Array.isArray(payload[fields[i].name])){
          array.push(payload[fields[i].name]);
          payload[fields[i].name] = array;
        }
  //    }
    }
  }
  return payload;
}
function setUpPermitted(payloadO, fields) {
  var result = {
    permitted: [],
    labels: {},
    payload: payloadO
  };
  for (var i = 0; i < fields.length; i++) {
    if(fields[i].association && payloadO[fields[i].name]){
      if(fields[i].association.type === 'multiple'){
        var oldPayload = payloadO[fields[i].name];
        result.labels[fields[i].name] = [];
        result.payload[fields[i].name] = [];
        for (var j = 0; j < oldPayload.length; j++) {
          var aux = oldPayload[j].split(',');
          result.payload[fields[i].name].push(aux[0]);
          result.labels[fields[i].name].push(aux[1]);
        }
      }else{
        sails.log('dentro  setUpPermitted');
        sails.log(payloadO[fields[i].name]);
        var oldPayload = payloadO[fields[i].name];
        var aux = oldPayload[0].split(',');
        result.payload[fields[i].name] = aux[0];
        result.labels[fields[i].name] = aux[1];
      }
    }
    result.permitted.push(fields[i].name);
  }
  return result;
};
function setUpLabel(labels, item, fields) {
  sails.log('item dentro label');
  sails.log(item);
  for (var i = 0; i < Object.keys(labels).length; i++) {// scorro ogni chiave dell'oggetto labels
    var oldEntry = item[Object.keys(labels)[i]];
    if(Array.isArray(oldEntry)){
      var newData = [];
      for (var j = 0; j < oldEntry.length; j++) {
        var aux = {};
        aux.id = oldEntry[j];
        for (var k = 0; k < fields.length; k++) {
          if(fields[k].name == Object.keys(labels)[i]){
            aux[fields[k].association.searchWith] = labels[Object.keys(labels)[i]][j];
          }
        }
        newData.push(aux);
      }
    }else{
      var newData;
      var aux = {};
      aux.id = oldEntry;
      for (var k = 0; k < fields.length; k++) {
        if(fields[k].name == Object.keys(labels)[i]){
          aux[fields[k].association.searchWith] = labels[Object.keys(labels)[i]];
        }
      }
      newData = aux;
    }
    item[Object.keys(labels)[i]] = newData;
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
    payload = forceArray(payload, fields);

    var result = setUpPermitted(payload, fields);
    var item = _.pick(result.payload, result.permitted);
    sails.models['user'].create(item)
    .then(function(created){
      ErrorService.handleError(req, res, sails.config.errors.CREATED,sails.config.errors.CREATED.message , 'success','/admin/user/new');
    })
    .catch(function(err){
      if(!auth.authorize_controller('user', 'create', req.user))
        ErrorService.handleError(req, res, sails.config.errors.UNAUTHORIZED, sails.config.errors.UNAUTHORIZED.message, 'success','/admin/user');
      req.addFlash('warning', 'Errore nella compilazione dei campi');
      item = setUpLabel(result.labels, item, fields);
      return res.view('admins/models/new',{page: 'user', previousData: item, err: err.invalidAttributes});
    })
  },
  edit: function(req, res){
    if(!auth.authorize_controller('user','update', req.user))
      ErrorService.handleError(req, res, sails.config.errors.UNAUTHORIZED, 'non sei autorizzato', 'danger','/admin/user');
    if(!auth.authorize_resource(req.record,'update', req.user))
      ErrorService.handleError(req, res, sails.config.errors.UNAUTHORIZED, 'non sei autorizzato', 'danger','/admin/user');
    if(req.record.id === req.user.id)
      return res.view('admins/models/account', {page: 'user', previousData: req.record});
    else
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
    payload = forceArray(payload, fields);

    var result = setUpPermitted(payload, fields);
    var item = _.pick(result.payload, result.permitted);
    sails.models['user'].update({id: req.record.id}, item)
    .then(function(updated){
      ErrorService.handleError(req, res, sails.config.errors.UPDATED,sails.config.errors.UPDATED.message , 'success','/admin/user/edit/'+updated[0].id);
    })
    .catch(function(err){
      if(!auth.authorize_controller('user', 'update', req.user))
        ErrorService.handleError(req, res, sails.config.errors.UNAUTHORIZED, 'non sei autorizzato', 'danger','/admin/user');
      if(!auth.authorize_resource(req.record,'update', req.user))
        ErrorService.handleError(req, res, sails.config.errors.UNAUTHORIZED, 'non sei autorizzato', 'danger','/admin/user');
      req.addFlash('warning', 'Errore nella compilazione dei campi');
      item = setUpLabel(result.labels, item, fields);
      return res.view('admins/models/edit',{page: 'user', previousData: item, err: err.invalidAttributes});
    })
  },
  destroy: function(req, res){
    if(!auth.authorize_controller('user', 'destroy', req.user))
      ErrorService.handleError(req, res, sails.config.errors.UNAUTHORIZED, 'non sei autorizzato', 'danger','/admin/user');
    if(!auth.authorize_resource(req.record,'destroy', req.user))
      ErrorService.handleError(req, res, sails.config.errors.UNAUTHORIZED, 'non sei autorizzato', 'danger','/admin/user');
    sails.models['user'].destroy({id: req.record.id})
    .then(function(){
      ErrorService.handleError(req, res, sails.config.errors.DESTROYED, sails.config.errors.DESTROYED.message, 'success','/admin/user');
    })
    .catch(function(err){
      ErrorService.handleError(req, res, err, err.message , 'danger','/admin/user');
    })
  }
};
