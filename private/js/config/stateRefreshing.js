/**
 * Refresh access token on an API request.
 */
angular.module("ProjMngmnt")
    .config(function ($httpProvider) {

        $httpProvider.interceptors.push(function($q, $window, DBConstants, AuthenticationFuncs) {
            return {
                'response': function(response) {
                    // If host != API host, ignore
                    var url = response.config.url;
                    var urlParts = url.split("://");
                    var protocol = urlParts.length > 1 ? urlParts[0] : void(0);
                    if (protocol !== void(0)) {
                        var baseAddress = urlParts[0];
                        urlParts = urlParts[1].split("/");
                        baseAddress += "://" + urlParts[0];
                        if (baseAddress !== DBConstants.SERVER_ADDRESS) {
                            return $q.resolve(response);
                        }
                    }
                    // If access token is sent with response, refresh local one
                    if (response.headers("Authorization") !== null) {
                        var token = response.headers("Authorization").slice("Bearer ".length);
                        AuthenticationFuncs.setLocalState($window.localStorage, AuthenticationFuncs.getLocalStateInfo($window.localStorage), token);
                        AuthenticationFuncs.authenticateRequests($window.localStorage, $httpProvider);
                    }
                    return $q.resolve(response);
                }
            };
        });
    });