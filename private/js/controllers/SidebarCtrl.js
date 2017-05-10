
angular.module('ProjMngmnt')
    .controller('SidebarCtrl', function (Sidebar, $scope) {
        $scope.menu = Sidebar.getContent();

        $scope.subMenuActiveUrlIn = function (menuEntries) {
            return menuEntries.map(function(entry) {
               return entry.url;
            }).indexOf($scope.menu.activeMenuUrl) !== -1;
        }
    });