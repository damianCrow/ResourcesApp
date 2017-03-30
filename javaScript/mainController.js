app.controller('mainController', ['$scope', '$http', '$rootScope', function($scope, $http, $rootScope) {

  $rootScope.makeRequest = function(reqMethod, endPoint, reqData, successCallback) {
    
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

     console.log(response);
    });
  }
}]);