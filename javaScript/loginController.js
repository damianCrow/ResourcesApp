// app.controller('loginController', ['$scope', '$http', function($scope, $http) {

 
// }]);

app.controller('resourceViewController', ['$scope', '$http', '$rootScope', 'getInfoService', 'filterService', 'messageService', '$timeout', function($scope, $http, $rootScope, getInfoService, filterService, messageService, $timeout) {

	$scope.creatingBooking = false;
	$scope.filterObj = {};
	$scope.eventSources = [{
    events: []
  }];

  $('#newBookingForm, #displayBookingForm').draggable();

  // $(document).ready(function() {

  //   var thisYear = new Date().getFullYear();
  //   var thisMonth = new Date().getMonth() + 1; // + 1 starts the month array at 1 instead of 0.
  //   var monthLength = new Date(thisYear, thisMonth, 0).getDate();

  //   if(thisMonth < 10) {

  //     thisMonth = '0' + thisMonth;
  //   }

  //   $scope.bookingsForThisMonthQuery = 'start_date=' + thisYear + '-' + thisMonth + '-01&end_date=' + thisYear + '-' + thisMonth + '-' + monthLength;
    
  //   getInfoService.getBookingsDateRange($scope.bookingsForThisMonthQuery, function(responseData) {

  //     populateEventsArray($scope.eventSources[0].events, responseData);
  //   });
  // });

  getInfoService.getProjects(function(response) {

  	$scope.projects = response.data;

  	// getInfoService.getBookings($scope.eventSources[0].events, populateEventsArray);

  	getInfoService.getResources(function(response) {

  		$scope.resources = response.data;
  	});
  });

  function populateEventsArray(arrayToPopulate, dataArray, callBack) {

  	arrayToPopulate.splice(0, arrayToPopulate.length);

  	angular.forEach(dataArray, function(booking, idx) {

      var bookingData = {
        title: booking.title,
        start: booking.start_date,//.substring(0, 10),
        end: booking.end_date,//.substring(0, 10),
        id: booking.id,
        notes: booking.notes,
        resource_name: booking.resource_name,
        project_name: booking.project_name,
        createdBy: booking.created_by,
        textColor: 'white'
      }

      for(var i = 0; i < $scope.projects.length; i++) {

  			if($scope.projects[i].name === booking.project_name) {

  				bookingData.color = $scope.projects[i].colour_code;
  			}
  		}

      arrayToPopulate.push(bookingData);
    });

    if(callBack) {

    	callBack(arrayToPopulate);
    }
  }

  function findBooking(bookingId) {

    for(var i = 0; i < $scope.eventSources[0].events.length; i++) {
     
      if(parseInt(bookingId) === parseInt($scope.eventSources[0].events[i].id)) {

       return $scope.eventSources[0].events[i];
      }
    }
  }

	$scope.uiConfig = {

    calendar: {
      height: 700,
      editable: true,
      selectable: true,
      // startEditable: true,
      // durationEditable: true,
      selectHelper: true,
      allDayDefault: false,
      header: {
        left: 'month agendaWeek',
        center: 'title',
        right: 'today prev,next'
      },

      viewRender: function(view, element) {

        $scope.bookingsForThisMonthQuery = 'start_date=' + view.start.format() + '&end_date=' + view.end.format();
        
        getInfoService.getBookingsDateRange($scope.bookingsForThisMonthQuery, function(arrayOfResults) {

          filterService.filterObjArray(arrayOfResults, $scope.filterObj, function(resultArray) {

            populateEventsArray($scope.eventSources[0].events, resultArray);
          });
        });
      },

      eventClick: function(event) {

        $scope.bookingToDisplay = findBooking(event.id);

      	$scope.showBookingData = true;
      },

      eventDrop: function(event, delta, revertFunc) {

        if(!confirm("The start date for " + event.title + " will be changed to: " + new Date(event._start._d).toISOString())) {
          
          revertFunc();
        }
        else {

        	$rootScope.makeRequest('PUT', 'api/public/booking/update/' + event.id + '?start_date=' + new Date(event._start._d).toISOString(), null, function(response) {

        		messageService.showMessage(response.data, $rootScope.closeMessage);
					});
        }
      },

      select: function(start, end, allDay) {

      	$scope.creatingBooking = true;

      	$scope.bookingDates = {
      		startDate: new Date(start).toISOString(),
      		endDate: new Date(end).toISOString()
      	};
      },

      eventResize: function(event, delta, revertFunc) {

        if(!confirm("The end date for " + event.title + " will be changed to: " + new Date(event._end._d).toISOString())) {
          
          revertFunc();
        }
        else {

        	$rootScope.makeRequest('PUT', 'api/public/booking/update/' + event.id + '?end_date=' + new Date(event._end._d).toISOString(), null, function(response) {

            messageService.showMessage(response.data, $rootScope.closeMessage);
					});
        }
    	}
    }
  };

	$scope.closeForm = function(formWrapperId) {

    if(formWrapperId === 'newBookingForm') {

      $('#bookingTitle')[0].value = '';
      $('#bookingNotes')[0].value = '';
      $('#resourceName')[0].value = '';
      $('#projectName')[0].value = '';

      $scope.creatingBooking = false;
    }

    if(formWrapperId === 'displayBookingForm') {

      $scope.showBookingData = false;
    }
	}

	// $scope.addBookingToCalendar = function(calendarId, formData, queryParamsString) {

	// 	$rootScope.makeRequest('GET', 'api/public/booking/specific/?' + queryParamsString, null, function(response) {

 //      angular.forEach(response.data, function(item) {

 //        $scope.eventSources[0].events.push(item);
 //      });
 //   	});
	// }

	$scope.addBookingToDb = function(data) {

		var formData = new FormData();

    formData.append('start_date', data.startDate);
    formData.append('end_date', data.endDate);
    formData.append('title', $('#bookingTitle')[0].value);
   	formData.append('notes', $('#bookingNotes')[0].value);
   	formData.append('resource_name', $('#resourceName')[0].value);
   	formData.append('project_name', $('#projectName')[0].value);

   	$rootScope.makeRequest('POST', 'api/public/booking', formData, function(response) {

      messageService.showMessage(response.data, $rootScope.closeMessage);
      getInfoService.getBookings($scope.eventSources[0].events, populateEventsArray);
   		// $scope.addBookingToCalendar('#resourceCalendar', formData, 'start_date=' + formData.get('start_date') + '&title=' + formData.get('title'));
   	});

		$scope.closeForm('newBookingForm');
	}

	$scope.deleteBooking = function(bookingId) {

		if(!confirm("Are you sure you want to DELETE " + findBooking(bookingId).title + "?")) {
          
      $scope.closeForm('displayBookingForm');
    }
    else {

			$rootScope.makeRequest('DELETE', 'api/public/booking/' + bookingId, null, function(response) {

				messageService.showMessage(response.data, $rootScope.closeMessage);
	   		getInfoService.getBookings($scope.eventSources[0].events, populateEventsArray);
	   		$scope.closeForm('displayBookingForm');
	   	});
		}
	}

	$scope.updateBooking = function(bookingId) {
	
		if(!confirm("Are you sure you want to UPDATE " + findBooking(bookingId).title + "?")) {
          
      $scope.closeForm('displayBookingForm');
    }
    else {

    	var formData = new FormData();

	    formData.append('title', $('#editBookingTitle')[0].value);
	   	formData.append('notes', $('#editBookingNotes')[0].value);
	   	formData.append('resource_name', $('#editResourceName')[0].value);
	   	formData.append('project_name', $('#editProjectName')[0].value);

			$rootScope.makeRequest('POST', 'api/public/booking/update/' + bookingId, formData, function(response) {

				messageService.showMessage(response.data, $rootScope.closeMessage);
        getInfoService.getBookings($scope.eventSources[0].events, populateEventsArray);
	   		$scope.closeForm('displayBookingForm');
	   	});
		}
	}

	$scope.filterMethod = function(selectValue, filterKey) {

		var bookingsArray = [];

		$scope.filterObj[filterKey] = selectValue;

		getInfoService.getBookingsDateRange($scope.bookingsForThisMonthQuery, function(arrayOfResults) {

			filterService.filterObjArray(arrayOfResults, $scope.filterObj, function(resultArray) {

        populateEventsArray($scope.eventSources[0].events, resultArray);
			});
		});
	}
}]);