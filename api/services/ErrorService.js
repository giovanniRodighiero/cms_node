module.exports = {
  handleError: function(req, res, err, msg, type, path){
    if(req.wantsJSON)
      return res.negotiate(err);
    else {
      req.addFlash(type, msg);
      // if(path != undefined)
      //   return res.redirect(path);
      // else
      //   return null;
      return res.redirect(path);
    }
  }
};
