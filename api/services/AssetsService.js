var fs = require('fs');

module.exports = {
   deleteAssets:  function(fd) {
    fs.unlinkSync('assets/'+fd);
  },
   hasAsset: function(modelName) {
    console.log(modelName);
    var fields = sails.config.fields_helper.fieldsInfo[modelName].fields;
    for (var i = 0; i < fields.length; i++) {
      if(fields[i].file)
        return true;
    }
    return false;
  }
}
