app.service('filterService', ['$filter', '$rootScope', function($filter, $rootScope) {

	return {

		filterObjArray: function(sourceArray, filterObj, callBack) {

			var result = $filter('filter')(sourceArray, filterObj);
			
			callBack(result);
		}
	};
}]);
