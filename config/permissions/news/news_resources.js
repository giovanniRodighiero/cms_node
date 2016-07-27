module.exports.news = {
  resources:{
    find: (function(record, user){
      return true;
    }),
    findone: (function(record, user){
      if(!record.published && !user)
        return false;
      else
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
