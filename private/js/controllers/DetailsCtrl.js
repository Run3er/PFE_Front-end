
angular.module('ProjMngmnt')
    .controller('DetailsCtrl', function ($scope, UI, DB, entrySpecifics) {

        // Functions definition

        // Reset form
        var formReset = function () {
            if ($scope.form) {
                $scope.form.$setPristine();
                $scope.form.$setUntouched();
                $scope.formEntry = {};
            }
        };

        // On form reset
        $scope.formCancel = function() {
            $scope.mode = $scope.MODES.view;
            formReset();
        };

        // On entry edit
        $scope.edit = function () {
            formReset();
            $scope.formEntry = angular.copy(details);
            $scope.mode = $scope.MODES.edit;
        };

        // Update entry
        $scope.formSubmit = function () {
            $scope.formSubmitEnabled = false;
            var entry = angular.copy($scope.formEntry);


            // Request operation to DB asynchronously
            entryDAO["update"](entry)
                .then(function () {
                    // Update view-entry
                    $scope.tableEntries.details = entry;

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

        /**
         * Generate view-only auto-calculated details
         * @param _details reference non-updated raw details
         * @param _fields details to be modified
         * @param _columnMaps table header and mapping to be modified
         */
        var generateAutoFields = function (_details, _fields, _columnMaps) {
            // Add view-only auto generated values to tableEntries
            if (viewData.table.generatedFields !== void(0)) {
                for (var j = 0; j < viewData.table.generatedFields.length; j++) {
                    if (_columnMaps !== void(0)) {
                        // Add to columnMaps
                        var position = viewData.table.generatedFields[j].position;
                        _columnMaps.splice(position, 0, {
                            key: viewData.table.generatedFields[j].key,
                            name: viewData.table.generatedFields[j].columnName
                        });
                    }

                    // Add to each row
                    var generatedField = viewData.table.generatedFields[j].formula(_details);
                    _fields[viewData.table.generatedFields[j].key] = generatedField;
                }
            }
            // Translate enum values to display values
            for (var i = 0; i < viewData.form.fields.length; i++) {
                if (viewData.form.fields[i].choices !== void(0)) {
                    for (var k = 0; k < viewData.form.fields[i].choices.length; k++) {
                        if (viewData.form.fields[i].choices[k].identifier === _details[viewData.form.fields[i].identifier]) {
                            _fields[j][viewData.form.fields[i].identifier] = viewData.form.fields[i].choices[k].value;
                            break;
                        }
                    }
                }
            }
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
        var entryDAO = DB.getEntriesDAO({
            type: entrySpecifics.type,
            uriPrefix: uriPrefix
        });

        // Get details from DB
        var details;
        DB.getSingleResrcByUri(uriPrefix + "/" + entrySpecifics.type)
            .then(function (resolveData) {
                // Get the requested data
                details = angular.copy(resolveData);

                var detailsTmp = angular.copy(details);
                var columnMaps = angular.copy(viewData.table.columnMaps);

                // Initialize with initial data when available (fetched w/entry)
                for (var i = 0; i < columnMaps.length; i++) {
                    if (columnMaps[i].initialValueKey !== void(0)) {
                        detailsTmp[columnMaps[i].key] = detailsTmp[columnMaps[i].initialValueKey];
                    }
                }

                // Add view-only auto generated details to tableEntries
                generateAutoFields(details, detailsTmp, columnMaps);

                $scope.tableEntries = {
                    columnMaps: columnMaps,
                    details: detailsTmp
                    // linkable: {
                    //     columnKey: viewData.table.columnKeyLinkable,
                    //     urlPrefix: (entrySpecifics.urlPrefix ? entrySpecifics.urlPrefix + "/" :"") + entrySpecifics.type + "s"
                    // }
                };
            },
            function () {
                // Set alert on the view
                $scope.formAlert.msg = "Getting details failed. [Try refreshing.]";
                $scope.formAlert.didSucceed = false;
                $scope.formAlert.active = true;
            });


        // Get view layer entries data
        var viewData = UI.getEntryViewData(entrySpecifics.type);

        // Fetch async view data, namely multiple choice inputs
        viewData.form.fields.forEach(function (formField) {
            if (formField.asyncChoices !== void(0)) {
                DB
                    .getEntriesDAO({
                        type: formField.asyncChoices.entriesName
                    })
                    .getAll()
                    .then(function (entries) {
                        formField.choices = [];

                        for (var i = 0; i < entries.length; i++) {
                            // Filter with specified filters
                            var keys = Object.keys(formField.asyncChoices.filterBy);
                            var passedFilter = true;
                            for (var j = 0; j < keys.length; j++) {
                                if (entries[i][keys[j]] !== formField.asyncChoices.filterBy[keys[j]]) {
                                    passedFilter = false;
                                    break;
                                }
                            }
                            if (!passedFilter) continue;

                            formField.choices.push({
                                identifier: formField.asyncChoices.entriesName + "s" + "/" + entries[i].id,
                                value: entries[i][formField.asyncChoices.attachedFieldName]
                            });
                        }
                    });
            }
        });

        // Initialize controller
        $scope.MODES = {
            view: "VIEW",
            edit: "EDIT"
        };
        $scope.mode = $scope.MODES.view;
        $scope.formFields = viewData.form.fields;
        $scope.formEntry = {};
        $scope.formSubmitEnabled = true;
        $scope.formAlert = {};

        // Configure uib dates
        $scope.datePopups = {
            popups: {},
            open: function(popupId) {
                $scope.datePopups.popups[popupId].opened = true
            },
            dateOptions: {
                formatYear: 'yy',
                startingDay: 1
            },
            format: 'dd/MM/yyyy',
            altInputFormats: ['d!/M!/yyyy'],
            // Useful for hiding popup on other non-related field focus
            // Object property (instead of direct $scope var) because of
            // uib datepicker's non-assignable errors
            formFocusedElt: void(0)
        };
        // Created because same statement didn't work in used-at ng-focus
        $scope.formFocusElt = function (formFieldId) {
            $scope.datePopups.formFocusedElt = formFieldId;
        };
        // TODO: ensure timezone independence in date display

    });