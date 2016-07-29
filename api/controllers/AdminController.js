/**
 * AdminController
 *
 * @description :: Server-side logic for managing Admins
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
"use strict";
var Base = require('../services/BaseAdminController');
function MyAdminController() {

}

var aux = MyAdminController.prototype = new Base();


module.exports = aux;
