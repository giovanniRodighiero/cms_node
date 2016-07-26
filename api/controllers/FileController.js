/**
 *
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var uuid = require('node-uuid');

module.exports = {
  uploadFile: function (req, res) {
    var fileName = uuid.v1()+'.jpg';
    var infos = AssetsService.getAssetInfos(fileName, '.');

    req.file('file').upload({
      dirname: '../../assets/uploads/images/'+infos.name,
      saveAs: fileName,
      // don't allow the total upload size to exceed ~10MB
      maxBytes: 10000000
    },function whenDone(err, uploadedFiles) {
      if (err) {
        return res.negotiate(err);
      }

      // If no files were uploaded, respond with an error.
      if (uploadedFiles.length === 0){
        return res.badRequest('No file was uploaded');
      }
      var payload = {
        picture_name: 'uploads/images/'+infos.name+'/'+fileName
      }
      return res.ok(payload);
    });
  }
};
