(function(){
  "use strict";
  var interceptors = angular.module('interceptors', ['ng-admin','ngCookies']);
  interceptors.run(['Restangular','$cookies', function(Restangular, $cookies){
    Restangular.addResponseInterceptor(function(data, operation, what, url, response, deferred) {
      // your code here
      console.log('dentro interceptors '+url);
      if(url === '/signin' || url === '/permittedModels')
        return data.data;
      else
        return data.data.results;
    });
    Restangular.setDefaultHeaders({authorization: 'JWT '+$cookies.get('cms-token')});

    Restangular.setErrorInterceptor(function(response, deferred, responseHandler) {
      return true;
    });
  }]);

})();
