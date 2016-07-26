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
    var fields = sails.config.fields_helper.fieldsInfo[modelName].fields;
    for (var i = 0; i < fields.length; i++) {
      if(fields[i].file)
        return true;
    }
    return false;
  },
  createCuts: function(url, prefix, width, height) {
    jimp.read('assets/'+url, function (err, img) {
    if (err) throw err;
    var infos = AssetsService.getAssetInfos(url, '.');
    var aux = AssetsService.getAssetInfos(infos.name, '/');
    img.resize(width, height)            // resize
      .write('assets/uploads/images/'+aux.name+'/'+prefix+'_'+aux.ext+'.'+infos.ext); // save
});
  },
  helper: (function(cut, url){
    var infos = AssetsService.getAssetInfos(url, '.');
    var aux = AssetsService.getAssetInfos(infos.name, '/');
    return 'uploads/images/'+aux.name+'/'+cut+'_'+aux.ext+'.'+infos.ext;
  })
}
