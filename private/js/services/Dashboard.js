
angular.module('ProjMngmnt')
	.service('Dashboard', function () {
		// Globals
		var chartHolders = [];
		var greenHue = '#64CF6F';
		var redHue = '#FE5B54';
		var yellowHue = '#FEBD55';



		/* Risks & Actions Charts */

		// Risks & Actions Labels
		var riskLabels_AscendingGravity = ["Maîtrisé","Moyen", "Élevé"];
		var actionLabels_AscendingGravity = ["À temps", "En retard"];
		// Risks & Actions Values
		var riskValues_AscendingGravity = [5, 2, 4];
		var actionValues_AscendingGravity = [9, 14];
		// Risks & Actions Data
		var risksData = [
			{ 
				"label": riskLabels_AscendingGravity[0],
				"value" : riskValues_AscendingGravity[0]
			} , 
			{ 
				"label": riskLabels_AscendingGravity[1],
				"value" : riskValues_AscendingGravity[1]
			} , 
			{ 
				"label": riskLabels_AscendingGravity[2],
				"value" : riskValues_AscendingGravity[2]
			}
		];
		var actionsData = [
			{ 
				"label": actionLabels_AscendingGravity[0],
				"value" : actionValues_AscendingGravity[0]
			}, 
			{ 
				"label": actionLabels_AscendingGravity[1],
				"value" : actionValues_AscendingGravity[1]
			} 
		];

		// Risks & Actions chart creation function
		function addSimplePieChart(selector, data, colorsArrayAscendingGravity) {
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
		            .showLabels(true);
		        
		        chartHolder.chart.tooltip.enabled(false);

		        d3.select(selector)
		            .datum(data)
		            .transition().duration(1200)
		            .call(chartHolder.chart);

		        return chartHolder.chart;
		    });

		    return chartHolder;
		}



		/* AdvancementRatio & SubAdvancements Charts */

		// AdvancementRatio Value
		var advancementRatioValue = 0.36;
		// AdvancementRatio Data
		var advancementRatioData = [
		    {
		        "value": advancementRatioValue
		    },
		    {
		        "value": 1 - advancementRatioValue
		    }
		];
		// AdvancementRatio chart variables
		var advancementRatioChartHolder = {};
		var advancementRatio_color = yellowHue; /*"#7FC"*/
		var advancementRatio_bgColor = "#F2F2F2";


		// SubAdvancements Labels
		var SubAdvancementsLabelsOrdered = ["SousProjY", "SousProjZ", "Grands Travaux", "Plein De Tâches", "Phase de finalisation"];
		// SubAdvancements Values
		var SubAdvancementsValuesOrdered = [1, 0.64, 0.16, 0.28, 0.4];
		// SubAdvancements Data
		var SubAdvancementsData = [
		    {
		        key: 'SubAdvancementsSeries',
		        values: [
		            {
		                "label" : SubAdvancementsLabelsOrdered[0],
		                "value" : SubAdvancementsValuesOrdered[0]
		            } ,
		            {
		                "label" : SubAdvancementsLabelsOrdered[1],
		                "value" : SubAdvancementsValuesOrdered[1]
		            } ,
		            {
		                "label" : SubAdvancementsLabelsOrdered[2],
		                "value" : SubAdvancementsValuesOrdered[2]
		            } ,
		            {
		                "label" : SubAdvancementsLabelsOrdered[3],
		                "value" : SubAdvancementsValuesOrdered[3]
		            } ,
		            {
		                "label" : SubAdvancementsLabelsOrdered[4],
		                "value" : SubAdvancementsValuesOrdered[4]
		            }
		        ]
		    }
		];
		// SubAdvancements chart variables
		var subAdvancementsChartHolder = {};


		// Dashboard charts init function
		this.initCharts = function (controllerScope) {
			// if (chartHolders.length == 0) {
				// Chart holders array
				chartHolders = [];
				chartHolders.push(advancementRatioChartHolder);
				chartHolders.push(subAdvancementsChartHolder);

				// Create Risks & Actions charts & feed them data
				var risksChartHolder = addSimplePieChart("#risksChart svg", risksData, [greenHue, yellowHue, redHue]);
				chartHolders.push(risksChartHolder);
				var actionsChartHolder = addSimplePieChart("#actionsChart svg", actionsData, [greenHue, redHue]);
				chartHolders.push(actionsChartHolder);

				// Update Risks & Actions charts on container (svg) resize (ie. on media query change)
				var mq = window.matchMedia("(min-width: 1605px)");
				if (matchMedia) {
					mq.addListener(Width2xlg);
				}
				function Width2xlg(mq) {
				    risksChartHolder.chart.update();
				    actionsChartHolder.chart.update();
				}

				// remove media query on charts unload (controller/view unload)
				controllerScope.$on('destroy', function () {
					mq.removeListener(Width2xlg);
				})


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
				    return advancementRatioChartHolder.chart;
				});


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
				        .showControls(false);
					    
					subAdvancementsChartHolder.chart.tooltip.enabled(false);

				    d3.select('#advancement-chart svg')
				        .datum(SubAdvancementsData)
				        .call(subAdvancementsChartHolder.chart);

				    nv.utils.windowResize(subAdvancementsChartHolder.chart.update);

				    // chart.dispatch.on('stateChange', function(e) { nv.log('New State:', JSON.stringify(e)); });
				    // chart.state.dispatch.on('change', function(state){
				    //     nv.log('state', JSON.stringify(state));
				    // });
				    return subAdvancementsChartHolder.chart;
				});
			// }
		}
	
		// Dashboard charts refresh function
		// this.refreshCharts = function () {
		//     for (var i = 0; i < chartHolders.length; i++) {
		// 		chartHolders[i].chart.update();					
		//     }
		// }
	});