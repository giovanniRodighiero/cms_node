(function(){
  "use strict";
  var login = angular.module('login',['ui.router','ngCookies']);
  login.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('login', {
      url: "/",
    //  parent: 'main',
      templateUrl: "templates/login.html",
      controller: "LoginController"
    });
    $urlRouterProvider.rule(function ($injector, $location) {
      var path = $location.path();
      console.log(path);
      if (path != '/restAdmin') {
          $location.path('/');
      }
    });
  });
login.controller('LoginController',['$scope','$cookies','$http','$window', function($scope, $cookies, $http, $window){
  $scope.login = {};
  $scope.error = false;
  if($cookies.get('cms-token'))
    $cookies.remove('cms-token');
  $scope.submit = function(){
    $http.post('/signin', $scope.login).then(function(result){
      $cookies.put('cms-token', result.data.data.token);
      $window.location.href = '/restAdmin';
    }, function(err){
      $scope.error = true;
    });
  };
}]);
})();
