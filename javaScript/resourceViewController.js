app.controller('resourceViewController', ['$scope', '$http', '$rootScope', 'getInfoService', 'filterService', 'messageService', '$timeout', 'authService', function($scope, $http, $rootScope, getInfoService, filterService, messageService, $timeout, authService) {
  
  authService.isAdminUser(); // CALLED TO DETERMINE WHETHER OR NOT THE CURRENT USER IS AN ADMIN USER \\

  var today = moment().startOf('day');
  $scope.startDay = moment(today);
  $scope.creatingBooking = false;
  $scope.creatingProject = false;
  $scope.showBookingData = false;
  $scope.filterObj = {};
  $scope.selectedPeriod = '3 days'; 

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

    Items: [],

    Sections: [],

    Init: function () {

        TimeScheduler.Scope = $scope;
        TimeScheduler.Options.GetSections = Calendar.GetSections;
        TimeScheduler.Options.GetSchedule = Calendar.GetSchedule;
        TimeScheduler.Options.Start = $scope.startDay;
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

        if($rootScope.notAdminUser) {

          TimeScheduler.isAdminUser = false;
        }
        else {

          TimeScheduler.isAdminUser = true;
        }
   
        TimeScheduler.updateStart = function(newStartDate) {

          $scope.$apply(function() {

            $scope.bookingsStartDate = newStartDate.format();
          });

          $scope.startDay = newStartDate.format();
          $scope.getBookings(populateEventsArray);
        }

        TimeScheduler.createAppendElement = function(elem, classes, elemTxt, parent, callBack) {

          var ele = document.createElement(elem);

          classes.forEach(function(clas) {

            ele.classList.add(clas);
          });
          
          ele.innerHTML = elemTxt;

          ele.addEventListener('click', function() {

            callBack();
          })

          parent.append(ele);
        }

          if($scope.relevantProject !== undefined) {

            Calendar.Sections.splice(0, Calendar.Sections.length);
            Calendar.Sections.push($scope.relevantProject);
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


      if($rootScope.notAdminUser) {

        messageService.showMessage('You must be an ADMIN user to change a booking!', $rootScope.closeMessage);
        Calendar.Init();
      }
      else {
        
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
      }
    },

    Item_Resized: function (item, start, end) {

      if($rootScope.notAdminUser) {

        messageService.showMessage('You must be an ADMIN user to change a booking!', $rootScope.closeMessage);
        Calendar.Init();
      }
      else {

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
      }
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

  getInfoService.getProjects(popuplateSectionsArray);

  function popuplateSectionsArray(response, callBack) {

    $scope.projects = response.data;
    Calendar.Sections.splice(0, Calendar.Sections.length);

    angular.forEach(response.data, function(item) {

      var itemObj = {
        id: item.id,
        name: item.name,
        color: item.colour_code,
        notes: item.notes
      }

      Calendar.Sections.push(itemObj);
    });

    getInfoService.getResources(function(response) {

      $scope.resources = response.data;

      if(callBack) {

        callBack();
      }
    });
  }

  function closeForm(formWrapperId) {

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

    if(formWrapperId === 'newProjectForm') {

      $('#newProjectName')[0].value = '';
      $('#projectColorCode')[0].value = '#000000';

      $scope.creatingProject = false;
    }

    if(formWrapperId === 'editProjectForm') {

      $scope.showProjectData = false;
    }
  }

  $scope.closeForm = closeForm;

  $scope.addBookingToDb = function(data) {

    if($scope.bookingsStartDate <= moment(today).add(-1, 'days').format()) {

      $scope.closeForm('newBookingForm');
      return messageService.showMessage('You cannot create a booking in the past!', $rootScope.closeMessage);
    }

    var formData = new FormData();

    formData.append('start_date', $scope.bookingsStartDate);
    formData.append('end_date', moment.utc(moment($scope.bookingsStartDate).add(1, 'days')).format());
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

    if($rootScope.notAdminUser) {

      messageService.showMessage('You must be an ADMIN user to delete a booking!', $rootScope.closeMessage);
    }
    else {

      messageService.showConfirm("Are you sure you want to DELETE " + $scope.bookingToDisplay.title + "?", function() {
        
        $rootScope.makeRequest('DELETE', 'api/public/booking/' + bookingId, null, function(response) {

          messageService.showMessage(response.data, $rootScope.closeMessage);

          getInfoService.getBookingsDateRange($scope.bookingsForThisMonthQuery, function(arrayOfResults) {

            filterService.filterObjArray(arrayOfResults, $scope.filterObj, function(resultArray) {

              populateEventsArray(Calendar.Items, resultArray, Calendar.Init);
            });
          });
        });
      });

      $scope.closeForm('displayBookingForm');
    }
  }

  $scope.updateBooking = function(bookingId) {

    if($rootScope.notAdminUser) {

      messageService.showMessage('You must be an ADMIN user to update a booking!', $rootScope.closeMessage);
    }
    else {
  
      messageService.showConfirm("Are you sure you want to UPDATE " + $scope.bookingToDisplay.title + "?", function() {

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
        });
      });

      $scope.closeForm('displayBookingForm');
    }
  }

  $scope.saveProject = function() {

    var formData = new FormData();
    
    formData.append('name', $('#newProjectName')[0].value);
    formData.append('color', $('#projectColorCode')[0].value);
    formData.append('notes', $('#projectNotes')[0].value);

    $rootScope.makeRequest('POST', 'api/public/project', formData, function(response) {

      messageService.showMessage(response.data, $rootScope.closeMessage);
      
      getInfoService.getProjects(popuplateSectionsArray, TimeScheduler.Init);
    });

    $scope.closeForm('newProjectForm');
  }

  $scope.updateProject = function(projectId) {

    if($rootScope.notAdminUser) {

      messageService.showMessage('You must be an ADMIN user to update a project!', $rootScope.closeMessage);
    }
    else {
  
      messageService.showConfirm("Are you sure you want to UPDATE " + $scope.projectDataToDisplay.name + "?", function() {

        var formData = new FormData();

        formData.append('name', $('#projectEditName')[0].value);
        formData.append('color', $('#projectEditColorCode')[0].value);
        formData.append('notes', $('#projectEditNotes')[0].value);

        $rootScope.makeRequest('POST', 'api/public/project/update/' + projectId, formData, function(response) {
          
          messageService.showMessage(response.data, $rootScope.closeMessage);
          getInfoService.getProjects(popuplateSectionsArray, TimeScheduler.Init); 
        });
      });

      $scope.closeForm('editProjectForm');
    }
  }

  $scope.deleteProject = function(projectId) {

    if($rootScope.notAdminUser) {

      messageService.showMessage('You must be an ADMIN user to delete a project!', $rootScope.closeMessage);
    }
    else {

      messageService.showConfirm("Are you sure you want to DELETE " + $scope.projectDataToDisplay.name + "?", function() {

        $rootScope.makeRequest('DELETE', 'api/public/project/' + projectId, null, function(response) {

          messageService.showMessage(response.data, $rootScope.closeMessage);
         
          getInfoService.getProjects(popuplateSectionsArray, TimeScheduler.Init);
        });
      }); 

      $scope.closeForm('editProjectForm');
    }
  }

  $scope.filterMethod = function(selectValue, filterKey) {

    var bookingsArray = [];

    $scope.filterObj[filterKey] = selectValue;

    getInfoService.getBookingsDateRange($scope.bookingsForThisMonthQuery, function(arrayOfResults) {

      filterService.filterObjArray(arrayOfResults, $scope.filterObj, function(resultArray) {

        populateEventsArray(Calendar.Items, resultArray, function() {
          
          getInfoService.getProjects(popuplateSectionsArray);

          if(selectValue.length === 0 && filterKey === 'project_name') {

            $scope.relevantProject = undefined;
          }

          if(filterKey === 'project_name' && selectValue !== '') {

            angular.forEach(Calendar.Sections, function(item) {

              if(item.name === selectValue) {

                $scope.relevantProject = item;
              }
            });
          }
          
          Calendar.Init();
        });
      });
    });
  }

  if($rootScope.notAdminUser) {

    $scope.notAdmin = true;

    var userName = authService.getLoggedInUser().first_name + ' ' + authService.getLoggedInUser().last_name;

    $scope.filterMethod(userName, 'resource_name');
  }

  $scope.getBookings = function(callBack) {

    $scope.bookingsEndDate = moment($scope.bookingsStartDate).add(37, 'days').format();

    $scope.bookingsForThisMonthQuery = 'start_date=' + $scope.bookingsStartDate + '&end_date=' + $scope.bookingsEndDate;

    getInfoService.getBookingsDateRange($scope.bookingsForThisMonthQuery, function(arrayOfResults) {

      filterService.filterObjArray(arrayOfResults, $scope.filterObj, function(resultArray) {

         callBack(Calendar.Items, resultArray, Calendar.Init);
      });
    });
  }

  angular.element(document).ready(function() {

    $scope.bookingsStartDate = moment.utc(moment(today)).format();
    $scope.getBookings(populateEventsArray);
  });
}]);