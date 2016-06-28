module.exports = {
  attributes: {
    // base model fields


      path: {

          type:"string",

          required:true,

      },

      meta_title: {

          type:"string",

      },

      meta_descr: {

          type:"string",

      },

      published: {

          type:"boolean",

      },

      locale: {

          type:"string",

      },


    // custom fields

      website: {

          model:"website",

      },

  },
  findCustom: function(opts, callback){
    Metadata.find()
    .then(function(results){
      var customResults = [];
      for (var i = 0; i < results.length; i++) {
        _.assign(results[i], {'model': 'metadata'});
      }
      return callback(null, results);
    })
    .catch(function(err){
      return callback(err);
    });
  }
};
