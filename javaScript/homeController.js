app.controller('homeController', ['$scope', '$http', '$rootScope', 'getInfoService', 'filterService', 'messageService', '$timeout', 'authService', function($scope, $http, $rootScope, getInfoService, filterService, messageService, $timeout, authService) {

//   var today = moment().startOf('day');
//   $scope.startDay = moment(today);
//   $scope.filterObj = {};
//   $scope.selectedPeriod = '3 days'; 

//   function populateEventsArray(arrayToPopulate, dataArray, callBack) {

//     arrayToPopulate.splice(0, arrayToPopulate.length);

//     angular.forEach(dataArray, function(booking, idx) {

//       var bookingData = {
//         id: booking.id,
//         title: booking.title,
//         name: '<span class="booking_details">' + booking.title + '</span><span class="booking_details">' + booking.resource_name + '</span>',
//         start: moment(booking.start_date),
//         end: moment(booking.end_date),
//         notes: booking.notes,
//         resource_name: booking.resource_name,
//         project_name: booking.project_name,
//         createdBy: booking.created_by,
//         classes: 'item-status-three'
//       }

//       for(var i = 0; i < $scope.projects.length; i++) {

//         if($scope.projects[i].name === booking.project_name) {

//           bookingData.projectColor = $scope.projects[i].colour_code;
//           bookingData.sectionID = $scope.projects[i].id;
//         }
//       }

//       arrayToPopulate.push(bookingData);
//     });

//     if(callBack) {

//       callBack(arrayToPopulate);
//     }
//   }

//   var Calendar = {
//     Periods: [
//         {
//             Name: '1 day',
//             Label: '1 day',
//             TimeframePeriod: (60 * 1),
//             TimeframeOverall: (60 * 24 * 1),
//             TimeframeHeaders: [
//                 'Do MMM',
//                 'HH'
//             ],
//             Classes: 'period-1day'
//         },
//         {
//             Name: '3 days',
//             Label: '3 days',
//             TimeframePeriod: (60 * 3),
//             TimeframeOverall: (60 * 24 * 3),
//             TimeframeHeaders: [
//                 'Do MMM',
//                 'HH'
//             ],
//             Classes: 'period-3day'
//         },
//         {
//             Name: '1 week',
//             Label: '1 week',
//             TimeframePeriod: (60 * 24),
//             TimeframeOverall: (60 * 24 * 7),
//             TimeframeHeaders: [
//                 'MMM',
//                 'Do'
//             ],
//             Classes: 'period-1week'
//         },
//         {
//             Name: '1 month',
//             Label: '1 month',
//             TimeframePeriod: (60 * 24 * 1),
//             TimeframeOverall: (60 * 24 * 28),
//             TimeframeHeaders: [
//                 'MMM',
//                 'Do'
//             ],
//             Classes: 'period-1month'
//         }
//     ],

//     Items: [],

//     Sections: [],

//     Init: function () {

//         TimeScheduler.Scope = $scope;
//         TimeScheduler.Options.GetSections = Calendar.GetSections;
//         TimeScheduler.Options.GetSchedule = Calendar.GetSchedule;
//         TimeScheduler.Options.Start = $scope.startDay;
//         TimeScheduler.Options.Periods = Calendar.Periods;
//         TimeScheduler.Options.SelectedPeriod = $scope.selectedPeriod;
//         TimeScheduler.Options.Element = $('.calendar');

//         TimeScheduler.Options.AllowDragging = true;
//         TimeScheduler.Options.AllowResizing = true;

//         TimeScheduler.Options.Events.ItemClicked = Calendar.Item_Clicked;
//         TimeScheduler.Options.Events.ItemDropped = Calendar.Item_Dragged;
//         TimeScheduler.Options.Events.ItemResized = Calendar.Item_Resized;

//         TimeScheduler.Options.Events.ItemMovement = Calendar.Item_Movement;
//         TimeScheduler.Options.Events.ItemMovementStart = Calendar.Item_MovementStart;
//         TimeScheduler.Options.Events.ItemMovementEnd = Calendar.Item_MovementEnd;

//         TimeScheduler.Options.Text.NextButton = '&nbsp;';
//         TimeScheduler.Options.Text.PrevButton = '&nbsp;';

//         TimeScheduler.Options.MaxHeight = 100;

//         TimeScheduler.updateStart = function(newStartDate) {

//           $scope.$apply(function() {

//             $scope.bookingsStartDate = newStartDate.format();
//           });

//           $scope.startDay = newStartDate.format();
//           $scope.getBookings(populateEventsArray);
//         }

//         TimeScheduler.createAppendElement = function(elem, classes, elemTxt, parent, callBack) {

//           var ele = document.createElement(elem);

//           classes.forEach(function(clas) {

//             ele.classList.add(clas);
//           });
          
//           ele.innerHTML = elemTxt;

//           ele.addEventListener('click', function() {

//             callBack();
//           })

//           parent.append(ele);
//         }

//         TimeScheduler.Init();
//     },

//     GetSections: function (callback) {
      
//       callback(Calendar.Sections);
//     },

//     GetSchedule: function (callback, start, end) {
//         callback(Calendar.Items);
//     },

//     Item_Clicked: function (item) {

//     },

//     Item_Dragged: function (item, sectionID, start, end) {
        
//       Calendar.Init();
//     },

//     Item_Resized: function (item, start, end) {
        
//         Calendar.Init();
//     },

//     Item_Movement: function (item, start, end) {
//         var html;

//         html =  '<div>';
//         html += '   <div>';
//         html += '       Start: ' + start.format('Do MMM YYYY HH:mm');
//         html += '   </div>';
//         html += '   <div>';
//         html += '       End: ' + end.format('Do MMM YYYY HH:mm');
//         html += '   </div>';
//         html += '</div>';

//         $('.realtime-info').empty().append(html);
//     },

//     Item_MovementStart: function () {
//         $('.realtime-info').show();
//     },

//     Item_MovementEnd: function () {
//         $('.realtime-info').hide();
//     }
//   };

//   getInfoService.getProjects(popuplateSectionsArray);

//   function popuplateSectionsArray(response, callBack) {

//     $scope.projects = response.data;
//     Calendar.Sections.splice(0, Calendar.Sections.length);

//     angular.forEach(response.data, function(item) {

//       var itemObj = {
//         id: item.id,
//         name: item.name,
//         color: item.colour_code,
//         notes: item.notes
//       }

//       Calendar.Sections.push(itemObj);
//     });

//     getInfoService.getResources(function(response) {

//       $scope.resources = response.data;

//       if(callBack) {

//         callBack();
//       }
//     });
//   }

//   function closeForm(formWrapperId) {

//     if(formWrapperId === 'newBookingForm') {

//       $('#bookingTitle')[0].value = '';
//       $('#bookingNotes')[0].value = '';
//       $('#resourceName')[0].value = '';
//       $('#projectName')[0].value = '';

//       $scope.creatingBooking = false;
//     }

//     if(formWrapperId === 'displayBookingForm') {

//       $scope.showBookingData = false;
//     }

//     if(formWrapperId === 'newProjectForm') {

//       $('#newProjectName')[0].value = '';
//       $('#projectColorCode')[0].value = '#000000';

//       $scope.creatingProject = false;
//     }

//     if(formWrapperId === 'editProjectForm') {

//       $scope.showProjectData = false;
//     }
//   }

//   $scope.closeForm = closeForm;

  
//   $scope.filterMethod = function(selectValue, filterKey) {

//     var bookingsArray = [];

//     $scope.filterObj[filterKey] = selectValue;

//     getInfoService.getBookingsDateRange($scope.bookingsForThisMonthQuery, function(arrayOfResults) {

//       filterService.filterObjArray(arrayOfResults, $scope.filterObj, function(resultArray) {

//         populateEventsArray(Calendar.Items, resultArray, Calendar.Init);
//       });
//     });
//   }

//   if(authService.userLoggedIn()) {

//     var userName = authService.getLoggedInUser().first_name + ' ' + authService.getLoggedInUser().last_name;
//     $scope.filterMethod(userName, 'resource_name');
//   }

//   $scope.getBookings = function(callBack) {

//     $scope.bookingsEndDate = moment($scope.bookingsStartDate).add(37, 'days').format();

//     $scope.bookingsForThisMonthQuery = 'start_date=' + $scope.bookingsStartDate + '&end_date=' + $scope.bookingsEndDate;

//     getInfoService.getBookingsDateRange($scope.bookingsForThisMonthQuery, function(arrayOfResults) {

//       filterService.filterObjArray(arrayOfResults, $scope.filterObj, function(resultArray) {

//          callBack(Calendar.Items, resultArray, Calendar.Init);
//       });
//     });
//   }

//   angular.element(document).ready(function() {

//     $scope.bookingsStartDate = moment.utc(moment(today)).format();
//     $scope.getBookings(populateEventsArray);
//   });
}]);