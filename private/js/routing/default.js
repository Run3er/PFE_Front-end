
angular.module("ProjMngmnt")
    .config(function (CommonConstants, $stateProvider, $urlRouterProvider, $locationProvider) {

        // Default routing behavior
        $stateProvider
            .state("404", {
                // no url defined
                templateUrl: CommonConstants.PARTIALS_DIR + "/404-not-found.html"
            });

        $urlRouterProvider
            .when("/", "/general/")
            .otherwise(function ($injector) {
                var $state = $injector.get("$state");

                $state.go("404", null, {
                    location: false
                });
            });

        // Use the HTML5 History API for cleaner URLs
        // You have to specify the correct base in the html global
        //	template. exp: for an index page accessed through
        //	"localhost/ProjectX/", base is "/ProjectX/"
        $locationProvider.html5Mode(true);
    });