var app = angular.module('resourcesApp', ['ngRoute']);

app.config(["$routeProvider", "$locationProvider", function ($routeProvider, $locationProvider) {

	$routeProvider.when('/', {templateUrl: 'templates/home.html'});
  $routeProvider.when('/login', {templateUrl: 'templates/login.html'});
  $routeProvider.when('/bookings', {templateUrl: 'templates/resources_view.html'});
  $routeProvider.when('/resources', {templateUrl: 'templates/resources.html'});
  $routeProvider.when('/signup', {templateUrl: 'templates/signup.html'});
  $routeProvider.otherwise({redirectTo: '/'});

  if(window.history && window.history.pushState){

    // $locationProvider.html5Mode({
    //   enabled: true,
    // requireBase: false,
    //   rewriteLinks: true
    // }).hashPrefix('!');
  }
}]);