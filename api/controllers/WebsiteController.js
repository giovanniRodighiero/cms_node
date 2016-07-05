"use strict";
module.exports = {
  find: function(req, res){
    var aux = {
      page: 0,
      limit: 5
    };
    if(req.param('page'))
      aux.page = req.param('page');
    if(req.param('limit'))
      aux.limit = req.param('limit');

    sails.models['website'].findCustom(aux, function(err, results){
      if(err)
        return res.negotiate(err);
      else
        return res.json(results);
    });
  }
};
