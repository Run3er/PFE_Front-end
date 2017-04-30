
angular.module('ProjMngmnt')
    .controller('HeaderCtrl', function (Header, Sidebar, $scope) {
        $scope.content = Header.content;
        $scope.sidebar = Sidebar;
    });