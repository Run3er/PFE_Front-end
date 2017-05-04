
angular.module('ProjMngmnt')
    // Database layer mockup
    .service('DB', function ($q, $http) {
        // API server address
        var serverAddress = "http://localhost:9000";


        // Tenant specific data
        this.getSingleResrcByUri = function (uri) {
            // Fetch data from DB
            return $http.get(serverAddress + "/" + uri)
                .then(function successCallback(response) {
                    var entry = response.data;

                    // Format data to desired simple array format
                    var urlParts = entry._links.self.href.split("/");
                    entry.id = urlParts[urlParts.length - 1];
                    // Set to undefined, delete not necessary
                    entry._links = void(0);

                    return entry;
                });
        };

        // DB entries interface object
        this.getEntriesDAO = function (entryProps) {
            var entriesUriName = entryProps.type + "s";
            var uriPrefix = (entryProps.uriPrefix ? entryProps.uriPrefix + "/" : "");

            return {
                // Tenant specific data
                getAll: function () {
                    // Fetch data from DB
                    return $http.get(serverAddress + "/" + uriPrefix + entriesUriName)
                        .then(function (response) {
                            var entries = response.data._embedded[entriesUriName];

                            // Format data to desired simple array format
                            for (var i = 0; i < entries.length; i++) {
                                var urlParts = entries[i]._links.self.href.split("/");
                                entries[i].id = urlParts[urlParts.length - 1];
                                // Set to undefined, delete not necessary
                                entries[i]._links = void(0);
                            }

                            return entries;
                        });
                },
                add: function (entry) {
                    var postBody;

                    if (uriPrefix.length === 0) {
                        postBody = entry;
                    }
                    else {
                        postBody = [ entry ];
                    }

                    return $http.post(serverAddress + "/" + uriPrefix + entriesUriName, postBody)
                        .then(function (response) {
                            var appendedEntryId = response.data[0];

                            return appendedEntryId;
                        });
                },
                update: function (entry) {

                    return $http.patch(serverAddress + "/" + entriesUriName + "/" + entry.id, entry)
                        .then(function (updatedEntry) {
                            // Nothing to do here
                        });
                },
                delete: function (entryId) {

                    return $http.delete(serverAddress + "/" + uriPrefix + entriesUriName + "/" + entryId)
                        .then(function () {
                            // Nothing to do here
                        });
                }
            };
        };
    });