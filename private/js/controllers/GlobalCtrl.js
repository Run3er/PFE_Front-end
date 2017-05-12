
angular.module('ProjMngmnt')
    .controller('GlobalCtrl', function ($scope, Global) {

        $scope.global = Global.global;
    });