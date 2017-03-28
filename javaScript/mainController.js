app.controller('mainController', ['$scope', '$http', '$rootScope', function($scope, $http, $rootScope) {

  $rootScope.baseUrl = 'http://localhost:8888/api/public';

  $rootScope.makeRequest = function(reqMethod, endpoint, reqData, successCallback) {
    
    if(!reqData) {

      reqData = null;
    }

    $http({
      url: $rootScope.baseUrl + endpoint, 
      method: reqMethod,
      data: reqData,
      transformRequest: angular.identity,
      headers: {'Content-Type': undefined, 'Process-Data': false}
    }).then(function success(response) {

      successCallback(response);
    }, 
    function error(response) {

     console.log(response);
    });
  }
}]);