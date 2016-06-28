var auth = sails.config.authorization;
var _ = require('lodash');
function confirmation() {

}
module.exports = {
  find: function(req, res){
    if(auth.authorize_controller('website', 'find', req.user)){
      var skip = req.param('page')
      Website.findCustom(null, function(err, results){
        if(!err)
          return res.view('admins/models/index', {page: 'website', results});
        else
          res.negotiate(err);
      })
      // .then(function(results){
      //   return res.view('admins/models/index', {page: 'website', results});
      // })
      // .catch(function(err){
      //   return res.negotiate(err);
      // })
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
  if(auth.authorize_controller('website', 'new', req.user)){
    return res.view('admins/models/new',{page: 'website'});
  }
  else
    ErrorService.handleError(req, res, sails.config.errors.UNAUTHORIZED, sails.config.errors.UNAUTHORIZED.message , 'success','/admin/website');
  },
  create: function(req, res){
    var permitted = ['name'];
    if(auth.authorize_controller('website', 'create', req.user)){
      var item = _.pick(req.allParams(),permitted);
      Website.create(item)
      .then(function(created){
        ErrorService.handleError(req, res, sails.config.errors.CREATED,sails.config.errors.CREATED.message , 'success','/admin/website/new');
      })
      .catch(function(err){
        ErrorService.handleError(req, res, err, err.message , 'danger','/admin/website/create');
      })
    }
  },
  update: function(req, res){
    var permitted = ['name'];
    if(auth.authorize_controller('website', 'update', req.user)){
      if(auth.authorize_resource(req.record,'update', req.user)){
        var item = _.pick(req.allParams(),permitted);
        User.update({id: req.record.id}, item)
        .then(function(updated){
          ErrorService.handleError(req, res, sails.config.errors.UPDATED,sails.config.errors.UPDATED.message , 'success','/admin/website/'+updated[0].id);
        })
        .catch(function(err){
          ErrorService.handleError(req, res, err, err.message , 'danger','/admin/website');
        })
      }else
        ErrorService.handleError(req, res, sails.config.errors.UNAUTHORIZED, 'non sei autorizzato', 'danger','/admin/website');
    }
  },
  destroy: function(req, res){
    if(auth.authorize_controller('website', 'destroy', req.user)){
      if(auth.authorize_resource(req.record,'website', req.user)){
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
