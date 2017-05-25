
angular.module('ProjMngmnt')
// Database layer mockup
    .service('DB', function ($q, $http, DBConstants) {
        // API server address
        var serverAddress = DBConstants.SERVER_ADDRESS;


        // TODO: make transactional
        // Transaction-unhandled entries (due to inter association with other entries)
        var nonTransactionallyPersistedEntries = [ "action", "pendingIssue", "communicationPlan" ];


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
                }, function (response) {
                    return $q.reject(response);
                });
        };

        this.getDashboard = function (projectLevelUri) {
            // Fetch data from DB
            return $http.get(serverAddress + "/" + projectLevelUri + "?projection=dashboard")
                .then(function successCallback(response) {
                    // Set to undefined, delete not necessary
                    response.data._links = void(0);

                    return response.data;
                }, function (response) {
                    return $q.reject(response);
                });
        };

        this.getEntryDAO = function (entryProps) {
            // Request base resource, as entry is supposedly an artificial entry from an API projection
            // TODO: restrict to that behavior, or else extend DAO functionality
            return {
                update: function (entry) {
                    console.log(entryProps.uriPrefix)
                    if (entry && entry.id) {
                        return $http.patch(serverAddress + "/" + entryProps.uriPrefix, entry)
                            .then(function (updatedEntry) {
                                // TODO: correct update failure behavior (failure promise must be triggered)
                                console.log(updatedEntry);

                                // Nothing to do here
                            });
                    }
                    return $q.reject();
                }
            };
        };

        // DB entries interface object
        this.getEntriesDAO = function (entryProps) {
            var entriesUriName = entryProps.type + "s";
            var uriPrefix = (entryProps.uriPrefix ? entryProps.uriPrefix + "/" : "");

            return {
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
                        }, function (response) {
                            return $q.reject(response);
                        });
                },
                add: function (entry) {
                    if (nonTransactionallyPersistedEntries.indexOf(entryProps.type) === -1) {
                        var postBody = uriPrefix.length === 0 ? entry : [ entry ];

                        return $http.post(serverAddress + "/" + uriPrefix + entriesUriName, postBody)
                            .then(function (response) {
                                var appendedEntryId;

                                if (uriPrefix.length === 0) {
                                    var urlParts = response.data._links.self.href.split("/");
                                    appendedEntryId = urlParts[urlParts.length - 1];
                                }
                                else {
                                    // Use transactional bulk entry add-n-associate API (via nested path)
                                    appendedEntryId = response.data[0];
                                }

                                return appendedEntryId;
                            });
                    }
                    else {
                        // Two times (non-transactional) operation; first persist the entry itself
                        return $http.post(serverAddress + "/" + entriesUriName, entry)
                            .then(function (response) {
                                var urlParts = response.data._links.self.href.split("/");
                                var appendedEntryId = urlParts[urlParts.length - 1];
                                var uriList = entriesUriName + "/" + appendedEntryId;

                                // Now, associate the persisted entry with its parent resource
                                return $http.post(serverAddress + "/" + uriPrefix + entriesUriName, uriList,
                                        { headers: { "Content-Type": "text/uri-list" } });
                            });
                    }
                },
                update: function (entry) {
                    if (entry && entry.id) {
                        return $http.patch(serverAddress + "/" + entriesUriName + "/" + entry.id, entry)
                            .then(function (updatedEntry) {
                                // TODO: correct update failure behavior (failure promise must be triggered)
                                console.log(updatedEntry);

                                // Nothing to do here
                            });
                    }
                    return $q.reject();
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