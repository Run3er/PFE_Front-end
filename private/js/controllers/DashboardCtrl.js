
angular.module('ProjMngmnt')
    .controller('DashboardCtrl', function ($scope, $state, $filter, CommonConstants, UI, Sidebar, DB, projectLevelSpecifics) {
        // Navigation setup (not using onEnter because it's triggered before parent controller execution)
        Sidebar.setActiveMenuUrlBySuffix("dashboard");


        // Globals

        var viewData = UI.getDashboardViewData();
        var chartHolders = [];
        // var greenHue = '#64CF6F';
        // var redHue = '#FE5B54';
        // var yellowHue = '#FEBD55';
        var blueScales = d3.scale.category20c().range().slice(0, 4);
        var greenHue = blueScales[3];
        var redHue = blueScales[0];
        var yellowHue = blueScales[1];
        $scope.data = {};


        function dashboardInit(dashboardData) {
            // Status indicator
            $scope.data.status = dashboardData.status;

            // Budget & charge indicators
            $scope.data.budgetConsumed = dashboardData.budgetConsumed ? dashboardData.budgetConsumed : 0;
            $scope.data.budgetPrevisionGap = dashboardData.budgetPrevisionGap ? dashboardData.budgetPrevisionGap : 0;
            $scope.data.chargeConsumed = dashboardData.chargeConsumed ? dashboardData.chargeConsumed : 0;
            $scope.data.chargePrevisionGap = dashboardData.chargePrevisionGap ? dashboardData.chargePrevisionGap : 0;

            // Milestones timeline
            $scope.data.milestones = $filter("orderBy")(dashboardData.milestones, "dueDate");


            // Risks & Actions count charts

            // Set data
            function setCountData(counts, labelsMap, resultData) {
                Object.keys(counts).forEach(function (labeledCountKey) {
                    resultData.push({
                        label: labelsMap[labeledCountKey],
                        value: counts[labeledCountKey]
                    });
                });
            }
            var risksData = [];
            setCountData(dashboardData.riskStatusesCount, viewData.riskStatusLabelMap, risksData);
            $scope.data.risksEmpty = risksData.length === 0;
            var actionsData = [];
            setCountData(dashboardData.actionsOngoingInTimeOrNotCount, viewData.actionInTimeOrNotLabelMap, actionsData);
            $scope.data.actionsEmpty = actionsData.length === 0;

            // Chart generation function
            function addSimplePieChart(selector, data, colorsArrayAscendingGravity, noDataMsg) {
                var chartHolder = {};

                nv.addGraph(function() {
                    chartHolder.chart = nv.models.pieChart()
                        .x(function(d) { return d.label })
                        .y(function(d) { return d.value })
                        .color(colorsArrayAscendingGravity)
                        .labelType('value')
                        .legendPosition('bottom')
                        .valueFormat(d3.format('.0'))
                        .growOnHover(false)
                        .showLabels(true)
                        .noData(noDataMsg);

                    chartHolder.chart.tooltip.enabled(false);

                    d3.select(selector)
                        .datum(data)
                        .transition().duration(1200)
                        .call(chartHolder.chart);

                    return chartHolder.chart;
                });

                chartHolders.push(chartHolder);
                return chartHolder;
            }

            // Create Risks & Actions charts & feed them data
            var risksChartHolder = addSimplePieChart("#risksChart svg", risksData, [greenHue, yellowHue, redHue], "Aucun");
            var actionsChartHolder = addSimplePieChart("#actionsChart svg", actionsData, [greenHue, redHue], "Aucune");


            // Update Risks & Actions charts on container (svg) resize (ie. on media query change)
            var mq = window.matchMedia("(min-width: 1605px)");
            if (matchMedia) {
                mq.addListener(Width2xlg);
            }
            function Width2xlg(mq) {
                risksChartHolder.chart.update();
                actionsChartHolder.chart.update();
            }


            // AdvancementRatio Chart

            // AdvancementRatio chart variables
            var advancementRatioChartHolder = {};
            var advancementRatio_color = yellowHue;
            var advancementRatio_bgColor = "#F2F2F2";
            // AdvancementRatio Data
            var advancementRatioValue = dashboardData.advancement;
            var advancementRatioData = [
                {
                    "value": advancementRatioValue
                },
                {
                    "value": 1 - advancementRatioValue
                }
            ];

            // Create AdvancementRatio chart & Feed it data
            nv.addGraph(function() {
                advancementRatioChartHolder.chart = nv.models.pieChart()
                    .y(function(d) { return d.value })
                    .donut(true)
                    .donutRatio(0.75)
                    .showLabels(false)
                    .showLegend(false)
                    .growOnHover(false)
                    .color([advancementRatio_color, advancementRatio_bgColor]);

                advancementRatioChartHolder.chart.title(advancementRatioValue * 100+"%")
                    .tooltip.enabled(false);

                d3.select("#advancement-measure svg")
                    .datum(advancementRatioData)
                    .transition().duration(1200)
                    .call(advancementRatioChartHolder.chart);

                // LISTEN TO WINDOW RESIZE
                // nv.utils.windowResize(advancementRatioChartHolder.chart.update);
                // LISTEN TO CLICK EVENTS ON SLICES OF THE PIE/DONUT
                // advancementRatioChartHolder.chart.pie.dispatch.on('elementClick', function() {
                //     code...
                // });
                // advancementRatioChartHolder.chart.pie.dispatch.on('chartClick', function() {
                //     code...
                // });
                // LISTEN TO DOUBLECLICK EVENTS ON SLICES OF THE PIE/DONUT
                // advancementRatioChartHolder.chart.pie.dispatch.on('elementDblClick', function() {
                //     code...
                // });
                // LISTEN TO THE renderEnd EVENT OF THE PIE/DONUT
                // advancementRatioChartHolder.chart.pie.dispatch.on('renderEnd', function() {
                //     code...
                // });
                // OTHER EVENTS DISPATCHED BY THE PIE INCLUDE: elementMouseover, elementMouseout, elementMousemove
                // @see nv.models.pie

                chartHolders.push(advancementRatioChartHolder);
                return advancementRatioChartHolder.chart;
            });


            // SubAdvancements Chart

            // SubAdvancements chart variables
            var subAdvancementsChartHolder = {};
            // SubAdvancements Data
            var subAdvancementsData = [
                {
                    key: 'SubAdvancementsSeries',
                    values: []
                }
            ];
            function setSubProjectLevelAdvancement(projectLevelSingleName) {
                dashboardData[projectLevelSingleName + "sAdvancement"].forEach(function (subProjectLevelAdvancement) {
                    subAdvancementsData[0].values.push({
                        label: subProjectLevelAdvancement.name,
                        value: subProjectLevelAdvancement.advancement
                    });
                });
            }
            if (projectLevelSpecifics.type === CommonConstants.PROJECT_STRING) {
                setSubProjectLevelAdvancement(CommonConstants.SUB_PROJECT_STRING);
            }
            if (projectLevelSpecifics.type === CommonConstants.PROJECT_STRING
                    || projectLevelSpecifics.type === CommonConstants.SUB_PROJECT_STRING) {
                setSubProjectLevelAdvancement(CommonConstants.CONSTRUCTION_SITE_STRING);
            }

            $scope.data.subAdvancementsEmpty = subAdvancementsData[0].values.length === 0;

            // Create SubAdvancements chart & Feed it data
            nv.addGraph(function() {
                subAdvancementsChartHolder.chart = nv.models.multiBarHorizontalChart()
                    .x(function(d) { return d.label })
                    .y(function(d) { return d.value })
                    .barColor([greenHue, greenHue, redHue, redHue, yellowHue])
                    .showYAxis(false)
                    .duration(250)
                    .margin({left: 130})
                    .yDomain([0, 1])
                    .showValues(true)
                    .valueFormat(d3.format('.0%'))
                    .showLegend(false)
                    .showControls(false)
                    .noData("Aucun sous-groupe");

                subAdvancementsChartHolder.chart.tooltip.enabled(false);

                d3.select('#advancement-chart svg')
                    .datum(subAdvancementsData)
                    .call(subAdvancementsChartHolder.chart);

                nv.utils.windowResize(subAdvancementsChartHolder.chart.update);

                // chart.dispatch.on('stateChange', function(e) { nv.log('New State:', JSON.stringify(e)); });
                // chart.state.dispatch.on('change', function(state){
                //     nv.log('state', JSON.stringify(state));
                // });

                chartHolders.push(subAdvancementsChartHolder);
                return subAdvancementsChartHolder.chart;
            });
        }


        // Dashboard charts refresh function
        // this.refreshCharts = function () {
        //     for (var i = 0; i < chartHolders.length; i++) {
        // 		chartHolders[i].chart.update();
        //     }
        // }

        // remove media query on charts unload (controller/view unload)
        $scope.$on('destroy', function () {
            mq.removeListener(Width2xlg);
        });


        // Initialize controller behavior

        // Get DB layer data
        var uri = projectLevelSpecifics.urlPrefix;
        // Adapt to API resource uri nesting limit (1-level)
        var urlParts = uri.split("/");
        if (urlParts.length > 4) {
            uri = urlParts[urlParts.length - 4] + "/" + urlParts[urlParts.length - 3] + "/" +
                urlParts[urlParts.length - 2] + "/" + urlParts[urlParts.length - 1];
        }
        DB.getDashboard(uri)
            .then(function (dashboardData) {
                dashboardInit(dashboardData);
            },
            function (response) {
                if (response.status === 404) {
                    $state.go("404");
                }
                else {
                    // Set alert on the view
                }
            });

        $scope.differentYearDates = function(date1, date2) {
            var year1 = $filter("date")(date1, "yyyy");
            var year2 = $filter("date")(date2, "yyyy");
            return year1 !== year2;
        }
    });