app.controller('resourceViewController', ['$scope', '$http', '$rootScope', 'getInfoService', 'filterService', 'messageService', '$timeout', function($scope, $http, $rootScope, getInfoService, filterService, messageService, $timeout) {

  var today = moment().startOf('day');
  $scope.creatingBooking = false;
  $scope.showBookingData = false;
  $scope.filterObj = {};
  $scope.selectedPeriod = '3 days'; 
  $('#newBookingForm, #displayBookingForm').draggable();

  function populateEventsArray(arrayToPopulate, dataArray, callBack) {

    arrayToPopulate.splice(0, arrayToPopulate.length);

    angular.forEach(dataArray, function(booking, idx) {

      var bookingData = {
        id: booking.id,
        title: booking.title,
        name: '<span class="booking_details">' + booking.title + '</span><span class="booking_details">' + booking.resource_name + '</span>',
        start: moment(booking.start_date),
        end: moment(booking.end_date),
        notes: booking.notes,
        resource_name: booking.resource_name,
        project_name: booking.project_name,
        createdBy: booking.created_by,
        classes: 'item-status-three'
      }

      for(var i = 0; i < $scope.projects.length; i++) {

        if($scope.projects[i].name === booking.project_name) {

          bookingData.projectColor = $scope.projects[i].colour_code;
          bookingData.sectionID = $scope.projects[i].id;
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

  var Calendar = {
    Periods: [
        {
            Name: '1 day',
            Label: '1 day',
            TimeframePeriod: (60 * 1),
            TimeframeOverall: (60 * 24 * 1),
            TimeframeHeaders: [
                'Do MMM',
                'HH'
            ],
            Classes: 'period-1day'
        },
        {
            Name: '3 days',
            Label: '3 days',
            TimeframePeriod: (60 * 3),
            TimeframeOverall: (60 * 24 * 3),
            TimeframeHeaders: [
                'Do MMM',
                'HH'
            ],
            Classes: 'period-3day'
        },
        {
            Name: '1 week',
            Label: '1 week',
            TimeframePeriod: (60 * 24),
            TimeframeOverall: (60 * 24 * 7),
            TimeframeHeaders: [
                'MMM',
                'Do'
            ],
            Classes: 'period-1week'
        },
        {
            Name: '1 month',
            Label: '1 month',
            TimeframePeriod: (60 * 24 * 1),
            TimeframeOverall: (60 * 24 * 28),
            TimeframeHeaders: [
                'MMM',
                'Do'
            ],
            Classes: 'period-1month'
        }
    ],

    Items: [
       
        {
            id: 22,
            name: '<div>Item 3</div>',
            start: moment('2017-04-06T00:00:00.000Z'),
            end: moment('2017-04-07T00:29:40.276Z'),
            sectionID: 1,
            classes: 'item-status-three'
        }
    ],

    Sections: [],

    Init: function () {

        TimeScheduler.Scope = $scope;
        TimeScheduler.Options.GetSections = Calendar.GetSections;
        TimeScheduler.Options.GetSchedule = Calendar.GetSchedule;
        TimeScheduler.Options.Start = today;
        TimeScheduler.Options.Periods = Calendar.Periods;
        TimeScheduler.Options.SelectedPeriod = $scope.selectedPeriod;
        TimeScheduler.Options.Element = $('.calendar');

        TimeScheduler.Options.AllowDragging = true;
        TimeScheduler.Options.AllowResizing = true;

        TimeScheduler.Options.Events.ItemClicked = Calendar.Item_Clicked;
        TimeScheduler.Options.Events.ItemDropped = Calendar.Item_Dragged;
        TimeScheduler.Options.Events.ItemResized = Calendar.Item_Resized;

        TimeScheduler.Options.Events.ItemMovement = Calendar.Item_Movement;
        TimeScheduler.Options.Events.ItemMovementStart = Calendar.Item_MovementStart;
        TimeScheduler.Options.Events.ItemMovementEnd = Calendar.Item_MovementEnd;

        TimeScheduler.Options.Text.NextButton = '&nbsp;';
        TimeScheduler.Options.Text.PrevButton = '&nbsp;';

        TimeScheduler.Options.MaxHeight = 100;

        TimeScheduler.test = function() {

          var butn = document.createElement('button');
          butn.classList.add('btn');
          butn.classList.add('btn-default');
          butn.innerHTML = 'Create Booking';

          butn.addEventListener('click', function() {
            $scope.bookingDates = {
              startDate: moment.utc(moment(today)).format(),
              endDate: moment.utc(moment(today).add(1, 'days')).format()
            };
            console.log($scope.bookingDates);
            $scope.$apply(function() {

              $scope.creatingBooking = true;
            });
          })
          $('.time-sch-section.time-sch-section-header')[0].append(butn);
        }

        TimeScheduler.Init();
    },

    GetSections: function (callback) {
        callback(Calendar.Sections);
    },

    GetSchedule: function (callback, start, end) {
        callback(Calendar.Items);
    },

    Item_Clicked: function (item) {

      $scope.bookingToDisplay = item;

      $scope.$apply(function() {

        $scope.showBookingData = true;
      });
    },

    Item_Dragged: function (item, sectionID, start, end) {
        
        var foundItem;

        for (var i = 0; i < Calendar.Items.length; i++) {
            foundItem = Calendar.Items[i];

            if(foundItem.id === item.id) {
                foundItem.sectionID = sectionID;
                foundItem.start = start;
                foundItem.end = end;

                for(var p = 0; p < Calendar.Sections.length; p++) {

                  if(Calendar.Sections[p].id === foundItem.sectionID) {

                    foundItem.project_name = Calendar.Sections[p].name;
                  }
                }

                Calendar.Items[i] = foundItem;

                if(!confirm("The start date for " + item.title + " will be changed to: " + start.format('MMMM Do YYYY, h:mm a'))) {
          
                  TimeScheduler.Init();
                }
                else {

                  $rootScope.makeRequest('PUT', 'api/public/booking/update/' + foundItem.id + '?start_date=' + moment.utc(moment(foundItem.start)).format() + '&end_date=' + moment.utc(moment(foundItem.end)).format() + '&project_name=' + foundItem.project_name, null, function(response) {

                    messageService.showMessage(response.data, $rootScope.closeMessage);
                    
                    getInfoService.getBookingsDateRange($scope.bookingsForThisMonthQuery, function(arrayOfResults) {

                      filterService.filterObjArray(arrayOfResults, $scope.filterObj, function(resultArray) {

                        populateEventsArray(Calendar.Items, resultArray, Calendar.Init);
                      });
                    });
                  });
                }
            }
        }

        getInfoService.getBookingsDateRange($scope.bookingsForThisMonthQuery, function(responseData) {

          populateEventsArray(Calendar.Items, responseData, Calendar.Init);
        });
    },

    Item_Resized: function (item, start, end) {
        var foundItem;

        for (var i = 0; i < Calendar.Items.length; i++) {
            foundItem = Calendar.Items[i];

            if (foundItem.id === item.id) {
                foundItem.start = start;
                foundItem.end = end;

                Calendar.Items[i] = foundItem;

                if(!confirm(item.title + ' will start: ' + start.format('MMMM Do YYYY, h:mm a') + ' and end: ' + end.format('MMMM Do YYYY, h:mm a'))) {
          
                  TimeScheduler.Init();
                }
                else {

                  $rootScope.makeRequest('PUT', 'api/public/booking/update/' + foundItem.id + '?start_date=' + moment.utc(moment(foundItem.start)).format() + '&end_date=' + moment.utc(moment(foundItem.end)).format(), null, function(response) {

                    messageService.showMessage(response.data, $rootScope.closeMessage);
                    
                    getInfoService.getBookingsDateRange($scope.bookingsForThisMonthQuery, function(arrayOfResults) {

                      filterService.filterObjArray(arrayOfResults, $scope.filterObj, function(resultArray) {

                        populateEventsArray(Calendar.Items, resultArray, Calendar.Init);
                      });
                    });
                  });
                }
            }
        }

        TimeScheduler.Init();
    },

    Item_Movement: function (item, start, end) {
        var html;

        html =  '<div>';
        html += '   <div>';
        html += '       Start: ' + start.format('Do MMM YYYY HH:mm');
        html += '   </div>';
        html += '   <div>';
        html += '       End: ' + end.format('Do MMM YYYY HH:mm');
        html += '   </div>';
        html += '</div>';

        $('.realtime-info').empty().append(html);
    },

    Item_MovementStart: function () {
        $('.realtime-info').show();
    },

    Item_MovementEnd: function () {
        $('.realtime-info').hide();
    }
  };

  getInfoService.getProjects(function(response) {

    $scope.projects = response.data;

    angular.forEach(response.data, function(item) {

      var itemObj = {
        id: item.id,
        name: item.name
      }

      Calendar.Sections.push(itemObj);
    });

    // getInfoService.getBookings($scope.eventSources[0].events, populateEventsArray);

    getInfoService.getResources(function(response) {

      $scope.resources = response.data;
    });
  });

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

  $scope.addBookingToDb = function(data) {

    var formData = new FormData();

    formData.append('start_date', $scope.bookingDates.startDate);
    formData.append('end_date', $scope.bookingDates.endDate);
    formData.append('title', $('#bookingTitle')[0].value);
    formData.append('notes', $('#bookingNotes')[0].value);
    formData.append('resource_name', $('#resourceName')[0].value);
    formData.append('project_name', $('#projectName')[0].value);

    $rootScope.makeRequest('POST', 'api/public/booking', formData, function(response) {

      messageService.showMessage(response.data, $rootScope.closeMessage);
      getInfoService.getBookingsDateRange($scope.bookingsForThisMonthQuery, function(arrayOfResults) {

        filterService.filterObjArray(arrayOfResults, $scope.filterObj, function(resultArray) {

          populateEventsArray(Calendar.Items, resultArray, Calendar.Init);
        });
      });
    });

    $scope.closeForm('newBookingForm');
  }

  $scope.deleteBooking = function(bookingId) {

    if(!confirm("Are you sure you want to DELETE " + $scope.bookingToDisplay.title + "?")) {
          
      $scope.closeForm('displayBookingForm');
    }
    else {

      $rootScope.makeRequest('DELETE', 'api/public/booking/' + bookingId, null, function(response) {

        messageService.showMessage(response.data, $rootScope.closeMessage);
        getInfoService.getBookingsDateRange($scope.bookingsForThisMonthQuery, function(arrayOfResults) {

          filterService.filterObjArray(arrayOfResults, $scope.filterObj, function(resultArray) {

            populateEventsArray(Calendar.Items, resultArray, Calendar.Init);
          });
        });
        $scope.closeForm('displayBookingForm');
      });
    }
  }

  $scope.updateBooking = function(bookingId) {
  
    if(!confirm("Are you sure you want to UPDATE " + $scope.bookingToDisplay.title + "?")) {
          
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
        getInfoService.getBookingsDateRange($scope.bookingsForThisMonthQuery, function(arrayOfResults) {

          filterService.filterObjArray(arrayOfResults, $scope.filterObj, function(resultArray) {

            populateEventsArray(Calendar.Items, resultArray, Calendar.Init);
          });
        });
        $scope.closeForm('displayBookingForm');
      });
    }
  }

  $scope.filterMethod = function(selectValue, filterKey) {

    var bookingsArray = [];

    $scope.filterObj[filterKey] = selectValue;

    getInfoService.getBookingsDateRange($scope.bookingsForThisMonthQuery, function(arrayOfResults) {

      filterService.filterObjArray(arrayOfResults, $scope.filterObj, function(resultArray) {

        populateEventsArray(Calendar.Items, resultArray, Calendar.Init);
      });
    });
  }

  angular.element(document).ready(function() {

    var thisYear = new Date().getFullYear();
    var thisMonth = new Date().getMonth() + 1; // + 1 starts the month array at 1 instead of 0.
    var monthLength = new Date(thisYear, thisMonth, 0).getDate();

    $scope.bookingsForThisMonthQuery = 'start_date=' + moment.utc(moment(today).add(-1, 'days')).format() + '&end_date=' + moment.utc(moment(today).add(parseInt(monthLength), 'days')).format();
    
    getInfoService.getBookingsDateRange($scope.bookingsForThisMonthQuery, function(responseData) {

      populateEventsArray(Calendar.Items, responseData, Calendar.Init);
    });
  });
}]);