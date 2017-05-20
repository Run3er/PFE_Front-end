
angular.module('ProjMngmnt')
    .controller('LoginCtrl', function ($scope, $state, $stateParams, $location, Authentication) {
        // Redirect to requested or default page
        function redirect() {
            if ($stateParams.state === void(0)) {
                $location.url("/").replace();
            } else {
                $state.go($stateParams.state, {location: "replace"});
            }
        }

        $scope.formSubmit = function () {
            $scope.submitEnabled = false;
            $scope.invalidCredential = void(0);
            Authentication.login($scope.credentials.login, $scope.credentials.password)
                .then(function (response) {
                    redirect();
                }, function (response) {
                    if (response.status === 401) {
                        switch (response.data.error) {
                            case "LOGIN INVALID":
                                $scope.invalidCredential = "login";
                                break;
                            case "PASSWORD INVALID":
                                $scope.invalidCredential = "password";
                                break;
                        }
                    } else {
                        console.log("server error/unreachable")
                        // TODO: show alert notification
                        $scope.alertOn = true;
                    }
                })
                .finally(function () {
                    $scope.submitEnabled = true;
                })
        };

        // Init.

        // If user uses login url while already logged in, redirect
        if (Authentication.isUserAuthenticated()) {
            redirect();
        }

        $scope.credentials = {
            login: "",
            password: ""
        };
        $scope.submitEnabled = true;
        $scope.invalidCredential = void(0);
    });