app.service('messageService', ['$timeout', '$rootScope', function($timeout, $rootScope) {

	return {

		showMessage: function(message, callBack) {

			$timeout(function() {

				callBack();
			}, 1500)

			return $('body').append('<div class="alert alert-info custom_alert"><h6>' + message + '</h6></div>');
		},

		showConfirm: function(message, callBack, callBack2) {

			var button = document.createElement('button');
			button.innerHTML= 'Confirm';
			button.className = 'btn btn-warning float-md-right confirm_button';
			button.onclick = function() {

				callBack();
				$('.alert.alert-warning.custom_confirm').remove();
			}

			var button2 = document.createElement('button');
			button2.innerHTML= 'Cancel';
			button2.className = 'btn btn-info float-md-right';
			button2.onclick = function() {

				if(callBack2) {

					callBack2();
				}

				$('.alert.alert-warning.custom_confirm').remove();
			}

			var div = document.createElement('div');
			div.className = 'alert alert-warning custom_confirm';
			
			var h6 = document.createElement('h6');
			h6.innerHTML = message;

			div.append(h6);
			div.append(button2);
			div.append(button);

			return $('body').append(div);
		}
	}
}]);