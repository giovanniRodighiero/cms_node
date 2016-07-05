module.exports.website = {
  resources:{
    find: function(record, user){
      if(record.id < 4)
        return false;
      else
        return true;
    },
    findone: function(record, user){
      return true;
    },
    create: function(record, user){
      return true;
    },
    update: function(record, user){
      return true;
    },
    destroy: function(record, user){
      return true;
    }
  }
}
