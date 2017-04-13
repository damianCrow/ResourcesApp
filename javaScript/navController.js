app.controller('navController', ['$scope', '$location', 'authService', function($scope, $location, authService) {

	$scope.logOut = authService.logOut;

	$scope.isActive = function(viewLocation) { 

    return viewLocation === $location.path();
  }
}]);