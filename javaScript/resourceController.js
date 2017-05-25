app.controller('resourceController', ['$rootScope', '$scope','getInfoService', 'messageService', function($rootScope, $scope, getInfoService, messageService) {

	getInfoService.getResources(function(response) {

    $scope.resources = response.data;
  });

  $scope.deleteResource = function(id) {

  	messageService.showConfirm("Are you sure you want to DELETE this resource and all associated bookings?", function() {

  		$rootScope.makeRequest('DELETE', 'api/public/resource/' + id, null, function(response) {

  			getInfoService.getResources(function(response) {

			    $scope.resources = response.data;
			  });
        messageService.showMessage('alert-info', response.data, $rootScope.closeMessage);
      });
  	});
  }

	$scope.updateResource = function(id) {

  	messageService.showConfirm("Are you sure you want to UPDATE " + $scope.bookingToDisplay.title + "?", function() {

      var formData = new FormData();
      var names = $('#resourceName')[0].value.split(' ');

      formData.append('firstName', names[0]);
      formData.append('lastName', names[1]);
      formData.append('occupation', $('#resourceOccupation')[0].value);
      formData.append('email', $('#resourceEmail')[0].value);
      formData.append('admin', $('#editProjectName')[0].value);

      $rootScope.makeRequest('POST', 'api/public/booking/update/' + bookingId, formData, function(response) {

        messageService.showMessage('alert-info', response.data, $rootScope.closeMessage);
      });
    });
  }
}]);