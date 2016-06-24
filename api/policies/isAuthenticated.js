"use strict";

/**
 * isAuthenticated
 * @description :: Policy that inject user in `req` via JSON Web Token
 */
const passport = require('passport');

// function isAllowed(path, action, user){
//   var splittedPath = path.split('/');
//   var modelName = splittedPath[2];
//   sails.log('modelname: '+modelName +  ' ------ action: '+action);
//   var aux = models.permissions[modelName];
//   //sails.log('models:' + aux[method]);
//   if(defaultActions.indexOf(action) != -1)
//     return aux[action](user);
//   else
//     return aux.isAllowed(action,user);
// }

module.exports = (req, res, next) => {
  passport.authenticate('jwt', function(error, user, info) {
    if(error)
      return res.negotiate(error);
    if(!user){ // non trovo lo user dal token
      if(req.session.me){
        User.findOne({id: req.session.me.id})
        .then(function(foundUser){
          //sails.log(user);
          if(foundUser){
            req.user = foundUser;
            return next();
          }else{
            res.redirect('/');
          }
        })
        .catch(function(err){
          res.negotiate(err);
        })
      }else
        res.view('401');
    }else{
      req.user = user;
      next();
    }
  })(req, res);
};
