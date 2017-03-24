
angular.module('ProjMngmnt')
	.controller('SidebarCtrl', function (Sidebar, $scope) {
			Sidebar.initClickListeners();
		}
	);