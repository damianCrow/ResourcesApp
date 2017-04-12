var app = angular.module('resourcesApp', ['ngRoute']);

app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {

  $routeProvider.when('/login', {templateUrl: 'templates/login.html'});

	$routeProvider.when('/', {templateUrl: 'templates/home.html', resolve: {

      auth: ['authService', function(authService) { return authService.userLoggedIn();}]
    }
  });
  $routeProvider.when('/bookings', {templateUrl: 'templates/resources_view.html', resolve: {

      auth: ['authService', function(authService) { return authService.isAdminUser();}]
    }
  });
  $routeProvider.when('/resources', {templateUrl: 'templates/resources.html', resolve: {

      auth: ['authService', function(authService) { return authService.isAdminUser();}]
    }
  });
  $routeProvider.when('/signup', {templateUrl: 'templates/signup.html', resolve: {

      auth: ['authService', function(authService) { return authService.isAdminUser();}]
    }
  });

  $routeProvider.otherwise({redirectTo: '/login'});

  if(window.history && window.history.pushState) {

    // $locationProvider.html5Mode({
    //   enabled: true,
    // requireBase: false,
    //   rewriteLinks: true
    // }).hashPrefix('!');
  }
}]);

app.run(['$rootScope', 'authService', '$location', function($rootScope, authService, $location) {

  $rootScope.$on('$routeChangeError', function(event, current, previous, rejection) {

    if(rejection) {

      $location.path('/login');
    } 
  });
}]);