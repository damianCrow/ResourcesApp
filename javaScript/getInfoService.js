app.service('getInfoService', ['$rootScope', '$http', function($rootScope, $http) {

  return {

    getBookings: function(arrayToPopulate, callBack, callBack2) {

      $rootScope.makeRequest('GET', 'api/public/booking', null, function(response) {

        if(callBack2) {

          callBack(arrayToPopulate, response.data, callBack2);
        }
        else {

          callBack(arrayToPopulate, response.data);
        }
      });
    },

    getBookingsDateRange: function(queryString, callBack) {

      $rootScope.makeRequest('GET', 'api/public/booking/daterange/?' + queryString, null, function(response) {

        callBack(response.data);
      });
    },

    getProjects: function(callBack, callBack2) {

      $rootScope.makeRequest('GET', 'api/public/project', null, function(response) {

        if(callBack2) {

          callBack2(response, callBack2);
        }
        else {

          callBack(response);
        }
      });
    },

    getResources: function(callBack) {

      $rootScope.makeRequest('GET', 'api/public/resource', null, function(response) {

        callBack(response);
      });
    }
  }
}]);