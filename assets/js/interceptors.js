(function(){
  "use strict";
  var interceptors = angular.module('interceptors', ['ng-admin','ngCookies','services']);
  interceptors.run(['Restangular','$cookies', 'NgAdminConfiguration', 'AuthService', function(Restangular, $cookies, NgAdminConfiguration, AuthService){
    Restangular.addResponseInterceptor(function(data, operation, what, url, response, deferred) {
      if(url === '/signin' || url === '/permittedModels')
        return data.data;
      else{
        if(operation === 'get')
          return data.data;
        else
          return data.data.results;
      }
    });
    Restangular.setDefaultHeaders({authorization: 'JWT '+$cookies.get('cms-token')});

    Restangular.setErrorInterceptor(function(response, deferred, responseHandler) {
      if(response.status === 401){
        console.log('response', response);
        AuthService.redirectLogin();
      }else{
        console.log('response', response);
      }
      return true;
    });
  }]);

})();
