
angular.module('ProjMngmnt')
	.controller('DashboardCtrl', function (Dashboard, $scope) {
			Dashboard.initCharts($scope);
		}
	);