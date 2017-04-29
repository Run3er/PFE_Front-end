
angular.module('ProjMngmnt')
    .controller('SidebarCtrl', function (Sidebar, $scope) {
        $scope.menu = Sidebar.getContent();
    });