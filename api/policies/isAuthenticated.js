"use strict";

/**
 * isAuthenticated
 * @description :: Policy that inject user in `req` via JSON Web Token
 */
const passport = require('passport');

module.exports = (req, res, next) => {

    passport.authenticate('jwt', function(error, user, info) {
    if(error){
      ErrorService.handleError(req, res, error, 'non sei autenticato', 'danger','/');
    }
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
      }else{
        ErrorService.handleError(req, res, sails.config.errors.UNAUTHORIZED, 'non sei autenticato', 'danger','/');
      }
    }else{
      req.user = user;
      return next();
    }
  })(req, res);
};
