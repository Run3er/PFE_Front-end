
angular.module('ProjMngmnt')
    .controller('ActionsIndicatorsCtrl', function ($scope, $state, UI, DB, entrySpecifics) {
        var STATS_URI_SUFFIX = "/stats";

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


        function indicatorsInit(dashboardData) {
            // Set data
            function setCountData(counts, labelsMap, resultData) {
                Object.keys(counts).forEach(function (labeledCountKey) {
                    resultData.push({
                        label: labelsMap[labeledCountKey],
                        value: counts[labeledCountKey]
                    });
                });
            }
            var actionsOngoingCount = dashboardData.actionsOngoingInTimeCount + dashboardData.actionsOngoingLateCount;
            var actionsOngoingInTimePercentage = dashboardData.actionsOngoingInTimeCount / actionsOngoingCount;
            var actionsOngoingLatePercentage = 1 - actionsOngoingInTimePercentage;
            var actionsData = [
                {
                    label: viewData.actionInTimeOrNotLabelMap["true"],
                    value: actionsOngoingInTimePercentage
                },
                {
                    label: viewData.actionInTimeOrNotLabelMap["false"],
                    value: actionsOngoingLatePercentage
                }
            ];
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
                        .valueFormat(d3.format('.0%'))
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
            var actionsChartHolder = addSimplePieChart("#actionsChart svg", actionsData, [greenHue, redHue], "Aucune");


            // Update Actions chart on container (svg) resize (ie. on media query change)
            var mq = window.matchMedia("(min-width: 1605px)");
            if (matchMedia) {
                mq.addListener(Width2xlg);
            }
            function Width2xlg(mq) {
                actionsChartHolder.chart.update();
            }
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
        var uri = entrySpecifics.urlPrefix;
        // Adapt to API resource uri nesting limit (1-level)
        var urlParts = uri.split("/");
        if (urlParts.length > 4) {
            uri = urlParts[urlParts.length - 4] + "/" + urlParts[urlParts.length - 3] + "/" +
                urlParts[urlParts.length - 2] + "/" + urlParts[urlParts.length - 1];
        }
        DB.getByUri(uri + "/" + entrySpecifics.type + "s" + STATS_URI_SUFFIX)
            .then(function (statsData) {
                indicatorsInit(statsData);
                $scope.indicators = [
                    {
                        value: statsData.actionsOngoingInTimeCount + statsData.actionsOngoingLateCount,
                        label: "En cours",
                        hue: "neutral"
                    },
                    {
                        value: statsData.actionsOngoingLateCount,
                        label: "En cours en retard",
                        hue: "bad"
                    },
                    {
                        value: statsData.actionsOngoingInTimeCount,
                        label: "Dans les temps",
                        hue: "good"
                    },
                    {
                        value: statsData.actionsStandbyCount,
                        label: "En standby",
                        hue: "muted"
                    }
                ];
            },
            function (response) {
                if (response.status === 404) {
                    $state.go("404");
                }
                else {
                    // Set alert on the view
                }
            });
    });