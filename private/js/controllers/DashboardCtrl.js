
angular.module('ProjMngmnt')
    .controller('DashboardCtrl', function ($scope, Dashboard, Sidebar) {
            // Navigation setup (not using onEnter because it's triggered before parent controller execution)
            Sidebar.setActiveMenuUrlBySuffix("dashboard");

            Dashboard.initCharts($scope);
        }
    );