var auth = sails.config.authorization;
var _ = require('lodash');
var usersNumber;

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
      if(!err){
        return res.view('admins/models/index', {page: 'user', results});
      }
      else
        res.negotiate(err);
    });
  },
  findOne: function(req, res){
    if(auth.authorize_controller('user', 'findone', req.user)){
      if(auth.authorize_resource(req.record,'findone', req.user)){
        User.findOne({id: req.record.id}).populate('website')
        .then(function(result){
          return res.view('admins/models/show', {page: 'user', result: result});
        })
        .catch(function(err){
          ErrorService.handleError(req, res, sails.config.errors.NOT_FOUND, sails.config.errors.NOT_FOUND.message, 'danger','/admin/user');
        });
      }
      else
        ErrorService.handleError(req, res, sails.config.errors.UNAUTHORIZED, 'non sei autorizzato', 'danger','/admin/user');
    }else
      ErrorService.handleError(req, res, sails.config.errors.UNAUTHORIZED, 'non sei autorizzato', 'danger','/admin/user');
  },
  new: function(req, res){
    if(auth.authorize_controller('user', 'new', req.user)){
      return res.view('admins/models/new', {page: 'user'});
    }else
      ErrorService.handleError(req, res, sails.config.errors.UNAUTHORIZED, sails.config.errors.UNAUTHORIZED.message, 'success','/admin/user');
  },
  create: function(req, res){
    //var permitted = ['email','password','role','website'];
    var payload = req.allParams();
    var permitted = [];
    var labels = {};
    var fields = sails.config.fields_helper.fieldsInfo['user'].fields;
    for (var i = 0; i < fields.length; i++) {
      if(fields[i].association){
        var aux = payload[fields[i].name].split(',');
        payload[fields[i].name] = aux[0];
        labels[fields[i].name] = aux[1];
      }
      permitted.push(fields[i].name);
    }
    var item = _.pick(payload, permitted);
    if(auth.authorize_controller('user', 'create', req.user)){
      //var item = _.pick(values, permitted);
      User.create(item)
      .then(function(created){
        ErrorService.handleError(req, res, sails.config.errors.CREATED,sails.config.errors.CREATED.message , 'success','/admin/user/new');
      })
      .catch(function(err){
        req.addFlash('warning', 'Errore nella compilazione dei campi');
        for (var i = 0; i < Object.keys(labels).length; i++) {
           var old = item[Object.keys(labels)[i]];
           var aux = {};
          item[Object.keys(labels)[i]] = _.assign(aux, { id: item[Object.keys(labels)[i]], name :labels[Object.keys(labels)[i]]});
        }
        return res.view('admins/models/new',{page: 'user', previousData: item, err: err.invalidAttributes});
      })
    }
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
    if(auth.authorize_controller('user', 'update', req.user)){
      if(auth.authorize_resource(req.record,'update', req.user)){
        var payload = req.allParams();
        var permitted = [];
        var labels = {};
        var fields = sails.config.fields_helper.fieldsInfo['user'].fields;
        for (var i = 0; i < fields.length; i++) {
          if(fields[i].association && payload[fields[i].name]){
            var aux = payload[fields[i].name].split(',');
            payload[fields[i].name] = aux[0];
            labels[fields[i].name] = aux[1];
          }
          permitted.push(fields[i].name);
        }
        // var notAllowed = _.without(payload, permitted);
        // permitted = _.pull(payload, notAllowed);
        var item = _.pick(payload, permitted);
        User.update({id: req.record.id}, item)
        .then(function(updated){
          ErrorService.handleError(req, res, sails.config.errors.UPDATED,sails.config.errors.UPDATED.message , 'success','/admin/user/edit/'+updated[0].id);
        })
        .catch(function(err){
          if(auth.authorize_controller('user', 'update', req.user)){
            if(auth.authorize_resource(req.record,'update', req.user)){
              req.addFlash('warning', 'Errore nella compilazione dei campi');
              for (var i = 0; i < Object.keys(labels).length; i++) {
                 var old = item[Object.keys(labels)[i]];
                 var aux = {};
                item[Object.keys(labels)[i]] = _.assign(aux, { id: item[Object.keys(labels)[i]], name :labels[Object.keys(labels)[i]]});
              }
              return res.view('admins/models/edit',{page: 'user', previousData: item, err: err.invalidAttributes});
            }
            else
              ErrorService.handleError(req, res, sails.config.errors.UNAUTHORIZED, 'non sei autorizzato', 'danger','/admin/user');
          }else
            ErrorService.handleError(req, res, sails.config.errors.UNAUTHORIZED, 'non sei autorizzato', 'danger','/admin/user');
        })
      }else
        ErrorService.handleError(req, res, sails.config.errors.UNAUTHORIZED, 'non sei autorizzato', 'danger','/admin/user');
    }
  },
  destroy: function(req, res){
    if(auth.authorize_controller('user', 'destroy', req.user)){
      if(auth.authorize_resource(req.record,'destroy', req.user)){
        User.destroy({id: req.record.id})
        .then(function(){
          ErrorService.handleError(req, res, sails.config.errors.DESTROYED, sails.config.errors.DESTROYED.message, 'success','/admin/user');
        })
        .catch(function(err){
          ErrorService.handleError(req, res, err, err.message , 'danger','/admin/user');
        })
      }else
        ErrorService.handleError(req, res, sails.config.errors.UNAUTHORIZED, 'non sei autorizzato', 'danger','/admin/user');
    }
  }
}
