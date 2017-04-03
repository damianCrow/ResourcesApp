app.service('getInfoService', ['$rootScope', '$http', function($rootScope, $http) {

  return {

    getBookings: function(arrayToPopulate, callBack, callBack2) {

      $rootScope.makeRequest('GET', 'api/public/booking', null, function(response) {

        callBack(arrayToPopulate, response.data, callBack2);
      });
    },

    getProjects: function(callBack) {

      $rootScope.makeRequest('GET', 'api/public/project', null, function(response) {

        callBack(response);
      });
    },

    getResources: function(callBack) {

      $rootScope.makeRequest('GET', 'api/public/resource', null, function(response) {

        callBack(response);
      });
    }
  }
}]);