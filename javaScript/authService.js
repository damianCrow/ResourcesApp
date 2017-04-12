app.service('authService', ['$rootScope', '$window', '$location', 'messageService', '$q', function($rootScope, $window, $location, messageService, $q) {

  return {

    login: function() {

    	var formData = new FormData();

	    formData.append('email', $('#logInEmail')[0].value);
	    formData.append('password', $('#logInPassword')[0].value);

    	$rootScope.makeRequest('POST', 'api/public/resource', formData, function(response) {

    		if(response.data === 'user not found!') {

    			messageService.showMessage('Incorrect Email address or Password! Please try again.', function() {

    				$rootScope.closeMessage();
                    return $q.reject('userNotLoggedIn');
    			});
    		}
    		else {

    			$window.sessionStorage.setItem('user', angular.toJson(response.data));
                $rootScope.redirect('/');
    		}
    	});

    },

    logOut: function() {

    	$window.sessionStorage.removeItem('user');
    	$rootScope.redirect('/login');
    },

    userLoggedIn: function() {

        if($window.sessionStorage.getItem('user') !== null) {

            return true;
        }
        else {

            return $q.reject('userNotLoggedIn');
        }
    	
    },

    isAdminUser: function() { 

        if(!$window.sessionStorage.getItem('user')) {

            return $q.reject('userNotAdmin');
        }
        else {

        	if(angular.fromJson($window.sessionStorage.getItem('user')).admin === '1') {

        		return true;
        	}
        	else {

        		return $q.reject('userNotAdmin');
        	}
        }
    },

    getLoggedInUser: function() {

    	return angular.fromJson($window.sessionStorage.getItem('user'));
    },
  };
}]);