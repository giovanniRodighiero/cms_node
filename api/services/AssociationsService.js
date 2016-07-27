"use strict";
var _ = require('lodash');

module.exports = {
  cutNotWantedSingle: function(results, item, fieldName, value){
    if(Array.isArray(results)){
      for (var i = 0; i < results.length; i++) {// loop the query results
        if(Array.isArray(results[i][item.alias])){
          for (var j = 0; j < results[i][item.alias].length; j++) {
            if(results[i][item.alias][j][fieldName] != value)
              results[i][item.alias][j] = results[i][item.alias][j].id ;
          }
        }else{
          if(results[i][item.alias][fieldName] != value)// if the populated model hasn't the value wanted
            results[i][item.alias] = results[i][item.alias].id ;
        }
      }
    }else{
      if(Array.isArray(results[item.alias])){
        for (var j = 0; j < results[item.alias].length; j++) {
          if(results[item.alias][j][fieldName] != value)
            results[item.alias][j] = results[item.alias][j].id ;
        }
      }else{
        if(results[item.alias][fieldName] != value)// if the populated model hasn't the value wanted
          results[item.alias] = results[item.alias].id ;
      }
      // if(results[item.alias][fieldName] != value)// if the populated model hasn't the value wanted
      //   results[item.alias] = results[item.alias].id ;
    }
    return results;
  }
};
