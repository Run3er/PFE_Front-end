
angular.module("ProjMngmnt")
    .constant("AuthenticationFuncs", {
        isUserAuthenticated: function (localStorage) {
            return localStorage.getItem("state") !== null;
        },
        authenticateRequests: function (localStorage, $http) {
            // If logged in user found, add jwt token to auth header for all requests made by the $http service
            var state = JSON.parse(localStorage.getItem("state"));
            if (state) {
                $http.defaults.headers.common.Authorization = "Bearer " + state.token;
            }
        }
    });