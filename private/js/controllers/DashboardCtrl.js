
angular.module('ProjMngmnt')
    .controller('DashboardCtrl', function ($scope, Dashboard, Sidebar, Header, $state, $stateParams) {
        // Navigation setup
        Sidebar.setMenuActive("dashboard");
        Header.getEntries().splice(-1, 1);
        Header.getEntries().push({
            title: "Tableau de bord",
            url: $state.href($state.current.name, $stateParams, {absolute: true})
        });

            Dashboard.initCharts($scope);
        }
    );