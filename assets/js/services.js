(function(){
  var services = angular.module('services',['ng-admin','ngCookies']);

  services.factory('AuthService',['$cookies','$window', function($cookies, $window){
    return{
      redirectLogin: function(){
        if(!$cookies.get('csm-token'))
          $cookies.remove('cms-token');
        $window.location.href = '/';
      },
      isLogged: function() {
        return ($cookies.get('cms-token') != undefined);
      }
    }
  }]);

  services.factory('PermissionsService',['Restangular', function(Restangular){
    var permitted = [];
    return{
      permittedModels: Restangular.service('/permittedModels'),
      filterModels: function(entities, permitted){
        for (var i = 0; i < entities.length; i++) {
          if(permitted.indexOf(entities[i]._name) == -1){
            entities.splice(i,1);
          }
        }
        return entities;
      },
      filterDashboard: function(entities, permitted){
        for (var i = 0; i < entities.length; i++) {
          if(permitted.indexOf(entities[i]) == -1){
            entities.splice(i,1);
          }
        }
        return entities;
      }
    }
  }]);

})();
