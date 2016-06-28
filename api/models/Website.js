module.exports = {
  attributes: {
    // base model fields


      name: {

          type:"string",

          required:true,

      },


    // custom fields

      users: {

          collection:"user",

          via:"website",

      },

      metadatas: {

          collection:"metadata",

          via:"website",

      },

  },
  findCustom: function(opts, callback){
    Website.find()
    .then(function(results){
      var customResults = [];
      for (var i = 0; i < results.length; i++) {
        _.assign(results[i], {'model': 'website'});
      }
      return callback(null, results);
    })
    .catch(function(err){
      return callback(err);
    });
  }
};
