"use strict";

/**
 * isAuthenticated
 * @description :: Policy that inject user in `req` via JSON Web Token
 */
const passport = require('passport');

module.exports = (req, res, next) => {
  if(req.user)
    return next();
  else
    ErrorService.handleError(req, res, sails.config.errors.UNAUTHORIZED, 'non sei autenticato', 'danger','/');

};
