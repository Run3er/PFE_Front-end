
angular.module('ProjMngmnt')
    .controller('SidebarCtrl', function ($scope, Sidebar, Global) {
        // Use global variables & hide overlay on page controller init.
        Global.global.sidebarOverlayOn = '';
        $scope.global = Global.global;

        $scope.menu = Sidebar.getContent();

        $scope.subMenuActiveUrlIn = function (menuEntries) {
            return menuEntries.map(function(entry) {
               return entry.url;
            }).indexOf($scope.menu.activeMenuUrl) !== -1;
        }
    });