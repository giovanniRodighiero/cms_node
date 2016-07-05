var auth = sails.config.authorization;
var _ = require('lodash');
function confirmation() {

}
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
      if(!err){
        return res.view('admins/models/index', {page: 'website', results});
      }
      else
        res.negotiate(err);
    });
  },
  findOne: function(req, res){
    if(auth.authorize_controller('website', 'findone', req.user)){
      if(auth.authorize_resource(req.record,'findone', req.user))
        return res.view('admins/models/show', {page: 'website', result: req.record});
      else
        ErrorService.handleError(req, res, sails.config.errors.UNAUTHORIZED, 'non sei autorizzato', 'danger','/admin/website');
    }else
      ErrorService.handleError(req, res, sails.config.errors.UNAUTHORIZED, 'non sei autorizzato', 'danger','/admin/website');
  },
  new:function(req, res){
    if(auth.authorize_controller('website', 'new', req.user)){
      return res.view('admins/models/new',{page: 'website'});
    }
    else
      ErrorService.handleError(req, res, sails.config.errors.UNAUTHORIZED, sails.config.errors.UNAUTHORIZED.message , 'success','/admin/website');
  },
  create: function(req, res){
    var permitted = ['name','users','metadatas','published','locale','website'];
    if(auth.authorize_controller('website', 'create', req.user)){
      var item = _.pick(req.allParams(),permitted);
      var aux = sails.config.models_structure.getFields('website');
      Website.create(item)
      .then(function(created){
        ErrorService.handleError(req, res, sails.config.errors.CREATED,sails.config.errors.CREATED.message , 'success','/admin/website/new');
      })
      .catch(function(err){
        req.addFlash('warning', 'Errore nella compilazione dei campi');
        return res.view('admins/models/new', {page: 'website', previousData: item, err: err.invalidAttributes});
      })
    }
  },
  update: function(req, res){
    var permitted = ['name','users','metadatas'];
    if(auth.authorize_controller('website', 'update', req.user)){
      if(auth.authorize_resource(req.record,'update', req.user)){
        var item = _.pick(req.allParams(), permitted);
        Website.update({id: req.record.id}, item)
        .then(function(updated){
          ErrorService.handleError(req, res, sails.config.errors.UPDATED,sails.config.errors.UPDATED.message , 'success','/admin/website/'+updated[0].id);
        })
        .catch(function(err){
          req.addFlash('warning', 'Errore nella compilazione dei campi');
          if(auth.authorize_controller('website', 'findone', req.user)){
            if(auth.authorize_resource(req.record,'findone', req.user))
              return res.view('admins/models/show', {page: 'website', result: req.record, previousData: item, err: err.invalidAttributes});
            else
              ErrorService.handleError(req, res, sails.config.errors.UNAUTHORIZED, 'non sei autorizzato', 'danger','/admin/website');
          }else
            ErrorService.handleError(req, res, sails.config.errors.UNAUTHORIZED, 'non sei autorizzato', 'danger','/admin/website');
        })
      }else
        ErrorService.handleError(req, res, sails.config.errors.UNAUTHORIZED, 'non sei autorizzato', 'danger','/admin/website');
    }
  },
  destroy: function(req, res){
    if(auth.authorize_controller('website', 'destroy', req.user)){
      if(auth.authorize_resource(req.record,'destroy', req.user)){
        User.destroy({id: req.record.id})
        .then(function(){
          ErrorService.handleError(req, res, sails.config.errors.DESTROYED, sails.config.errors.DESTROYED.message, 'success','/admin/website');
        })
        .catch(function(err){
          ErrorService.handleError(req, res, err, err.message , 'danger','/admin/website');
        })
      }else
        ErrorService.handleError(req, res, sails.config.errors.UNAUTHORIZED, 'non sei autorizzato', 'danger','/admin/website');
    }
  }
}
