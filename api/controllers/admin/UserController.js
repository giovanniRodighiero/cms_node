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
      return res.view('admins/models/show', {page: 'user'});
    }else
      ErrorService.handleError(req, res, sails.config.errors.UNAUTHORIZED, sails.config.errors.UNAUTHORIZED.message, 'success','/admin/user');
  },
  create: function(req, res){
    var permitted = ['email','password','role','website'];
    if(auth.authorize_controller('user', 'create', req.user)){
      var item = _.pick(req.allParams(),permitted);
      User.create(item)
      .then(function(created){
        ErrorService.handleError(req, res, sails.config.errors.CREATED,sails.config.errors.CREATED.message , 'success','/admin/user/new');
      })
      .catch(function(err){
        Website.findOne({id: item.website})
        .then(function(website){
          req.addFlash('warning', 'Errore nella compilazione dei campi');
          item.website = website;
          return res.view('admins/models/new',{page: 'user', previousData: item, err: err.invalidAttributes});
        })
        .catch(function(err){
          ErrorService.handleError(req, res, sails.config.errors.SERVER_ERROR, sails.config.errors.SERVER_ERROR.message, 'success','/admin/user');
        });
      })
    }
  },
  edit: function(req, res){
    if(!auth.authorize_controller('user','update', req.user))
      ErrorService.handleError(req, res, sails.config.errors.UNAUTHORIZED, 'non sei autorizzato', 'danger','/admin/user');
    if(!auth.authorize_resource(req.record,'update', req.user))
      ErrorService.handleError(req, res, sails.config.errors.UNAUTHORIZED, 'non sei autorizzato', 'danger','/admin/user');
    Website.findOne({id: req.record.website})
    .then(function(result){
      req.record.website = result;
      sails.log(req.record);
      return res.view('admins/models/edit', {page: 'user', previousData: req.record});
    })
    .catch(function(err){
      ErrorService.handleError(req, res, sails.config.errors.NOT_FOUND, sails.config.errors.NOT_FOUND, 'danger','/admin/user');
    });
  },
  update: function(req, res){
    var permitted = ['email','role','password','website'];
    if(auth.authorize_controller('user', 'update', req.user)){
      if(auth.authorize_resource(req.record,'update', req.user)){
        var notAllowed = _.without(req.allParams(), permitted);
        var permitted = _.pull(req.allParams(), notAllowed);
        User.update({id: req.record.id}, permitted)
        .then(function(updated){
          ErrorService.handleError(req, res, sails.config.errors.UPDATED,sails.config.errors.UPDATED.message , 'success','/admin/user/edit/'+updated[0].id);
        })
        .catch(function(err){
          req.addFlash('warning', 'Errore nella compilazione dei campi');
          if(auth.authorize_controller('user', 'update', req.user)){
            if(auth.authorize_resource(req.record,'update', req.user)){
              Website.findOne({id: permitted.website})
              .then(function(result){
                permitted.website = result;
                sails.log(req.record);
                return res.view('admins/models/edit', {page: 'user', previousData: permitted, err: err.invalidAttributes});
              })
              .catch(function(err){
                ErrorService.handleError(req, res, sails.config.errors.NOT_FOUND, sails.config.errors.NOT_FOUND, 'danger','/admin/user');
              });
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
