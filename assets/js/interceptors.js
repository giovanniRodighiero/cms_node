(function(){
  "use strict";
  var myApp = angular.module('interceptors', ['ng-admin']);
  myApp.config(['RestangularProvider', function(RestangularProvider){
    RestangularProvider.addResponseInterceptor(function(data, operation, what, url, response, deferred) {
      // your code here
      console.log('dentro interceptors',data, url);
      if(url === '/signin')
        return data.data;
      else
        return data.data.results;
    });
    RestangularProvider.setErrorInterceptor(function(response, deferred, responseHandler) {
      console.log(response);
      return true;
    });
  }]);

})();
