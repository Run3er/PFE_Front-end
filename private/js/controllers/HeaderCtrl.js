
angular.module('ProjMngmnt')
    .controller('HeaderCtrl', function (Header, $scope) {
        $scope.content = Header.content;
    });