app.controller('resourceViewController', ['$scope', '$http', '$rootScope', 'getInfoService', 'filterService', '$timeout', function($scope, $http, $rootScope, getInfoService, filterService, $timeout) {

	$scope.creatingBooking = false;
	$scope.filterObj = {};
	$scope.eventSources = [{
    events: []
  }];

  getInfoService.getProjects(function(response) {

  	$scope.projects = response.data;

  	getInfoService.getBookings($scope.eventSources[0].events, populateEventsArray);

  	getInfoService.getResources(function(response) {

  		$scope.resources = response.data;
  	});
  });

  function populateEventsArray(arrayToPopulate, dataArray, callBack) {
  	
  	angular.forEach(dataArray, function(booking, idx) {

      var bookingData = {
        arrayIndex: idx,
        title: booking.title,
        start: booking.start_date,
        end: booking.end_date,
        id: booking.id,
        notes: booking.notes,
        resourceName: booking.resource_name,
        projectName: booking.project_name,
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

	$scope.uiConfig = {

    calendar: {
      height: window.innerHeight / 1.125,
      editable: true,
      selectable: true,
      selectHelper: true,
      allDayDefault: true,
      header: {
        left: 'month agendaWeek',
        center: 'title',
        right: 'today prev,next'
      },

      viewRender: function(view, element) {
        // console.log("View Changed: ", view.start, view.end);
      },

      eventClick: function(event) {

        for(var i = 0; i < $scope.eventSources[0].events.length; i++) {
          
          if(parseInt(event.id) === $scope.eventSources[0].events[i].id) {

            $scope.bookingToDisplay = $scope.eventSources[0].events[i];
          }
        }

      	$scope.showBookingData = true;
      },

      eventDrop: function(event, delta, revertFunc) {

        if(!confirm("The start date for " + event.title + " will be changed to: " + event.start.format())) {
          
          revertFunc();
        }
        else {

        	$rootScope.makeRequest('PUT', 'api/public/booking/update/' + event.id + '?start_date=' + event.start.format() + '&end_date=' + event.end.format(), null, function(response) {

        		console.log(response);
					});
        }
      },
      select: function(start, end, allDay) {

      	$scope.creatingBooking = true;

      	$scope.bookingDates = {
      		startDate: start.format(),
      		endDate: end.format()
      	};
      },
      eventResize: function(event, delta, revertFunc) {

        if(!confirm("The end date for " + event.title + " will be changed to: " + event.end.format())) {
          
          revertFunc();
        }
        else {

        	$rootScope.makeRequest('PUT', 'api/public/booking/update/' + event.id + '?end_date=' + event.end.format(), null, function(response) {

        		console.log(response);
					});
        }
    	}
    }
  };

	$scope.closeForm = function() {

		$('#bookingTitle')[0].value = '';
 		$('#bookingNotes')[0].value = '';
 		$('#resourceName')[0].value = '';
 		$('#projectName')[0].value = '';

		$scope.creatingBooking = false;
		$scope.showBookingData = false;
	}

	$scope.addBookingToCalendar = function(calendarId, formData, queryParamsString) {

		$rootScope.makeRequest('GET', 'api/public/booking/specific/?' + queryParamsString, null, function(response) {

      angular.forEach(response.data, function(item) {

        $scope.eventSources[0].events.push(item);
      });
   	});
		
		// $(calendarId).fullCalendar('renderEvent',
  //     {
  //       title: formData.get('title'),
  //       start: formData.get('start_date'),
  //       end: formData.get('end_date')
		// 	}, true
		// );
	}

	$scope.addBookingToDb = function(data) {

		var formData = new FormData();

    formData.append('start_date', data.startDate);
    formData.append('end_date', data.endDate);
    formData.append('title', $('#bookingTitle')[0].value);
   	formData.append('notes', $('#bookingNotes')[0].value);
   	formData.append('resource_name', $('#resourceName')[0].value);
   	formData.append('project_name', $('#projectName')[0].value);

   	$rootScope.makeRequest('POST', 'api/public/booking', formData, function(response) {

   		$scope.addBookingToCalendar('#resourceCalendar', formData, 'start_date=' + formData.get('start_date') + '&title=' + formData.get('title'));
   	});

		$scope.closeForm();
	}

	$scope.deleteBooking = function(bookingId, eventSourcesArrayIndex) {

		if(!confirm("Are you sure you want to DELETE " + $scope.eventSources[0].events[eventSourcesArrayIndex].title + "?")) {
          
      $scope.closeForm();
    }
    else {

			$rootScope.makeRequest('DELETE', 'api/public/booking/' + bookingId, null, function(response) {

				console.log(response);
	   		$scope.eventSources[0].events.splice(eventSourcesArrayIndex, 1);
	   		$scope.closeForm();
	   	});
		}
	}

	$scope.updateBooking = function(bookingId, eventSourcesArrayIndex) {
	
		if(!confirm("Are you sure you want to UPDATE " + $scope.eventSources[0].events[eventSourcesArrayIndex].title + "?")) {
          
      $scope.closeForm();
    }
    else {

    	var formData = new FormData();

	    formData.append('title', $('#editBookingTitle')[0].value);
	   	formData.append('notes', $('#editBookingNotes')[0].value);
	   	formData.append('resource_name', $('#editResourceName')[0].value);
	   	formData.append('project_name', $('#editProjectName')[0].value);

			$rootScope.makeRequest('POST', 'api/public/booking/update/' + bookingId, formData, function(response) {

				console.log(response);

	   		// $scope.eventSources[0].events[eventSourcesArrayIndex].title = formData.get('title');
	   		// $scope.eventSources[0].events[eventSourcesArrayIndex].notes = formData.get('notes');
	   		// $scope.eventSources[0].events[eventSourcesArrayIndex].resourceName = formData.get('resource_name');
	   		// $scope.eventSources[0].events[eventSourcesArrayIndex].projectName = formData.get('project_name');
	   		$scope.closeForm();
	   	});
		}
	}

	$scope.filterMethod = function(selectValue, filterKey) {

		var bookingsArray = [];

		$scope.filterObj[filterKey] = selectValue;

		getInfoService.getBookings(bookingsArray, populateEventsArray, function(arrayOfResults) {

			filterService.filterObjArray(arrayOfResults, $scope.filterObj, function(resultArray) {

				$scope.eventSources[0].events.splice(0, $scope.eventSources[0].events.length);

				angular.forEach(resultArray, function(booking) {

					$scope.eventSources[0].events.push(booking);
				});
			});
		});
	}
}]);