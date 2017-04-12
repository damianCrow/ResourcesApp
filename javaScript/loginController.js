app.controller('loginController', ['$scope', 'authService', function($scope, authService) {

	$scope.login = authService.login;
 
}]);