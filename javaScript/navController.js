app.controller('navController', ['$scope', '$location', 'authService', function($scope, $location, authService) {

	$scope.logOut = authService.logOut;

	if(!authService.isAdminUser) {

		$scope.userNotAdmin = true;
	}
	else {

		$scope.userNotAdmin = false;
	}
	
	

	$scope.isLoggedIn = authService.userLoggedIn;

	$scope.isActive = function(viewLocation) { 

    return viewLocation === $location.path();
  }
}]);