
angular.module("ProjMngmnt")
    .constant("AuthenticationFuncs", {
        setLocalState: function (localStorage, info, token) {
            localStorage.setItem('state', JSON.stringify({ info: info, token: token }));
        },
        getLocalStateInfo: function (localStorage) {
            return JSON.parse(localStorage.getItem("state")).info;
        },
        isUserAuthenticated: function (localStorage) {
            // Check token presence
            var state = localStorage.getItem("state");
            if (state === null) {
                return false;
            }

            // Get token content
            var tokenBase64 = JSON.parse(state).token.split('.')[1].replace('-', '+').replace('_', '/');
            var token = JSON.parse(window.atob(tokenBase64));

            // Check token expiration
            var exp = token.exp;
            if (exp !== void(0)) {
                var currentTime = Math.floor(new Date().getTime() / 1000);
                return currentTime < exp;
            }

            return true;
        },
        authenticateRequests: function (localStorage, http) {
            // If logged in user found, add jwt token to auth header for all requests made by the $http service
            var state = JSON.parse(localStorage.getItem("state"));
            if (state) {
                http.defaults.headers.common.Authorization = "Bearer " + state.token;
            }
        }
    });