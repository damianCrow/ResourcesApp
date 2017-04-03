app.service('filterService', ['$filter', '$rootScope', function($filter, $rootScope) {

	return {

		filterObjArray: function(sourceArray, filterObj, clallBack) {

			var result = $filter('filter')(sourceArray, filterObj);
			
			clallBack(result);
		}
	};
}]);
