
angular.module('ProjMngmnt', ['ngRoute'])
	.config(function($routeProvider, $locationProvider) {
			// var resolveProjects = {
			// 	projects: function (Projects) {
			// 		return Projects.fetch();
			// 	}
			// };
		 
			$routeProvider
				.when('/', {
					templateUrl:'partials/void.html'
				})
				.when('/dashboard', {
					templateUrl:'partials/dashboard.html', 
					controller: 'DashboardCtrl'
				})
				.when('/actions', {
					templateUrl:'partials/actions.html'
				})
				// .when('/', {
				//   controller:'ProjectListController as projectList',
				//   templateUrl:'list.html',
				//   resolve: resolveProjects
				// })
				// .when('/edit/:projectId', {
				//   controller:'EditProjectController as editProject',
				//   templateUrl:'detail.html',
				//   resolve: resolveProjects
				// })
				.otherwise({
					redirectTo:'/'
				});
				
			// use the HTML5 History API
			$locationProvider.html5Mode(true);
		}
	);