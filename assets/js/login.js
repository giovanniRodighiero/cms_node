(function(){
  "use strict";
  var login = angular.module('login',['ng-admin']);
  login.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('login', {
      url: "/login",
      templateUrl: "templates/login.html",
      controller: "LoginController"
    })
});
login.constant('test','mia costante');
login.controller('LoginController',['$scope','$rootScope','$state', 'Restangular','test', function($scope, $rootScope,$state, Restangular, test){
  $scope.login = {};
  $scope.submit = function(){
    var login = Restangular.all('signin');
    login.post($scope.login).then(function(result){
      console.log(result);
      $rootScope.user = result;
      test = result;
      $state.go('dashboard');
    });
  }
}]);
})();
