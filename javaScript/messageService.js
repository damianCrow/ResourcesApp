app.service('messageService', ['$timeout', '$rootScope', function($timeout, $rootScope) {

	return {

		showMessage: function(messageClass, message, callBack) {

			$timeout(function() {

				callBack();
			}, 2000)

			return $('body').append('<div class="alert ' + messageClass + ' custom_alert"><h6>' + message + '</h6></div>');
		},

		showConfirm: function(message, callBack, callBack2) {

			var button = document.createElement('button');
			button.innerHTML= 'Confirm';
			button.className = 'btn btn-warning float-md-right confirm_button';

			var button2 = document.createElement('button');
			button2.innerHTML= 'Cancel';
			button2.className = 'btn btn-info float-md-right';

			var div = document.createElement('div');
			div.className = 'alert alert-warning custom_confirm';
			
			var h6 = document.createElement('h6');
			h6.innerHTML = message;

			div.append(h6);
			div.append(button2);
			div.append(button);

			button.onclick = function() {

				$('.alert.alert-warning.custom_confirm').remove();
				return callBack();
			}

			button2.onclick = function() {

				$('.alert.alert-warning.custom_confirm').remove();

				if(callBack2) {

					return callBack2();
				}
			}

			return $('body').append(div);
		}
	}
}]);