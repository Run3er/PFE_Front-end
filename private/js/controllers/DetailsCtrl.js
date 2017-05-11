
angular.module('ProjMngmnt')
    .controller('DetailsCtrl', function ($scope, DB, entrySpecifics) {

        // Functions definition

        // Reset form
        var formReset = function () {
            $scope.form.$setPristine();
            $scope.form.$setUntouched();
        };

        // On form reset
        $scope.formCancel = function() {
            $scope.mode = $scope.MODES.view;
            formReset();
            // Reset specific variables
            $scope.formEntry = {};
        };

        // On entry edit
        $scope.edit = function () {
            formReset();
            Object.keys(fields).forEach(function (fieldKey) {
                $scope.formEntry[fields[fieldKey].formField.identifier] = fields[fieldKey].value;
            });
            $scope.mode = $scope.MODES.edit;
        };

        // Update entry
        $scope.formSubmit = function () {
            $scope.formSubmitEnabled = false;
            var entry = angular.copy($scope.formEntry);


            // Request operation to DB asynchronously"
            entriesDAO["update"](entry)
                .then(function () {
                    // Update view-entry
                    Object.keys(fields).forEach(function (fieldKey) {
                        fields[fieldKey].value = $scope.formEntry[fields[fieldKey].formField.identifier];
                    });

                    // Finish, reset form & table to inactive state
                    $scope.formCancel();
                },
                function () {
                    // Update  alert
                    $scope.formAlert.msg = "Update" + " failed. [Try again.]";
                    $scope.formAlert.didSucceed = false;
                    $scope.formAlert.active = true;
                })
                .finally(function () {
                    $scope.formSubmitEnabled = true;
                });
        };

        // Async. request operation
        var request = function (operationType, argument) {
            // Set local copy of argument
            var arg = angular.copy(argument);

            // Request operation to DB asynchronously
            var resultPromise = entriesDAO[operationType](arg);
            resultPromise
            // Update  alert
                .catch(function () {
                    $scope.formAlert.msg = operationType + " failed. [Try again.]";
                    $scope.formAlert.didSucceed = false;
                    $scope.formAlert.active = true;
                });

            return resultPromise;
        };


        // Controller init. code, Prepare table entries for display

        // Get DAO
        var uriPrefix = void(0);
        if (entrySpecifics.urlPrefix !== void(0)) {
            var urlParts = entrySpecifics.urlPrefix.split("/");
            if (urlParts.length > 1) {
                // URI resource name + id
                uriPrefix = urlParts[urlParts.length - 2] + "/" + urlParts[urlParts.length - 1];
            }
        }
        var entriesDAO = DB.getEntriesDAO({
            type: entrySpecifics.type,
            uriPrefix: uriPrefix
        });

        // Get details from DB
        var fields = [
            {
                name: "nom",
                type: '',
                link: '#',
                value: "valeur",
                formField: {
                    identifier: "name",
                    label: "Nom",
                    placeholder: "Saisir un nom",
                    type: 'input'
                }
            },
            {
                name: "nom",
                value: "valeur",
                formField: {
                    identifier: "name2",
                    label: "Nom2",
                    placeholder: "Saisir un nom",
                    type: 'input'
                }
            }
        ];

        // Make available to $scope, as table entries
        $scope.entries = fields;


        // Handle edit btn click: Convert table-view to form-view
        // $scope.


        // Initialize controller
        $scope.MODES = {
            view: "VIEW",
            edit: "EDIT"
        };
        $scope.mode = $scope.MODES.view;
        $scope.formEntry = {};
        $scope.formSubmitEnabled = true;
        $scope.formAlert = {};
    });