var app = angular.module('resourcesApp', ['ngRoute', 'ui.calendar']);

var baseUrl = 'http://localhost:8888/api/public';

app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {

	$routeProvider.when('/', {templateUrl: 'templates/home.html'});
  $routeProvider.when('/login', {templateUrl: 'templates/login.html'});
  $routeProvider.when('/resources', {templateUrl: 'templates/resources_view.html'});
  $routeProvider.otherwise({redirectTo: '/'});

  if(window.history && window.history.pushState){

    // $locationProvider.html5Mode({
    //   enabled: true,
    // requireBase: false,
    //   rewriteLinks: true
    // }).hashPrefix('!');
  }
}]);