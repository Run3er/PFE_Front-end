
angular.module('ProjMngmnt')
    .run(function ($rootScope, $window, $http, $state, $location, AuthenticationFuncs) {
        $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
            // Try to authenticate on every page load (in case authenticated in other browser tab)
            AuthenticationFuncs.authenticateRequests($window.localStorage, $http);

            // Redirect to login if non-authenticated
            if (!AuthenticationFuncs.isUserAuthenticated($window.localStorage) && toState.name !== "login" && toState.name !== "logout") {
                event.preventDefault();
                $state.go("login", {state: toState.name}, {location: false});
            }
        });
    })
    .config(function ($stateProvider, CommonConstants) {
        $stateProvider
            .state("login", {
                // 'state' parameter is intended for internal use only
                url: "/login?state",
                templateUrl: CommonConstants.PARTIALS_DIR + "/login.html",
                controller: "LoginCtrl"
            })
            .state("logout", {
                url: "/logout",
                controller: function ($state, Authentication) {
                    Authentication.logout();
                    $state.go("login", null, {location: "replace"});
                }
            });
    });