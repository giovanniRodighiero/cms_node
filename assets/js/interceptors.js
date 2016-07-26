(function(){
  "use strict";
  var interceptors = angular.module('interceptors', ['ng-admin','ngCookies','services']);
  interceptors.config(['$httpProvider', function($httpProvider){
    $httpProvider.interceptors.push(['$q','$injector', function($q, $injector){
      return {
       'request': function(config) {
         var $cookies = $injector.get('$cookies');
           config.headers['authorization'] = 'JWT '+$cookies.get('cms-token');
           return config;
        },

        'response': function(response) {
          if(response.config.url === '/uploadFile'){
            var payload = response.data.data;
            response.data['picture_name'] = payload.picture_name;
          }
          return response;
        }
      };
    }]);
  }]);
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
      // if(url === 'http://localhost:1337/user')
      //   element['mioHeader'] = 3;
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
      switch (response.status) {
        case 401:
          AuthService.redirectLogin();
          break;
        default:

      }
      return true;
      // if(response.status === 401){
      //   console.log('response', response);
      //   AuthService.redirectLogin();
      // }else{
      //   console.log('response', response);
      // }
      // return true;
    });
  }]);

})();
