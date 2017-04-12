app.service('authService', ['$rootScope', '$window', '$location', 'messageService', '$q', function($rootScope, $window, $location, messageService, $q) {

  var userInfo;

  return {

    login: function() {

        var deferred = $q.defer();
    	var formData = new FormData();

	    formData.append('email', $('#logInEmail')[0].value);
	    formData.append('password', $('#logInPassword')[0].value);

    	$rootScope.makeRequest('POST', 'api/public/resource', formData, function(response) {

    		if(response.data === 'user not found!') {

    			messageService.showMessage('Incorrect Email address or Password! Please try again.', function() {

    				deferred.reject(error);
    				$rootScope.closeMessage();
                    $rootScope.redirect('/login');
    			});
    		}
    		else {

                userInfo = response.data;
                deferred.resolve(userInfo);
    			$window.sessionStorage.setItem('user', angular.toJson(userInfo));
    		}
    	}, function(error) {

            deferred.reject(error);
        });

        return deferred.promise;
    },

    logOut: function() {

    	$window.sessionStorage.removeItem('user');
        userInfo = null;
    	$rootScope.redirect('/login');
    },

    userLoggedIn: function() {

    	return $window.sessionStorage.getItem('user') !== null;
    },

    isAdminUser: function() { 

    	if(angular.fromJson($window.sessionStorage.getItem('user')).admin === '1') {

    		return true;
    	}
    	else {

    		return false;
    	}
    },

    getLoggedInUser: function() {

    	return angular.fromJson($window.sessionStorage.getItem('user'));
    },
  };
}]);