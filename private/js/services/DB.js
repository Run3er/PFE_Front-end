
angular.module('ProjMngmnt')
    // Database layer mockup
    .service('DB', function ($q, $http) {
        var serverAddress = "http://localhost:9000";


        // TODO: remove completely
        var serverOn;

        // DB entries interface object
        this.getEntriesDAO = function (entryProps) {
            return {
                // Tenant specific data
                getAll: function () {
                    var entriesUriName= entryProps.type + "s";
                    var uri = (entryProps.uriPrefix ? entryProps.uriPrefix + "/" : "") + entriesUriName;

                    // Fetch data from DB
                    return $http.get(serverAddress + "/" + uri)
                        .then(function successCallback(response) {
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
                    // Entry addition logic
                    console.log("FAKE_SERVER--adding... " + JSON.stringify(entry));

                    // Return promise
                    return $q(function (resolve, reject) {
                        // Simulate request timelaps
                        setTimeout(function () {
                            // Simulate addition operation result
                            serverOn = true;

                            if (serverOn) {
                                // Get unique ID from DB ...
                                var id = new Date().getTime(); //[mockup]
                                resolve(id);
                                console.log('FAKE_SERVER--Success.');
                            }
                            else {
                                reject();
                                console.log('FAKE_SERVER--Failure.');
                            }
                        }, 1500);
                    });
                },
                update: function (entry) {
                    // Entry updating logic
                    console.log("FAKE_SERVER--updating... " + JSON.stringify(entry));

                    // Return promise
                    return $q(function (resolve, reject) {
                        // Simulate request timelaps
                        setTimeout(function () {
                            // Simulate addtion operation result
                            serverOn = true;

                            if (serverOn) {
                                resolve();
                                console.log('FAKE_SERVER--Success.');
                            }
                            else {
                                reject();
                                console.log('FAKE_SERVER--Failure.');
                            }
                        }, 1500);
                    });
                },
                delete: function (entry) {
                    // Entry deletion logic
                    console.log("FAKE_SERVER--deleting... " + JSON.stringify(entry));

                    // Return promise
                    return $q(function (resolve, reject) {
                        // Simulate request timelaps
                        setTimeout(function () {
                            // Simulate addtion operation result
                            serverOn = true;

                            if (serverOn) {
                                resolve();
                                console.log('FAKE_SERVER--Success.');
                            }
                            else {
                                reject();
                                console.log('FAKE_SERVER--Failure.');
                            }
                        }, 1500);
                    });
                }
            };
        };
    });