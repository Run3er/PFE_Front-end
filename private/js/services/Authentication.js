
angular.module('ProjMngmnt')
    .service('Authentication', function ($http, $window, $location, $state, AuthenticationFuncs, APIConstants) {
        var apiAddress = APIConstants.SERVER_ADDRESS;
        var tenantPseudo = $location.host().split(".")[0];
        // TODO: remove from production (default tenant for dev. purposes only)
        if ($location.host() === "127.0.0.1" || $location.host() === "localhost") {
            tenantPseudo = "tenant_a";
        }

        this.login = function (credentials) {
            return $http.post(apiAddress + "/tenants/" + tenantPseudo + "/login", { user: credentials.login, password: credentials.password, persistent: credentials.persistent })
                .then(function (response) {
                    AuthenticationFuncs.setLocalState($window.localStorage, {login: credentials.login}, response.data.jwt);
                    AuthenticationFuncs.authenticateRequests($window.localStorage, $http);
                });
        };

        this.logout = function () {
            // remove user from local storage and clear http auth header
            $window.localStorage.removeItem("state");
            $http.defaults.headers.common.Authorization = "";
            $state.go("login");
        };

        this.isUserAuthenticated = function () {
            return AuthenticationFuncs.isUserAuthenticated($window.localStorage);
        };

        this.getLocalStateInfo = function () {
            return AuthenticationFuncs.getLocalStateInfo($window.localStorage);
        }
    });