app.controller('mainController', ['$scope', '$http', '$rootScope', '$location', function($scope, $http, $rootScope, $location) {

  $rootScope.makeRequest = function(reqMethod, endPoint, reqData, successCallback, errorCallback) {
    
    if(!reqData) {

      reqData = null;
    }

    $http({
      url: endPoint, 
      method: reqMethod,
      data: reqData,
      transformRequest: angular.identity,
      headers: {'Content-Type': undefined, 'Process-Data': false}
    }).then(function success(response) {

      successCallback(response);
    }, 
    function error(response) {

      if(errorCallback) {

        errorCallback(response);
      }
    });
  }

  $rootScope.closeMessage = function() {
 
    $('.custom_alert').remove();
  }

  $rootScope.redirect = function(newPath) {
 
   return $location.path(newPath);
  }

  $rootScope.resourceTypes = [
   'Developer',
   'Designer',
   'Project Manager',
   'Copy Writer'
  ];
}]);