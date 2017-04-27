
angular.module('ProjMngmnt', ['ui.router'])
	.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
			var entriesMap = [
				{
					url: "/actions", 
					resolveFn: function () {
						return {
							type: "action"
						};
					}
				}, 
				{
					url: "/risks", 
					resolveFn: function () {
						return {
							type: "risk"
						};
					}
				}
			];

			$stateProvider
                .state('portfolio', {
                    url: '/portfolio',
                    controller: 'PortfolioCtrl'
                })
				.state('dashboard', {
					url: '/dashboard', 
					templateUrl: 'partials/dashboard.html', 
					controller: 'DashboardCtrl'
				})

                .state('404', {
                    // no url defined
                    template: '<div>404 Not Found.</div>'
                });

            $urlRouterProvider
                .when("/", "/portfolio")
                .otherwise(function($injector) {
                    var $state = $injector.get('$state');

                    $state.go('404', null, {
                        location: false
                    });
                });
		
			// entries routes
			for (var i = 0; i < entriesMap.length; i++) {
				$stateProvider
					.state(entriesMap[i].url, {
						url: entriesMap[i].url, 
						templateUrl:'partials/entries.html', 
						controller: 'EntriesCtrl', 
						resolve: {
							//	This does not work (but fails silently):
							// entriesSpecifics: function () {
							// 	return entriesMap[i].resolveFn();
							// }
							// .. cannot apparently use outer scope variables inside
							//	following's alternative inline function declaration.
							entriesSpecifics: entriesMap[i].resolveFn
						}
					});
			}

			// Use the HTML5 History API for cleaner URLs
			// You have to specify the correct base in the html global 
			//	template. exp: for an index page accessed through 
			//	"localhost/ProjectX/", base is "/ProjectX/"
			$locationProvider.html5Mode(true);
		}
	);