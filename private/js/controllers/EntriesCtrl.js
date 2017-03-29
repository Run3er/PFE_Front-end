
angular.module('ProjMngmnt')
	.controller('EntriesCtrl', function (DB, $scope, entriesSpecifics) {
		// Get entries type specific characteristic values
		$scope.formTitle = entriesSpecifics.formTitle;
		// Get DB layer entries data
		var tableEntries = DB.entries(entriesSpecifics.type).getAll();
		// Get view layer entries data
		var viewData = DB.entries(entriesSpecifics.type).viewData.getAll();

		
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

		// Initialize form
		$scope.formFields = viewData.formFields;
		$scope.formEntry = {};
		$scope.formAlert = {};

		$scope.alertDismiss = function () {
			$scope.formAlert = {
				active: false
			};
		};

		// Init. on form submit
		$scope.submit = function (entry) {
			operation("add", entry);
		};

		// On form reset
		$scope.reset = function(form) {
			// Reset form's state
			form.$setPristine();
			form.$setUntouched();
			// Reset form's entry
			$scope.formEntry = {};
			// Revert submit to default operation
			if ($scope.submit !== add) {
				$scope.submit = add;
			}
		};

		// On entry edit
		$scope.edit = function (_entry) {
			$scope.formEntry = angular.copy(_entry);

			//collapse form in
			//color corresponding entry in table

			$scope.submit = function (entry) {
				operation("update", entry);
			};
		}

		// On entry delete
		$scope.delete = function (entry) {
			return operation("delete", entry);
		};


		// CRUD operations
		var operation = function (type, _entry) {
			// Disable related button

			// Set local copy of entry
			var entry = angular.copy(_entry);

			// Add entry to DB asynchronously
			var additionPromise = DB.entries(entriesSpecifics.type)[type](entry)
				.then(function (resolveData) {
					// Success
					console.log('Deletion Success.');

					$scope.formAlert.didSucceed = true;
					$scope.formAlert.msg = type + " completed with success.";
				}, function (rejectData) {
					// Failure
					$scope.formAlert.didSucceed = false;
					$scope.formAlert.msg = type + " failed. [Try again.]";
				})
				.finally(function () {
					// Set alert on the view ...
					$scope.formAlert.active = true;
					console.log("formAlert=" + JSON.stringify($scope.formAlert));

					// Reenable related button
				});			
		};

		// $scope.$on('$viewContentLoaded', function(){
		//     // View content is fully loaded
		// });
	});

	//TODO: show notification only on request failure