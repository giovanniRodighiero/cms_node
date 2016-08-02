module.exports.user = {
  resources:{
    find: (function(record, user){
      return true;
    }),
    findone: (function(record, user){
      return true;
    }),
    create: (function(record, user){
      return true;
    }),
    update: (function(record, user){
      return true;
    }),
    destroy: (function(record, user){
      return true;
    })
  }
}
