var auth = sails.config.authorization;
var _ = require('lodash');

module.exports = {
  find: function(req, res){
    if(auth.authorize_controller('metadata', 'find', req.user)){
      var skip = req.param('page') || 1;
      var limit = 5;
      Metadata.find({skip, limit}, function(err, results){
        if(!err){
          console.log(results);
          return res.view('admins/models/index', {page: 'metadata', results});
        }
        else
          res.negotiate(err);
      })
    }else
      ErrorService.handleError(req, res, sails.config.errors.UNAUTHORIZED, 'non sei autorizzato', 'danger','/admin');
  },
  findOne: function(req, res){
    if(auth.authorize_controller('metadata', 'findone', req.user)){
      if(auth.authorize_resource(req.record,'findone', req.user))
        return res.view('admins/models/show', {page: 'metadata', result: req.record});
      else
        ErrorService.handleError(req, res, sails.config.errors.UNAUTHORIZED, 'non sei autorizzato', 'danger','/admin/metadata');
    }else
      ErrorService.handleError(req, res, sails.config.errors.UNAUTHORIZED, 'non sei autorizzato', 'danger','/admin/metadata');
  },
  new:function(req, res){
    if(auth.authorize_controller('metadata', 'new', req.user)){
      return res.view('admins/models/new',{page: 'metadata'});
    }
    else
      ErrorService.handleError(req, res, sails.config.errors.UNAUTHORIZED, sails.config.errors.UNAUTHORIZED.message , 'success','/admin/metadata');
  },
  create: function(req, res){
    var permitted = ['path','meta_title','meta_descr','published','locale','website'];
    if(auth.authorize_controller('metadata', 'create', req.user)){
      var item = _.pick(req.allParams(), permitted);
      var aux = sails.config.models_structure.getFields('metadata');
      Metadata.create(item)
      .then(function(created){
        ErrorService.handleError(req, res, sails.config.errors.CREATED,sails.config.errors.CREATED.message , 'success','/admin/metadata/new');
      })
      .catch(function(err){
        req.addFlash('warning', 'Errore nella compilazione dei campi');
        return res.view('admins/models/new', {page: 'metadata', previousData: item, err: err.invalidAttributes});
      })
    }
  },
  update: function(req, res){
    var permitted = ['path','meta_title','meta_descr','published','locale','website'];
    if(auth.authorize_controller('metadata', 'update', req.user)){
      if(auth.authorize_resource(req.record,'update', req.user)){
        var item = _.pick(req.allParams(), permitted);
        User.update({id: req.record.id}, item)
        .then(function(updated){
          ErrorService.handleError(req, res, sails.config.errors.UPDATED,sails.config.errors.UPDATED.message , 'success','/admin/metadata/'+updated[0].id);
        })
        .catch(function(err){
          req.addFlash('warning', 'Errore nella compilazione dei campi');
          if(auth.authorize_controller('metadata', 'findone', req.user)){
            if(auth.authorize_resource(req.record,'findone', req.user))
              return res.view('admins/models/show', {page: 'metadata', result: req.record, previousData: item, err: err.invalidAttributes});
            else
              ErrorService.handleError(req, res, sails.config.errors.UNAUTHORIZED, 'non sei autorizzato', 'danger','/admin/metadata');
          }else
            ErrorService.handleError(req, res, sails.config.errors.UNAUTHORIZED, 'non sei autorizzato', 'danger','/admin/metadata');
        })
      }else
        ErrorService.handleError(req, res, sails.config.errors.UNAUTHORIZED, 'non sei autorizzato', 'danger','/admin/metadata');
    }
  },
  destroy: function(req, res){
    if(auth.authorize_controller('metadata', 'destroy', req.user)){
      if(auth.authorize_resource(req.record,'destroy', req.user)){
        Metadata.destroy({id: req.record.id})
        .then(function(){
          ErrorService.handleError(req, res, sails.config.errors.DESTROYED, sails.config.errors.DESTROYED.message, 'success','/admin/metadata');
        })
        .catch(function(err){
          ErrorService.handleError(req, res, err, err.message , 'danger','/admin/metadata');
        })
      }else
        ErrorService.handleError(req, res, sails.config.errors.UNAUTHORIZED, 'non sei autorizzato', 'danger','/admin/metadata');
    }
  }
}
