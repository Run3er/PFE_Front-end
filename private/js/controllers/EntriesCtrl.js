
angular.module('ProjMngmnt')
	.controller('EntriesCtrl', function (DB, $scope, entriesSpecifics) {
			$scope.formTitle = entriesSpecifics.formTitle;
			// Get view layer data
			var viewData = DB.getEntriesViewData(entriesSpecifics.type);
			// Get DB layer data
			var tableEntries = DB.getAll(entriesSpecifics.type);

			
			$scope.formFields = viewData.formFields;
			// Prepare all table data for ng-repeat needs
			var values = tableEntries.values;
			if (viewData.generatedValues !== undefined) {
				for (var i = 0; i < values.length; i++) {
					for (var j = 0; j < viewData.generatedValues.length; j++) {
						var position = viewData.generatedValues[j].position;
						var generatedValue = viewData.generatedValues[j].formula(values[i]);

						values[i].splice(position, 0, generatedValue);
					}
				}
			}
			$scope.entries = {
				keys: tableEntries.keys, 
				values: values
			};

			// $scope.$on('$viewContentLoaded', function(){
			//     // View content is fully loaded
			// });
		}
	);