app.controller('resourceController', ['$scope','getInfoService', function($scope, getInfoService) {

	getInfoService.getResources(function(response) {

    $scope.resources = response.data;
  });
}]);