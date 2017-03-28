app.controller('resourceViewController', ['$scope', '$http', '$rootScope', function($scope, $http, $rootScope) {

	$scope.creatingBooking = false;

	$scope.eventSources = [{
    events: [],
    color: '#1694CB',     // an option!
    textColor: 'white' // an option!
  }];

	$rootScope.makeRequest('GET', '/booking', null, function(response) {

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

			$scope.eventSources[0].events.push(bookingData);
		});
 	});

	$scope.uiConfig = {

    calendar: {
      height: '100%',
      editable: true,
      selectable: true,
      selectHelper: true,
      allDayDefault: true,
      header: {
        left: 'month basicWeek basicDay agendaWeek agendaDay',
        center: 'title',
        right: 'today prev,next'
      },
      eventClick: function(event) {

      	$scope.showBookingData = true;
      	$scope.bookingToDisplay = $scope.eventSources[0].events[event.arrayIndex];
      },

      eventDrop: function(event, delta, revertFunc) {
				console.log(event.start.format());
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

        	var formData = new FormData();

			    formData.append('id', event.id);
			    formData.append('propertyToUpdate', 'end_date');
			    formData.append('updateValue', event.end.format());

        	$rootScope.makeRequest('POST', '/booking/update', formData, function(response) {

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

   	$rootScope.makeRequest('POST', '/booking', formData, function(response) {

   		console.log(response);
   		$scope.addBookingToCalendar('#resourceCalendar', formData);
   	});

		$scope.closeForm();
	}
}]);