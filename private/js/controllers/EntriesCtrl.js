
angular.module('ProjMngmnt')
	.controller('EntriesCtrl', function (DB, $scope, entriesSpecifics) {
		// Get DB layer entries data
		var entries = DB.entries(entriesSpecifics.type).getAll();
		// Get view layer entries data
		var viewData = DB.entries(entriesSpecifics.type).viewData.getAll();
		$scope.formTitle = viewData.form.title;

		
		// Prepare all table data for ng-repeat needs
		var columnMaps = angular.copy(viewData.table.columnMaps);
		var values = angular.copy(entries);
		console.log(values);
		console.log(columnMaps);
		if (viewData.table.generatedFields !== undefined) {
			for (var j = 0; j < viewData.table.generatedFields.length; j++) {
				// Add to columnMaps
				var position = viewData.table.generatedFields[j].position;
				columnMaps.splice(position, 0, {
					key: viewData.table.generatedFields[j].key, 
					name: viewData.table.generatedFields[j].columnName
				});

				// Add to each row
				for (var i = 0; i < entries.length; i++) {
					var generatedField = viewData.table.generatedFields[j].formula(entries[i]);
					values[i][viewData.table.generatedFields[j].key] = generatedField;
				}
			}
		}
		console.log(values);
		console.log(columnMaps);
		$scope.tableEntries = {
			columnMaps: columnMaps, 
			rows: values
		};

		// Initialize form
		$scope.formFields = viewData.form.fields;
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