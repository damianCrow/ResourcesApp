app.controller('resourceViewController', ['$scope', '$http', '$rootScope', 'getInfoService', function($scope, $http, $rootScope, getInfoService) {

	$scope.creatingBooking = false;
	$scope.eventSources = [{
    events: [],
    textColor: 'white' // an option!
  }];

  getInfoService.getProjects(function(response) {

  	$scope.projects = response.data;
  	getInfoService.getBookings(populateEventsArray);
  });

  function populateEventsArray(response) {
  	
  	angular.forEach(response.data, function(booking, idx) {

      var bookingData = {
        arrayIndex: idx,
        title: booking.title,
        start: booking.start_date,
        end: booking.end_date,
        id: booking.id,
        notes: booking.notes,
        resourceName: booking.resource_name,
        projectName: booking.project_name,
        createdBy: booking.created_by
      }

      for(var i = 0; i < $scope.projects.length; i++) {

  			if($scope.projects[i].name === booking.project_name) {

  				bookingData.color = $scope.projects[i].colour_code;
  			}
  		}

      $scope.eventSources[0].events.push(bookingData);
    });
  }

	$scope.uiConfig = {

    calendar: {
      height: '100%',
      editable: true,
      selectable: true,
      selectHelper: true,
      allDayDefault: true,
      header: {
        left: 'month agendaWeek',
        center: 'title',
        right: 'today prev,next'
      },
      eventClick: function(event) {

      	$scope.showBookingData = true;
      	$scope.bookingToDisplay = $scope.eventSources[0].events[event.arrayIndex];
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

	$scope.addBookingToCalendar = function(calendarId, formData) {
		
		$(calendarId).fullCalendar('renderEvent',
      {
        title: formData.get('title'),
        start: formData.get('start_date'),
        end: formData.get('end_date')
			}, true
		);
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

   		console.log(response);
   		$scope.addBookingToCalendar('#resourceCalendar', formData);
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
}]);