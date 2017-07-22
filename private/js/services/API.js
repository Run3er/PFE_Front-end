
angular.module('ProjMngmnt')
// Database layer mockup
    .service('API', function ($q, $http, APIConstants) {
        // API server address
        var serverAddress = APIConstants.SERVER_ADDRESS;


        this.getSingleResrcByUri = function (uri) {
            // Fetch data from API
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

        this.getFileByUri = function (uri) {
            // Fetch data from API
            return $http.get(serverAddress + "/" + uri)
                .then(function successCallback(response) {
                    return {
                        data: response.data,
                        name: response.headers('X-File-Name'),
                        contentType: response.headers('Content-Type')
                    };
                }, function (response) {
                    return $q.reject(response);
                });
        };

        this.getByUri = function (uri) {
            // Fetch data from API
            return $http.get(serverAddress + "/" + uri)
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

        // API entries interface object
        this.getEntriesDAO = function (entryProps) {
            var entriesUriName = entryProps.type + "s";
            var uriPrefix = (entryProps.uriPrefix ? entryProps.uriPrefix + "/" : "");

            return {
                getAll: function () {
                    // Fetch data from API
                    return $http.get(serverAddress + "/" + uriPrefix + entriesUriName)
                        .then(function (response) {
                            var entries = response.data._embedded[entriesUriName];

                            // Format data to desired simple array format
                            if (response.data._embedded.orderedProjectLevels === void(0)) {
                                for (var i = 0; i < entries.length; i++) {
                                    var urlParts = entries[i]._links.self.href.split("/");
                                    entries[i].id = urlParts[urlParts.length - 1];
                                    // Set to undefined, delete not necessary
                                    entries[i]._links = void(0);
                                }
                            }
                            else {
                                if (entries.length === 0) {
                                    // null means empty array received, but w/ projectLevels
                                    return null;
                                }
                                for (var i = 0; i < entries.length; i++) {
                                    entries[i].projectLevel = response.data._embedded.orderedProjectLevels[i];
                                }
                            }
                            return entries;
                        }, function (response) {
                            return $q.reject(response);
                        });
                },
                add: function (entry, fileKeysArray) {
                    var config;
                    if (fileKeysArray.length > 0) {
                        // TODO: use an alternative to 'FormData' (to support more browsers)
                        var formData = new FormData();
                        fileKeysArray.forEach(function (fileKeys) {
                            formData.set(fileKeys.objectKey, entry[fileKeys.objectKey], entry[fileKeys.nameKey]);
                            delete entry[fileKeys.objectKey];
                        });
                        Object.keys(entry).forEach(function (key) {
                            formData.set(key, entry[key]);
                        });

                        // entry = formData;
                        config = {
                            headers: {
                                // Assign content-type as undefined, the
                                // browser will assign the correct boundary
                                "Content-Type": undefined
                            },
                            // Prevents serializing payload
                            transformRequest: angular.identity
                        };
                        console.log(entry)
                    }
                    var postBody = uriPrefix.length === 0 ? entry : [ entry ];

                    return $http.post(serverAddress + "/" + uriPrefix + entriesUriName, formData, config)
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
                },
                update: function (entry, fileNamesArray) {
                    var headers;
                    if (fileNamesArray.length > 0) {
                        // TODO: use an alternative to 'FormData' (to support more browsers)
                        var formData = new FormData();
                        Object.keys(fileNamesArray).forEach(function (key) {
                            if (fileNamesArray.indexOf(key) === -1) {
                                formData[key] = entry[key];
                            }
                        });
                        fileNamesArray.forEach(function (fileName) {
                            formData.append(fileName, entry[fileName]);
                        });

                        entry = formData;
                        headers = {
                            "Content-Type": "multipart/form-data"
                        }
                    }

                    if (entry && entry.id) {
                        return $http.patch(serverAddress + "/" + entriesUriName + "/" + entry.id, entry, headers)
                            .then(function (updatedEntry) {
                                // TODO: correct update failure behavior (failure promise must be triggered)
                                console.log(updatedEntry);

                                // Nothing to do here
                            });
                    }
                    return $q.reject();
                },
                delete: function (entry) {

                    return $http.delete(serverAddress + "/" + uriPrefix + entriesUriName + "/" + entry.id)
                        .then(function () {
                            // Nothing to do here
                        });
                }
            };
        };
    });