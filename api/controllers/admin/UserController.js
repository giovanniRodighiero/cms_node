var auth = sails.config.authorization;
var _ = require('lodash');

module.exports = {
  find: function(req, res){
    if(auth.authorize_controller('user', 'find', req.user)){
      var skip = req.param('page')
      User.find()
      .then(function(results){
        return res.view('admins/user/index', {page: 'user', results});
      })
      .catch(function(err){
        return res.negotiate(err);
      })
    }else
      ErrorService.handleError(req, res, sails.config.errors.UNAUTHORIZED, 'non sei autorizzato', 'danger','/admin');
  },
  findOne: function(req, res){
    if(auth.authorize_controller('user', 'findone', req.user)){
      if(auth.authorize_resource(req.record,'findone', req.user))
        return res.view('admins/user/show', {page: 'user', result: req.record});
      else
        ErrorService.handleError(req, res, sails.config.errors.UNAUTHORIZED, 'non sei autorizzato', 'danger','/admin/user');
    }else
      ErrorService.handleError(req, res, sails.config.errors.UNAUTHORIZED, 'non sei autorizzato', 'danger','/admin/user');
  },
  new:function(req, res){
    if(auth.authorize_controller('user', 'new', req.user)){
      return res.view('admins/user/new',{page: 'user'});
    }
    else
      ErrorService.handleError(req, res, sails.config.errors.UNAUTHORIZED, sails.config.errors.UNAUTHORIZED.message , 'success','/admin/user');
  },
  create: function(req, res){
    var permitted = ['email','password','role'];
    if(auth.authorize_controller('user', 'create', req.user)){
    //  if( !req.param('id') || !req.param('email') || !req.param('role') || !req.param('password') || !req.param('website'))
      //  ErrorService.handleError(req, res, sails.config.errors.BAD_REQUEST,sails.config.errors.BAD_REQUEST.message , 'danger','/admin/user/create');
      var item = _.pick(req.allParams(),permitted);
      User.create(item)
      .then(function(created){
        ErrorService.handleError(req, res, sails.config.errors.CREATED,sails.config.errors.CREATED.message , 'success','/admin/user/new');
      })
      .catch(function(err){
        ErrorService.handleError(req, res, err, err.message , 'danger','/admin/user/create');
      })
    }
  },
  update: function(req, res){
    var permitted = ['email','role','password'];
    if(auth.authorize_controller('user', 'update', req.user)){
    //  if( !req.param('id') || !req.param('email') || !req.param('role') || !req.param('password') || !req.param('website'))
      //  ErrorService.handleError(req, res, sails.config.errors.BAD_REQUEST,sails.config.errors.BAD_REQUEST.message , 'danger','/admin/user/create');
      if(auth.authorize_resource(req.record,'update', req.user)){
        var item = _.pick(req.allParams(),permitted);
        User.update({id: req.record.id}, item)
        .then(function(updated){
          ErrorService.handleError(req, res, sails.config.errors.UPDATED,sails.config.errors.UPDATED.message , 'success','/admin/user/'+updated[0].id);
        })
        .catch(function(err){
          ErrorService.handleError(req, res, err, err.message , 'danger','/admin/user');
        })
      }else
        ErrorService.handleError(req, res, sails.config.errors.UNAUTHORIZED, 'non sei autorizzato', 'danger','/admin/user');
    }
  },
  destroy: function(req, res){
    if(auth.authorize_controller('user', 'destroy', req.user)){
      if(auth.authorize_resource(req.record,'user', req.user)){
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
