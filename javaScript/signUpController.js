app.controller('signUpController', ['$scope', '$rootScope', 'messageService', function($scope, $rootScope, messageService) {

 $scope.resourceTypes = [
	 'Developer',
	 'Designer',
	 'Project Manager',
	 'Copy Writer'
 ];

 	$scope.signUp = function() {

 		if($('#signUpAdmin')[0].checked) {

 			var admin = 1;
 		}
 		else {

 			admin = 0;
 		}

 		if($('#signUpBookable')[0].checked) {

	 			var bookable = 1;
 		}
 		else {

 			bookable = 0;
 		}

 		var formData = new FormData();

    formData.append('first_name', $('#signUpFirstName')[0].value);
    formData.append('last_name', $('#signUpLastName')[0].value);
    formData.append('email', $('#signUpEmail')[0].value);
    formData.append('resource_type', $('#signUpResourceType')[0].value);
    formData.append('password', $('#signUpPassword')[0].value);
    formData.append('admin', admin);
    formData.append('bookable', bookable);

    $rootScope.makeRequest('POST', 'api/public/resource/signup', formData, function(response) {

    	messageService.showMessage(response.data, $rootScope.closeMessage);
    	$rootScope.redirect('/');
    });
	}
}]);