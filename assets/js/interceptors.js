(function(){
  "use strict";
  var interceptors = angular.module('interceptors', ['ng-admin','ngCookies','services']);
  interceptors.run(['Restangular','$cookies', 'NgAdminConfiguration', 'AuthService', function(Restangular, $cookies, NgAdminConfiguration, AuthService){
    Restangular.addResponseInterceptor(function(data, operation, what, url, response, deferred) {
      if(operation === 'getList'){
        response.totalCount = data.data.totalCount;
        return data.data.results;
      }
      else{
        return data.data;
      }
    });
    Restangular.addFullRequestInterceptor(function(element, operation, what, url, headers, params, httpConfig) {
        if (operation == 'getList') {
            params.page = params._page;
            params.limit = params._perPage;
            delete params._page;
            delete params._perPage;
        }
        return { params: params };
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
