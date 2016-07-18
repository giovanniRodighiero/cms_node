(function(){
  "use strict";
  var myApp = angular.module('interceptors', ['ng-admin']);
  myApp.config(['RestangularProvider', function(RestangularProvider){
    RestangularProvider.addResponseInterceptor(function(data, operation, what, url, response, deferred) {
      // your code here
      if(url === '/signin' || url === '/infos')
        return data.data;
      else
        return data.data.results;
    });
    RestangularProvider.setErrorInterceptor(function(response, deferred, responseHandler) {
      return true;
    });
  }]);

})();
