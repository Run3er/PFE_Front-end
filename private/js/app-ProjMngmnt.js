
angular.module('ProjMngmnt', ['ngRoute'])
	.config(function($routeProvider, $locationProvider) {
			var entriesMap = [
				{
					url: "/actions", 
					resolveFn: function () {
						return {
							type: "action", 
							formTitle: "Ajouter une action"					
						};
					}
				}, 
				{
					url: "/risks", 
					resolveFn: function () {
						return {
							type: "risk", 
							formTitle: "Ajouter un risque"					
						};
					}
				}
			];

			$routeProvider
				.when('/', {
					// blank view
				})
				.when('/dashboard', {
					templateUrl:'partials/dashboard.html', 
					controller: 'DashboardCtrl'
				})
				.otherwise({
					redirectTo:'/'
				});
			// entries routes
			for (var i = 0; i < entriesMap.length; i++) {
				$routeProvider
					.when(entriesMap[i].url, {
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