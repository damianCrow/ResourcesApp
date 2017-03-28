app.controller('resourceViewController', ['$scope', '$http', function($scope, $http) {

	$scope.creatingBooking = false;

	$scope.closeForm = function() {
		
		$scope.creatingBooking = false;
	}

	$scope.addBookingToCalendar = function(calendarId, data) {

		$(calendarId).fullCalendar('renderEvent',
      {
        title: data.title,
        start: data.startDate,
        end: data.endDate
			}, true
		);
	}

	$scope.eventSources = [

		{
            events: [ // put the array in the `events` property
                {
                    title  : 'event1',
                    start  : '2017-03-01'
                },
                {
                    title  : 'event2',
                    start  : '2017-03-05',
                    end    : '2017-03-07'
                },
                {
                    title  : 'event3',
                    start  : '2017-03-09T12:30:00',
                }
            ],
    
            color: 'green',     // an option!
            textColor: 'black' // an option!
            
        }
	];

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
        console.log(event);
      },

      eventDrop: function(event, delta, revertFunc) {
				console.log(event.start.format());
      },
      select: function(start, end, allDay) {
      	$scope.creatingBooking = true;
    		// var title = prompt('Event Title:');

    		// $scope.addBookingToCalendar(calendarId, data);
      },
      eventResize: function(event, delta, revertFunc) {

        if(!confirm(event.title + " end date will be changed to: " + event.end.format())) {
          
          revertFunc();
        }
    	}
    }
  };

}]);