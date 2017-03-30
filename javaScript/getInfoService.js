app.service('getInfoService', ['$rootScope', '$http', function($rootScope, $http) {

  return {

    getBookings: function(callBack) {

      $rootScope.makeRequest('GET', 'api/public/booking', null, function(response) {

        callBack(response);
      });
    },

    getProjects: function(callBack) {

      $rootScope.makeRequest('GET', 'api/public/project', null, function(response) {

        callBack(response);
      });
    }
  }
}]);