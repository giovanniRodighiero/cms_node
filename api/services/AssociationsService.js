"use strict";
var _ = require('lodash');

module.exports = {
  cutNotWantedSingle: function(results, item, fieldName, value){
    console.log(Array.isArray(results));
    if(Array.isArray(results)){
      for (var i = 0; i < results.length; i++) {// loop the query results
        console.log(item);
        if(results[i][item.alias][fieldName] != value)// if the populated model hasn't the value wanted
          results[i][item.alias] = results[i][item.alias].id ;
      }
    }else{
      if(results[item.alias][fieldName] != value)// if the populated model hasn't the value wanted
        results[item.alias] = results[item.alias].id ;
      console.log('result dentro AssociationsService',results);
    }
    return results;
  }
};
