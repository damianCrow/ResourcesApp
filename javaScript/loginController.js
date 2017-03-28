app.controller('loginController', ["$scope", "$http", function($scope, $http) {

  $scope.test = function() {
    
    $http({
      url: baseUrl + '/test', 
      method: 'GET'
    }).then(function success(response) {

     console.log(response);
    }, 
    function error(response) {

     console.log(response);
    });
  }
}]);