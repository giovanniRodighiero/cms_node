var fs = require('fs-extra');
var jimp = require('jimp');

module.exports = {
   deleteAssets:  function(fd) {
    fs.removeSync('assets/uploads/images/'+fd);
  },
  getAssetInfos: function(url, flag) {
    var elements = url.split(flag);
    var infos = {
      ext: elements[elements.length - 1],
      name: elements[elements.length - 2]
    }
    return infos;
  },
   hasAsset: function(modelName) {
    console.log(modelName);
    var fields = sails.config.fields_helper.fieldsInfo[modelName].fields;
    for (var i = 0; i < fields.length; i++) {
      if(fields[i].file)
        return true;
    }
    return false;
  },
  createCuts: function(url, width, height) {
    jimp.read('assets/'+url, function (err, img) {
    if (err) throw err;
    var infos = AssetsService.getAssetInfos(url,'.');
    console.log(infos);
    img.resize(width, height)            // resize
      .write('assets/'+infos.name+'_mySize.png'); // save
});
  }
}
