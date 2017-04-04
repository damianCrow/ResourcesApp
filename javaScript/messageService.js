app.service('messageService', ['$timeout', '$rootScope', function($timeout, $rootScope) {

	return {

		showMessage: function(message, callBack) {

			$timeout(function() {

				callBack();
			}, 1500)

			return $('body').append('<div class="alert alert-success custom_alert"><p>' + message + '</p></div>');
		},

		showConfirm: function(message, callBack) {

			return $('body').append('<div class="alert alert-success custom_confirm"><p>' + message + '</p><button class="btn btn-primary" ng-click="callBack()">close</button></div>');
		}
	};
}]);