app.controller('navController', ['$scope', '$location', 'authService', function($scope, $location, authService) {

	$scope.logOut = authService.logOut;

	$scope.isAdmin = authService.isAdminUser;

	$scope.isLoggedIn = authService.userLoggedIn;

	$scope.isActive = function(viewLocation) { 

    return viewLocation === $location.path();
  }
}]);