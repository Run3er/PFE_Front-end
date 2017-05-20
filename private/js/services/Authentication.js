
angular.module('ProjMngmnt')
    .service('Authentication', function ($http, $window, $location, $state, AuthenticationFuncs, DBConstants) {
        var apiAddress = DBConstants.SERVER_ADDRESS;
        var tenantPseudo = $location.host().split(".")[0];
        // TODO: remove from production (default tenant for dev. purposes only)
        if ($location.host() === "127.0.0.1" || $location.host() === "localhost") {
            tenantPseudo = "tenant_a";
        }

        this.login = function (login, password) {
            return $http.post(apiAddress + "/tenants/" + tenantPseudo + "/login", { user: login, password: password })
                .then(function (response) {
                    // store username and token in local storage to keep user logged in between page refreshes
                    $window.localStorage.setItem('state', JSON.stringify({ username: login, token: response.data.jwt }));

                    AuthenticationFuncs.authenticateRequests($window.localStorage, $http);
                });
        };

        this.logout = function () {
            // remove user from local storage and clear http auth header
            // $window.localStorage.currentUser = void(0);
            $window.localStorage.removeItem("state");
            $http.defaults.headers.common.Authorization = "";
            $state.go("login");
        };

        this.isUserAuthenticated = function () {
            return AuthenticationFuncs.isUserAuthenticated($window.localStorage);
        }
    });