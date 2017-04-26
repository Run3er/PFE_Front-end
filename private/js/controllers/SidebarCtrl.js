
angular.module('ProjMngmnt')
	.controller('SidebarCtrl', function (Sidebar, $scope) {

        $scope.menu = {
        	"title": Sidebar.contents.title,
        	"entries": Sidebar.contents.entries,
			"menuActive": void(0),
			"menuExpanded": void(0),
			"subMenuActive": void(0)
		}
	});