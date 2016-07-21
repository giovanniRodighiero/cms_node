(function(){
  "use strict";
  var interceptors = angular.module('interceptors', ['ng-admin','ngCookies','services']);
  interceptors.run(['Restangular','$cookies', 'NgAdminConfiguration', 'AuthService', function(Restangular, $cookies, NgAdminConfiguration, AuthService){
    Restangular.addResponseInterceptor(function(data, operation, what, url, response, deferred) {
      if(url === '/signin' || url === '/permittedModels')
        return data.data;
      else{
        console.log(operation, url);
        if(operation === 'get'){
          console.log('************ get ***********');
          console.log(data.data);
          return data.data;

        }
        else{
          console.log('********* list *******');
          console.log(Array.isArray(data.data.results));
          return data.data.results;
        }
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
