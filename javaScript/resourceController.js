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
        messageService.showMessage('alert-success', response.data, $rootScope.closeMessage);
      });
  	});
  }

	$scope.updateResource = function(id, idx) {

  	messageService.showConfirm("Are you sure you want to UPDATE this resource?", function() {

  		var isAdmin, isBoockable;
      var formData = new FormData();
      var names = $('#resourceName' + idx)[0].value.split(' ');

      if($('#resourceIsAdmin' + idx)[0].checked) {

      	isAdmin = 1;
      }
      else {

      	isAdmin = 0;
      }

      if($('#resourceBookable' + idx)[0].checked) {

      	isBoockable = 1;
      }
      else {

      	isBoockable = 0;
      }

      formData.append('firstName', names[0]);
      formData.append('lastName', names[1]);
      formData.append('occupation', $('#resourceOccupation' + idx)[0].value);
      formData.append('email', $('#resourceEmail' + idx)[0].value);
      formData.append('admin', isAdmin);
      formData.append('bookable', isBoockable);

      $rootScope.makeRequest('POST', 'api/public/resource/update/' + id, formData, function(response) {

        messageService.showMessage('alert-success', response.data, $rootScope.closeMessage);
      });
    });
  }
}]);